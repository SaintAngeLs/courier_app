export function dateFromUTCToLocal(utcString : string) {
    const utcDate = new Date(utcString);
    const localDate = new Date(utcDate.getTime() + 60 * 60 * 1000);
    return localDate.toISOString();
};

export default dateFromUTCToLocal;