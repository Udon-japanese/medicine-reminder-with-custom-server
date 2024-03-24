"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDateIntakeTimes = void 0;
const date_fns_1 = require("date-fns");
const getCurrentDateIntakeTimes = ({ medicine, currentDate, }) => {
    var _a, _b, _c;
    if (((_a = medicine === null || medicine === void 0 ? void 0 : medicine.frequency) === null || _a === void 0 ? void 0 : _a.type) === 'EVERYDAY') {
        const everyday = medicine.frequency.everyday;
        if (((_b = everyday === null || everyday === void 0 ? void 0 : everyday.weekends) === null || _b === void 0 ? void 0 : _b.length) && ((_c = everyday.weekendIntakeTimes) === null || _c === void 0 ? void 0 : _c.length)) {
            const { weekends, weekendIntakeTimes } = everyday;
            const dayOfWeek = (0, date_fns_1.format)(currentDate, 'EEEE').toUpperCase();
            if (weekends.includes(dayOfWeek)) {
                return weekendIntakeTimes;
            }
        }
    }
    return medicine.intakeTimes;
};
exports.getCurrentDateIntakeTimes = getCurrentDateIntakeTimes;
