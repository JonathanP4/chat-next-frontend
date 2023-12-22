export function getTime(date: string) {
    if (!date) return "";
    const hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
}
