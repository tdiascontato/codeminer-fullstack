// src/utils/dateUtils.js
export const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    startOfWeek.setDate(diff);
    return startOfWeek;
};

export const getDayOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
};

export const getFormattedTime = (date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${(date.getMinutes() === 0 ? '00' : '30')}`;
};
