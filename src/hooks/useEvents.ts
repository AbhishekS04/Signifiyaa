
import { EVENTS_DATA, EventData } from '../data/EventsData';

/**
 * Hook to get events data
 * Uses static EVENTS_DATA directly — no unnecessary state or effects.
 * Kept as a hook for API compatibility in case we switch to a live backend later.
 */

// Static return object avoids creating a new object on every call
const STATIC_RESULT = {
    events: EVENTS_DATA,
    loading: false as const,
    error: null as string | null,
    refetch: () => {},
};

export const useEvents = () => STATIC_RESULT;
