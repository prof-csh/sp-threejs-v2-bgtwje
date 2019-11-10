export function clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
}

export function mapRange(value: number, low1: number, high1: number, low2: number, high2: number): number {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}