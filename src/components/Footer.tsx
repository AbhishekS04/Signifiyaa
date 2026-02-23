import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Footer = React.memo(() => {
    return (
        <View style={s.container}>
            <View style={s.content}>
                <Text style={s.mainText}>
                    SIGNIFIYA 2K26 {"\n"}Where Innovation{"\n"}Meets the Nation 🌍
                </Text>

                <View style={s.dividerLine} />

                <View style={s.brandRow}>
                    <Text style={s.brandText}>© 2026 SIGNIFIYA, SOET.</Text>
                </View>
            </View>
        </View>
    );
});

const s = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 25,
    },
    content: {
        width: '100%',
    },
    mainText: {
        fontSize: width * 0.09,
        fontFamily: 'Gilton',
        color: '#333333', // More visible but still muted "Blinkit" style
        lineHeight: width * 0.13,
        letterSpacing: -1,
    },
    dividerLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#333333',
        marginTop: 20,
        marginBottom: 20,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.9,
    },
    brandText: {
        fontFamily: '',
        fontSize: 18,
        color: '#333333',
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

export default Footer;
