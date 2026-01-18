export const getLocalDateString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

export const isSameDay = (d1, d2) => {
    return d1 && d2 && 
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() && 
        d1.getDate() === d2.getDate();
};

export const toLocalISO = (d) => {
    const offset = d.getTimezoneOffset();
    const adjusted = new Date(d.getTime() - (offset*60*1000));
    return adjusted.toISOString().split('T')[0];
};
