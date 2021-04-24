export function isValidDate(date: unknown): boolean {
    return date instanceof Date && !Number.isNaN(date);
}
