import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const BlinkitFooter = React.memo(() => {
    return (
        <View style={s.container}>
            <View style={s.content}>
                <Text style={s.mainText}>
                    Signifiya's{"\n"}last minute app ❤️
                </Text>

                <View style={s.dividerLine} />

                <View style={s.brandRow}>
                    <Text style={s.brandText}>signifiya</Text>
                    <View style={s.dot} />
                    <Text style={s.yearText}>2026</Text>
                </View>
            </View>
        </View>
    );
});

const s = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        paddingTop: 20,
        paddingBottom: 150,
        paddingHorizontal: 25,
    },
    content: {
        width: '100%',
    },
    mainText: {
        fontSize: width * 0.10,
        fontFamily: 'Gilton',
        color: '#333333', // More visible but still muted "Blinkit" style
        lineHeight: width * 0.18,
        letterSpacing: -1,
    },
    dividerLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#1a1a1a',
        marginTop: 60,
        marginBottom: 20,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.4,
    },
    brandText: {
        fontFamily: 'Gilton',
        fontSize: 28,
        color: '#404040',
        letterSpacing: 1,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#404040',
        marginHorizontal: 12,
    },
    yearText: {
        fontFamily: 'Gilton',
        fontSize: 18,
        color: '#404040',
    }
});

export default BlinkitFooter;
