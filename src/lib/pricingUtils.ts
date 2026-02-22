export interface DiscountInfo {
    discount: number; // 0.10 for 10%
    percentage: number; // 10 for 10%
    label: string;
}

export type DiscountCategory = 'EVENT' | 'VISITOR';

/**
 * Returns the active discount configuration based on current mobile date and time.
 */
export const getActiveDiscount = (category: DiscountCategory = 'EVENT'): DiscountInfo | null => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1; // 1-indexed (Jan=1, Feb=2...)
    const year = now.getFullYear();
    const currentTimeMs = now.getTime();

    const getMs = (m: number, d: number, h: number, min: number = 0) => {
        return new Date(2026, m - 1, d, h, min).getTime();
    };

    if (category === 'EVENT') {
        // 1. Launch Offer – 23rd Feb, 12:00 PM – 6:00 PM (10% OFF)
        if (currentTimeMs >= getMs(2, 23, 12) && currentTimeMs < getMs(2, 23, 18)) {
            return { discount: 0.10, percentage: 10, label: 'LAUNCH OFFER (10% OFF)' };
        }

        // 2. Holi Special – 4th March, 11:00 AM – 11:00 PM (5% OFF)
        if (currentTimeMs >= getMs(3, 4, 11) && currentTimeMs < getMs(3, 4, 23)) {
            return { discount: 0.05, percentage: 5, label: 'HOLI FESTIVE SALE (5% OFF)' };
        }

        // 3. Weekend Special – 15th March, 11:00 AM – 11:00 PM (5% OFF)
        if (currentTimeMs >= getMs(3, 15, 11) && currentTimeMs < getMs(3, 15, 23)) {
            return { discount: 0.05, percentage: 5, label: 'WEEKEND BLAST OFFER (5% OFF)' };
        }

        // 4. Final 24 Hours – 22nd March 12:00 PM to 23rd March 12:00 PM (10% OFF)
        if (currentTimeMs >= getMs(3, 22, 12) && currentTimeMs < getMs(3, 23, 12)) {
            return { discount: 0.10, percentage: 10, label: 'LAST CHANCE OFFER (10% OFF)' };
        }
    }

    if (category === 'VISITOR') {
        // 1. Holi sale: 12 hr 10% off
        if (currentTimeMs >= getMs(3, 4, 11) && currentTimeMs < getMs(3, 4, 23)) {
            return { discount: 0.10, percentage: 10, label: 'HOLI SALE (10% OFF)' };
        }

        // 2. Last 24 hr sale: 24 hr 10% off
        if (currentTimeMs >= getMs(3, 22, 12) && currentTimeMs < getMs(3, 23, 12)) {
            return { discount: 0.10, percentage: 10, label: '24-HOUR SALE (10% OFF)' };
        }
    }

    return null;
};

/**
 * Calculates the price after applying active discounts.
 */
export const calculateDiscountedPrice = (price: number, category: DiscountCategory = 'EVENT'): number => {
    const offer = getActiveDiscount(category);
    if (offer) {
        return Math.floor(price * (1 - offer.discount));
    }
    return price;
};
