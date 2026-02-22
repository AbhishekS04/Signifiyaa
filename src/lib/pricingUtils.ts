export interface DiscountInfo {
    discount: number; // 0.10 for 10%
    percentage: number; // 10 for 10%
    label: string;
}

/**
 * Returns the active discount configuration based on current mobile date and time.
 * - Feb 23: 18:00 - 23:59 (6 hours) -> 10% off
 * - Mar 01: 12:00 - 23:59 (12 hours) -> 5% off
 * - Mar 22: 00:00 - 23:59 (24 hours) -> 10% off
 */
export const getActiveDiscount = (): DiscountInfo | null => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1; // 1-indexed (Jan=1, Feb=2...)
    const year = now.getFullYear();
    const hours = now.getHours();

    // 1. Feb 23rd - 6 hrs (assuming 6:00 PM to 12:00 AM)
    if (year === 2026 && month === 2 && day === 23) {
        if (hours >= 18 && hours < 24) {
            return { discount: 0.10, percentage: 10, label: 'FLASH SALE (6-HOUR)' };
        }
    }

    // 2. 1st March - 12hrs (assuming 12:00 PM to 12:00 AM)
    if (year === 2026 && month === 3 && day === 1) {
        if (hours >= 12 && hours < 24) {
            return { discount: 0.05, percentage: 5, label: 'SPECIAL OFFER (12-HOUR)' };
        }
    }

    // 3. 22nd March - 24hrs (Full Day)
    if (year === 2026 && month === 3 && day === 22) {
        return { discount: 0.10, percentage: 10, label: 'SUPER SALE (24-HOUR)' };
    }

    return null;
};

/**
 * Calculates the price after applying active discounts.
 * @param price The original price
 * @returns The discounted price (rounded down)
 */
export const calculateDiscountedPrice = (price: number): number => {
    const offer = getActiveDiscount();
    if (offer) {
        return Math.floor(price * (1 - offer.discount));
    }
    return price;
};
