"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIntakeDate = void 0;
const date_fns_1 = require("date-fns");
const isIntakeDate = ({ frequency, currentDate, startDate, }) => {
    if (!(frequency && currentDate && startDate)) {
        return false;
    }
    switch (frequency.type) {
        case 'EVERYDAY': {
            return true;
        }
        case 'EVERY_X_DAY': {
            const daysFromStart = (0, date_fns_1.differenceInCalendarDays)(currentDate, startDate);
            const remainder = daysFromStart % frequency.everyXDay;
            return remainder === 0;
        }
        case 'SPECIFIC_DAYS_OF_WEEK': {
            const dayOfWeek = (0, date_fns_1.format)(currentDate, 'EEEE').toUpperCase();
            return frequency.specificDaysOfWeek.includes(dayOfWeek);
        }
        case 'SPECIFIC_DAYS_OF_MONTH': {
            const dayOfMonth = (0, date_fns_1.getDate)(currentDate);
            return frequency.specificDaysOfMonth.includes(dayOfMonth);
        }
        case 'ODD_EVEN_DAY': {
            const dayOfMonth = (0, date_fns_1.getDate)(currentDate);
            return frequency.oddEvenDay.isOddDay === (dayOfMonth % 2 === 1);
        }
        case 'ON_OFF_DAYS': {
            const daysFromStart = (0, date_fns_1.differenceInCalendarDays)(currentDate, startDate);
            const remainder = daysFromStart % (frequency.onOffDays.onDays + frequency.onOffDays.offDays);
            return remainder < frequency.onOffDays.onDays;
        }
    }
};
exports.isIntakeDate = isIntakeDate;
