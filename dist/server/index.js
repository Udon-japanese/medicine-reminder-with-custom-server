"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const webPush_1 = require("@/lib/webPush");
const prismadb_1 = require("@/lib/prismadb");
const date_fns_1 = require("date-fns");
const isIntakeDate_1 = require("@/utils/isIntakeDate");
const cloudinary_1 = require("@/app/api/lib/cloudinary");
const getCurrentDateIntakeTimes_1 = require("@/utils/getCurrentDateIntakeTimes");
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app.prepare();
        const server = (0, express_1.default)();
        node_schedule_1.default.scheduleJob('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            const currentDate = new Date();
            const currentHours = (0, date_fns_1.getHours)(currentDate);
            const currentMinutes = (0, date_fns_1.getMinutes)(currentDate);
            const currentTimeInMinutes = currentHours * 60 + currentMinutes;
            const completedOrSkippedMedicineRecords = yield prismadb_1.prisma.medicineRecord.findMany({
                where: {
                    OR: [{ isCompleted: true }, { isSkipped: true }],
                    scheduledIntakeTime: currentTimeInMinutes,
                },
                select: {
                    medicineId: true,
                },
            });
            const completedOrSkippedMedicineIds = completedOrSkippedMedicineRecords.map((m) => m.medicineId);
            const meds = yield prismadb_1.prisma.medicine.findMany({
                where: {
                    NOT: {
                        id: {
                            in: completedOrSkippedMedicineIds,
                        },
                    },
                    notify: true,
                    OR: [
                        {
                            intakeTimes: {
                                some: {
                                    time: currentTimeInMinutes,
                                },
                            },
                        },
                        {
                            frequency: {
                                everyday: {
                                    weekendIntakeTimes: {
                                        some: {
                                            time: currentTimeInMinutes,
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
                include: {
                    intakeTimes: true,
                    frequency: {
                        include: {
                            everyday: {
                                include: {
                                    weekendIntakeTimes: true,
                                },
                            },
                            oddEvenDay: true,
                            onOffDays: true,
                        },
                    },
                    period: true,
                    memo: true,
                    stock: true,
                },
            });
            const currentMedicines = meds.filter((m) => {
                var _a, _b, _c, _d;
                const { frequency, period } = m;
                if (!(frequency && (period === null || period === void 0 ? void 0 : period.startDate)))
                    return false;
                if (frequency.type === 'EVERYDAY' && ((_b = (_a = frequency.everyday) === null || _a === void 0 ? void 0 : _a.weekends) === null || _b === void 0 ? void 0 : _b.length) && ((_d = (_c = frequency.everyday) === null || _c === void 0 ? void 0 : _c.weekendIntakeTimes) === null || _d === void 0 ? void 0 : _d.length)) {
                    const { weekends, weekendIntakeTimes } = frequency.everyday;
                    const dayOfWeek = (0, date_fns_1.format)(currentDate, 'EEEE').toUpperCase();
                    if (weekends.includes(dayOfWeek)) {
                        if (weekendIntakeTimes.some((t) => t.time === currentTimeInMinutes)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
                return (0, isIntakeDate_1.isIntakeDate)({ frequency, currentDate, startDate: period === null || period === void 0 ? void 0 : period.startDate });
            });
            const medicinesToUpdate = currentMedicines
                .map((m) => {
                var _a, _b, _c;
                const stockQuantity = (_a = m.stock) === null || _a === void 0 ? void 0 : _a.quantity;
                const dosage = (_c = (_b = (0, getCurrentDateIntakeTimes_1.getCurrentDateIntakeTimes)({ medicine: m, currentDate })) === null || _b === void 0 ? void 0 : _b.find((i) => i.time === currentTimeInMinutes)) === null || _c === void 0 ? void 0 : _c.dosage;
                return Object.assign(Object.assign({}, m), { stockQuantity: stockQuantity ? stockQuantity : NaN, dosage: dosage ? dosage : NaN });
            })
                .filter((m) => {
                var _a;
                return ((_a = m.stock) === null || _a === void 0 ? void 0 : _a.autoConsume) &&
                    m.stockQuantity &&
                    m.dosage &&
                    m.stockQuantity >= m.dosage;
            });
            yield prismadb_1.prisma.$transaction(medicinesToUpdate.map((medicine) => prismadb_1.prisma.medicine.update({
                where: {
                    id: medicine.id,
                },
                data: {
                    stock: {
                        update: {
                            quantity: Math.max(0, medicine.stockQuantity - medicine.dosage),
                        },
                    },
                },
            })));
            const userMedicines = new Map();
            for (const medicine of currentMedicines) {
                const userId = medicine.userId;
                const medicineName = medicine.name;
                const imageId = (_a = medicine === null || medicine === void 0 ? void 0 : medicine.memo) === null || _a === void 0 ? void 0 : _a.imageId;
                let imageUrl;
                if (!userMedicines.has(userId)) {
                    userMedicines.set(userId, []);
                }
                const userMedicineList = userMedicines.get(userId);
                const userHasMedicineWithImage = userMedicineList === null || userMedicineList === void 0 ? void 0 : userMedicineList.some((m) => m.imageUrl);
                if (imageId && !userHasMedicineWithImage) {
                    const imgUrl = yield (0, cloudinary_1.getImageUrlByIdServer)(imageId);
                    if (imgUrl)
                        imageUrl = imgUrl;
                }
                (_b = userMedicines.get(userId)) === null || _b === void 0 ? void 0 : _b.push({ imageUrl, name: medicineName });
            }
            for (const [userId, medicines] of userMedicines) {
                const pushSubscriptions = yield prismadb_1.prisma.pushSubscription.findMany({
                    where: {
                        userId,
                    },
                });
                const formattedCurrentDate = (0, date_fns_1.format)(currentDate, 'M月dd日 H:mm');
                if (!pushSubscriptions || pushSubscriptions.length === 0)
                    continue;
                for (const subscription of pushSubscriptions) {
                    const pushSubscription = {
                        endpoint: subscription.endpoint,
                        keys: {
                            auth: subscription.authKey,
                            p256dh: subscription.p256dhkey,
                        },
                    };
                    const payload = JSON.stringify({
                        body: `${medicines.map((m) => m.name).join(' ')} ${formattedCurrentDate}`,
                        image: (_c = medicines.find((m) => m.imageUrl)) === null || _c === void 0 ? void 0 : _c.imageUrl,
                    });
                    yield webPush_1.webPush.sendNotification(pushSubscription, payload);
                }
            }
        }));
        server.all('*', (req, res) => {
            return handle(req, res);
        });
        const port = process.env.PORT || 3000;
        server.listen(port, () => {
            console.info(`Listening on port ${port}`);
        });
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}))();
