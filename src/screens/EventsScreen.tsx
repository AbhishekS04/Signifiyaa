import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Platform, FlatList, StyleSheet, Pressable, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { EventData } from '../data/EventsData';
import { useEvents } from '../hooks/useEvents';
import EventsHeader from '../components/ui/EventsHeader';
import SketchyEventCard from '../components/ui/SketchyEventCard';
import { PageTransition } from '../components/navigation/PageTransition';
import Svg, { Text as SvgText } from 'react-native-svg';

/* ── module-scope constants ───────────────────────────────── */


const MONO_FONT = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

interface DayCfg { bg: string; tagBg: string; date: string; label: string }
const DAY_CFG: Readonly<Record<1 | 2, DayCfg>> = Object.freeze({
    1: { bg: '#FFF8E1', tagBg: '#FFEB3B', date: '27th March, 2026', label: 'Day 1' },
    2: { bg: '#E0F7FA', tagBg: '#4DD0E1', date: '28th March, 2026', label: 'Day 2' },
});

/* ── flat-list data model ─────────────────────────────────── */
type FlatItem =
    | { type: 'day-start'; key: string; day: 1 | 2 }
    | { type: 'event'; key: string; event: EventData; idx: number; day: 1 | 2 }
    | { type: 'empty'; key: string; day: 1 | 2 }
    | { type: 'day-end'; key: string; day: 1 | 2 };

function buildFlatData(events: EventData[], filter: string): FlatItem[] {
    const out: FlatItem[] = [];
    for (const day of [1, 2] as const) {
        const dayEvts =
            filter === 'ALL'
                ? events.filter(e => e.day === day)
                : events.filter(e => e.day === day && e.category === filter);

        out.push({ type: 'day-start', key: `ds-${day}`, day });

        if (dayEvts.length > 0) {
            dayEvts.forEach((ev, i) =>
                out.push({ type: 'event', key: `ev-${ev.id}`, event: ev, idx: i, day }),
            );
        } else {
            out.push({ type: 'empty', key: `em-${day}`, day });
        }

        out.push({ type: 'day-end', key: `de-${day}`, day });
    }
    return out;
}

/* ── memoized sub-components ──────────────────────────────── */

/** Horizontal filter pill */
const FilterButton = React.memo(({ label, active, onPress }: {
    label: string; active: boolean; onPress: () => void;
}) => (
    <Pressable onPress={onPress} style={[s.filterPill, active ? s.filterActive : s.filterInactive]}>
        <Text style={[s.filterText, active ? s.filterTextActive : s.filterTextInactive]}>{label}</Text>
    </Pressable>
));

/** Top cap of a day card — date badge, SVG title, sub-label */
const DayCardStart = React.memo(({ day }: { day: 1 | 2 }) => {
    const c = DAY_CFG[day];
    return (
        <View style={s.cardOuter}>
            <View style={[s.cardTop, { backgroundColor: c.bg }]}>
                <View style={s.hdrArea}>
                    {/* Date badge */}
                    <View style={s.badgeWrap}>
                        <View style={s.badgeRel}>
                            <View style={s.badgeShadow} />
                            <View style={[s.badge, { backgroundColor: c.tagBg }]}>
                                <Text style={s.badgeText}>{c.date}</Text>
                            </View>
                        </View>
                    </View>
                    {/* SVG title */}
                    <View style={s.svgBox}>
                        <Svg height="100%" width="100%">
                            <SvgText fill="black" fontSize="85" fontFamily="ArchivoBlack_400Regular" x="6" y="86" letterSpacing="-4">{c.label}</SvgText>
                            <SvgText stroke="black" strokeWidth="5" fill="black" fontSize="85" fontFamily="ArchivoBlack_400Regular" x="0" y="80" letterSpacing="-4">{c.label}</SvgText>
                            <SvgText fill="white" fontSize="85" fontFamily="ArchivoBlack_400Regular" x="0" y="80" letterSpacing="-4">{c.label}</SvgText>
                        </Svg>
                    </View>
                    {/* Sub-label */}
                    <View style={s.subBadge}>
                        <Text style={s.subBadgeText}>Events & Guidelines</Text>
                    </View>
                </View>
            </View>
        </View>
    );
});

/** Single virtualized event row inside the card band */
const EventRow = React.memo(({ event, idx, day, onReg, onDet }: {
    event: EventData; idx: number; day: 1 | 2;
    onReg: (e: EventData) => void; onDet: (e: EventData) => void;
}) => {
    const pressReg = useCallback(() => onReg(event), [onReg, event]);
    const pressDet = useCallback(() => onDet(event), [onDet, event]);
    return (
        <View style={s.cardOuter}>
            <View style={[s.cardMid, { backgroundColor: DAY_CFG[day].bg }]}>
                <SketchyEventCard
                    item={event}
                    index={idx}
                    onPressRegister={pressReg}
                    onPressDetails={pressDet}
                />
            </View>
        </View>
    );
});

/** Empty-state row inside the card band */
const EmptyRow = React.memo(({ day }: { day: 1 | 2 }) => (
    <View style={s.cardOuter}>
        <View style={[s.cardMid, { backgroundColor: DAY_CFG[day].bg }]}>
            <View style={s.emptyWrap}>
                <Text style={s.emptyText}>No Day {day} events!</Text>
            </View>
        </View>
    </View>
));

/** Bottom cap of a day card */
const DayCardEnd = React.memo(({ day }: { day: 1 | 2 }) => (
    <View style={day === 1 ? s.cardEndDay1 : s.cardEndDay2}>
        <View style={[s.cardBot, { backgroundColor: DAY_CFG[day].bg }]} />
    </View>
));

