
import { useState, useEffect } from 'react';
import { EVENTS_DATA, EventData } from '../data/EventsData';

/**
 * Hook to get events data
 * Now uses static EVENTS_DATA from EventsData.ts which is synced with the web team
 * Images and all event details are hardcoded to match the web admin panel
 */
export const useEvents = () => {
    const [events, setEvents] = useState<EventData[]>(EVENTS_DATA);
    const [loading, setLoading] = useState(false); // No loading since it's static
    const [error, setError] = useState<string | null>(null);

    // Simulate async behavior if needed for compatibility
    useEffect(() => {
        setEvents(EVENTS_DATA);
    }, []);

    const refetch = () => {
        // Refetch just reloads the static data
        setEvents(EVENTS_DATA);
    };

    return { events, loading, error, refetch };
};
