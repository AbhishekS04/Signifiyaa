import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, Easing } from 'react-native-reanimated';

interface EventPassProps {
    data: any;
    userName: string;
    bookingId: string;
    onClose: () => void;
}

const EventPass = ({ data, userName, bookingId, onClose }: EventPassProps) => {
    // DEFENSE: Validate and extract event data with fallbacks
    const currentBookingId = data?.leaderBookingId || bookingId || 'N/A';
    
    // DEFENSE: Handle nested event data structure safely
    let eventName = 'Event';
    let eventDate = null;
    
    if (Array.isArray(data?.participant_team_event) && data.participant_team_event.length > 0) {
        const firstEvent = data.participant_team_event[0];
        if (firstEvent?.event?.name) {
            eventName = firstEvent.event.name;
        }
        if (firstEvent?.event?.date) {
            eventDate = firstEvent.event.date;
        }
    }
    
    const teamName = data?.teamName || '—';
    const leaderName = data?.leaderName || userName || 'Team Lead';
    
    // DEFENSE: Validate booking ID before generating QR
    const qrData = currentBookingId !== 'N/A' ? currentBookingId : 'INVALID-PASS';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=000000&margin=0`;

    return (
        <Animated.View
            entering={FadeIn.duration(400).easing(Easing.out(Easing.poly(4)))}
            exiting={FadeOut.duration(200)}
            style={{ width: '100%', maxWidth: 360, position: 'relative' }}
        >
            {/* The 3D Shadow (Black Box behind) */}
            <View
                style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    right: -8,
                    bottom: -8,
                    backgroundColor: 'black',
                    borderRadius: 32,
                    zIndex: -1,
                }}
            />

            {/* Main White Card Content */}
            <View style={styles.cleanCard}>
                {/* Header: Title + Close */}
                <View style={styles.cleanHeader}>
                    <Text style={styles.cleanTitle}>Event Pass</Text>
                    <TouchableOpacity onPress={onClose} style={styles.cleanCloseBtn}>
                        <X color="black" size={20} strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>

                {/* Details */}
                <View style={styles.cleanContent}>
                    <View style={styles.cleanField}>
                        <Text style={styles.cleanLabel}>EVENT</Text>
                        <Text style={styles.cleanValue} numberOfLines={1}>
                            {eventName}
                        </Text>
                    </View>

                    <View style={styles.cleanField}>
                        <Text style={styles.cleanLabel}>TEAM</Text>
                        <Text style={styles.cleanValue} numberOfLines={1}>
                            {teamName}
                        </Text>
                    </View>

                    <View style={styles.cleanField}>
                        <Text style={styles.cleanLabel}>BOOKING ID</Text>
                        <Text style={styles.cleanValueMono}>{currentBookingId}</Text>
                    </View>

                    {/* Center QR Code */}
                    <View style={styles.cleanQRContainer}>
                        <View style={styles.qrWrapper}>
                            <Image
                                source={{ uri: qrUrl }}
                                style={styles.cleanQR}
                                contentFit="contain"
                            />
                        </View>
                    </View>

                    {/* Divider Line */}
                    <View style={styles.cleanDivider} />

                    {/* Footer Detail */}
                    <View style={styles.cleanField}>
                        <Text style={styles.cleanLabel}>TEAM LEAD</Text>
                        <Text style={styles.cleanValue} numberOfLines={1}>
                            {leaderName}
                        </Text>
                    </View>

                    {data.weightCategory && (
                        <View style={styles.cleanField}>
                            <Text style={styles.cleanLabel}>WEIGHT CATEGORY</Text>
                            <Text style={styles.cleanValue}>{data.weightCategory}</Text>
                        </View>
                    )}
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    cleanCard: {
        backgroundColor: 'white',
        borderRadius: 32,
        borderWidth: 3,
        borderColor: 'black',
        padding: 24,
        overflow: 'hidden',
    },
    cleanHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cleanTitle: {
        fontSize: 26,
        fontFamily: 'Gilton',
        fontWeight: '900',
        color: 'black',
    },
    cleanCloseBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fee2e2',
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cleanContent: {
        gap: 16,
    },
    cleanField: {
        gap: 1,
    },
    cleanLabel: {
        fontSize: 10,
        fontFamily: 'Gilton',
        fontWeight: '700',
        color: '#64748b',
        letterSpacing: 0.8,
    },
    cleanValue: {
        fontSize: 18,
        fontFamily: 'Gilton',
        fontWeight: '800',
        color: 'black',
    },
    cleanValueMono: {
        fontSize: 18,
        fontFamily: 'Gilton',
        fontWeight: '800',
        color: 'black',
        letterSpacing: 0.5,
    },
    cleanQRContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    qrWrapper: {
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    cleanQR: {
        width: 210,
        height: 210,
    },
    cleanDivider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        width: '100%',
        marginVertical: 4,
    },
});

export default EventPass;