/* ── main screen ──────────────────────────────────────────── */
const EventsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const [activeFilter, setActiveFilter] = useState('ALL');
    const { events } = useEvents();
    const flatListRef = React.useRef<FlatList>(null);

    /* Flattened data — every event is its own FlatList item */
    const flatData = useMemo(() => buildFlatData(events, activeFilter), [events, activeFilter]);

    React.useEffect(() => {
        if (route.params?.eventId && flatData.length > 0 && flatListRef.current) {
            const index = flatData.findIndex(item => item.type === 'event' && item.event.id === route.params.eventId);
            if (index !== -1) {
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.1 });
                }, 300);
            }
        }
    }, [route.params?.eventId, flatData]);

    /* Functional updater kept pure — haptic fires before setState */
    const handleFilterChange = useCallback((f: string) => {
        setActiveFilter(prev => {
            if (prev === f) return prev;
            // Side-effect moved outside updater (see below)
            return f;
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, []);

    /* Pre-bound per-filter handlers — avoids inline closures in render */
    // const filterHandlers = useMemo(
    //     () => FILTERS.map(f => () => handleFilterChange(f)),
    //     [handleFilterChange],
    // );

    const handleRegister = useCallback((_: EventData) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        (navigation as any).navigate('EventRegistration');
    }, [navigation]);

    const handleDetails = useCallback((_: EventData) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, []);

    /* ListHeaderComponent — header + filter pills */
    const listHeader = useMemo(() => (
        <View>
            <View style={s.hdrPad}>
                <View style={s.hdrInner}>
                    <EventsHeader />
                </View>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.filterContent}
                style={s.filterScroll}
            >

            </ScrollView>
        </View>
    ), [activeFilter,]);

    /* Stable renderItem — no dependency on filter state */
    const renderItem = useCallback(({ item }: { item: FlatItem }) => {
        switch (item.type) {
            case 'day-start':
                return <DayCardStart day={item.day} />;
            case 'event':
                return (
                    <EventRow
                        event={item.event}
                        idx={item.idx}
                        day={item.day}
                        onReg={handleRegister}
                        onDet={handleDetails}
                    />
                );
            case 'empty':
                return <EmptyRow day={item.day} />;
            case 'day-end':
                return <DayCardEnd day={item.day} />;
            default:
                return null;
        }
    }, [handleRegister, handleDetails]);

    const keyExtractor = useCallback((item: FlatItem) => item.key, []);

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
            <PageTransition style={{ flex: 1 }}>
                <FlatList
                    ref={flatListRef}
                    data={flatData}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    ListHeaderComponent={listHeader}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={Platform.OS === 'android'}
                    initialNumToRender={8}
                    maxToRenderPerBatch={6}
                    windowSize={5}
                    onScrollToIndexFailed={(info) => {
                        const wait = new Promise(resolve => setTimeout(resolve, 500));
                        wait.then(() => {
                            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                        });
                    }}
                />
            </PageTransition>
        </SafeAreaView>
    );
};

export default EventsScreen;

/* ── styles ───────────────────────────────────────────────── */
const s = StyleSheet.create({
    /* header */
    hdrPad: { paddingHorizontal: 16 },
    hdrInner: { marginTop: 16, marginBottom: 32 },

    /* filter row */
    filterScroll: { marginBottom: 16 },
    filterContent: { paddingHorizontal: 16, gap: 8 },
    filterPill: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#000',
    },
    filterActive: { backgroundColor: '#000' },
    filterInactive: { backgroundColor: '#FFF' },
    filterText: {
        fontFamily: 'Gilton',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    filterTextActive: { color: '#FFF' },
    filterTextInactive: { color: '#000' },

    /* card segments — split across FlatList items for true virtualization */
    cardOuter: { paddingHorizontal: 16 },
    cardEndDay1: { paddingHorizontal: 16, marginBottom: 48 },
    cardEndDay2: { paddingHorizontal: 16, paddingBottom: 80 },

    cardTop: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderWidth: 3,
        borderBottomWidth: 0,
        borderColor: '#000',
        overflow: 'hidden',
    },
    cardMid: {
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderColor: '#000',
    },
    cardBot: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderWidth: 3,
        borderTopWidth: 0,
        borderColor: '#000',
        paddingBottom: 32,
        overflow: 'hidden',
    },

    /* day header area (inside cardTop) */
    hdrArea: {
        alignItems: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: 32,
        marginBottom: 16,
    },
    badgeWrap: {
        zIndex: 20,
        marginBottom: -12,
        marginRight: 8,
        transform: [{ rotate: '2deg' }],
    },
    badgeRel: { position: 'relative' },
    badgeShadow: {
        position: 'absolute',
        top: 5,
        left: 5,
        backgroundColor: '#000',
        borderRadius: 6,
        width: '100%',
        height: '100%',
    },
    badge: {
        borderWidth: 2.5,
        borderColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 14,
        color: '#000',
        letterSpacing: -0.7,
        fontWeight: 'bold',
        fontFamily: MONO_FONT,
    },
    svgBox: {
        zIndex: 10,
        position: 'relative',
        height: 100,
        width: 260,
        marginTop: -10,
    },
    subBadge: {
        backgroundColor: '#FFF',
        borderWidth: 1.5,
        borderColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: -8,
        zIndex: 20,
        marginRight: 8,
        transform: [{ rotate: '1deg' }],
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 3,
    },
    subBadgeText: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: 'Gilton',
    },

    /* empty state */
    emptyWrap: { alignItems: 'center', paddingVertical: 40 },
    emptyText: { color: '#9CA3AF', fontSize: 18, fontWeight: 'bold' },
});
