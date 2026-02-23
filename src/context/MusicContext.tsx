import React, { createContext, useState, useContext, useRef, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { AppState } from 'react-native';
import MusicService from '../services/MusicService';

/* ── split contexts ───────────────────────────────────────── */

/** Components that read `isPlaying` subscribe here (re-render on change). */
const MusicStateContext = createContext<boolean>(false);

/** Stable action bag — never triggers re-renders in dispatch-only consumers. */
interface MusicActions {
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}
const MusicDispatchContext = createContext<MusicActions | undefined>(undefined);

/* ── provider ─────────────────────────────────────────────── */

export const MusicProvider = ({ children }: { children: ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    /* Keep a ref synced with isPlaying so the AppState listener
       never closes over a stale value and never needs re-subscribing. */
    const isPlayingRef = useRef(isPlaying);
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    /* Attach AppState listener ONCE — ref gives latest state */
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState.match(/inactive|background/) && isPlayingRef.current) {
                MusicService.pauseMusic();
                setIsPlaying(false);
            }
        });

        return () => {
            subscription.remove();
            /* Release Sound instance when provider unmounts (app termination) */
            MusicService.unloadMusic();
        };
    }, []);

    /* Stable actions object — setIsPlaying is guaranteed stable by React,
       so the memoised bag never changes and dispatch consumers never re-render. */
    const actions = useMemo<MusicActions>(() => ({ setIsPlaying }), []);

    return (
        <MusicDispatchContext.Provider value={actions}>
            <MusicStateContext.Provider value={isPlaying}>
                {children}
            </MusicStateContext.Provider>
        </MusicDispatchContext.Provider>
    );
};

/* ── hooks ────────────────────────────────────────────────── */

/** Subscribe to isPlaying — use only if the component renders based on play state. */
export const useMusicState = () => useContext(MusicStateContext);

/** Get stable action bag — component does NOT re-render on isPlaying change. */
export const useMusicDispatch = () => {
    const ctx = useContext(MusicDispatchContext);
    if (!ctx) throw new Error('useMusicDispatch must be used within MusicProvider');
    return ctx;
};

/**
 * Legacy combined hook — keeps existing call-sites working.
 * Components using this will re-render on every isPlaying change.
 */
export const useMusicContext = () => {
    const isPlaying = useMusicState();
    const { setIsPlaying } = useMusicDispatch();
    return { isPlaying, setIsPlaying };
};
