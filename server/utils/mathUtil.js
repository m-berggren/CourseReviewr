// Helper function to round to nearest .5 or full number
export const roundToNearestHalf = (num) => {
    return Math.round(num * 2) / 2; // Multiply by 2, round, and divide by 2 (for example 2.3 x 2 = 4.6 -> rounded to 5 -> 5 / 2 = 2.5)
};