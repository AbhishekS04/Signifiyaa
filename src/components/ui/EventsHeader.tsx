import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const EventsHeader = () => {
    return (
        <View className="w-full mb-8 rounded-[30px] overflow-hidden border-[3px] border-black">
            <LinearGradient
                colors={['#6a0dad', '#a45ee5', '#e0c3fc']} // Purple Gradient from reference
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ width: '100%', height: 250, justifyContent: 'center', alignItems: 'center' }}
            >
                {/* Main Text */}
                <Text style={styles.headerText}>Events</Text>

                {/* Subtext */}
                <Text style={styles.subText}>
                    Get to know more about <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>Signifiya</Text> and the exciting events lined up.
                </Text>

                {/* Branding Bottom Right */}
                <Text style={styles.brandingText}>SIGNIFIYA '26.</Text>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontFamily: 'Gilton',
        fontSize: 56,
        color: 'white',
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
        marginBottom: 8,
    },
    subText: {
        fontFamily: 'Softura',
        fontSize: 12,
        color: 'white',
        opacity: 0.9,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    brandingText: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        fontFamily: 'Gilton',
        fontSize: 14,
        color: 'white',
        opacity: 0.7,
        letterSpacing: 1,
    }
});

export default EventsHeader;
