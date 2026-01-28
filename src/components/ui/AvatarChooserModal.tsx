import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown, Easing } from 'react-native-reanimated';

// Font Constants
const FONT_MAIN = 'Gilton';
const FONT_BOLD = 'Gilton';

const { width } = Dimensions.get('window');
// Overlay padding: 24 * 2 = 48
// Modal padding: 20 * 2 = 40
// Gap: 12
// Total width available: width - 88
// Item size: (width - 88 - 12) / 2
const ITEM_SIZE = (width - 100) / 2;

// Map of avatar IDs to local assets
export const AVATAR_MAP: Record<string, any> = {
    'avatar1.jpg': require('../../../assets/avatar/avatar1.jpg'),
    'avatar2.jpg': require('../../../assets/avatar/avatar2.jpg'),
    'avatar3.jpg': require('../../../assets/avatar/avatar3.jpg'),
    'avatar4.jpg': require('../../../assets/avatar/avatar4.jpg'),
    'avatar5.jpg': require('../../../assets/avatar/avatar5.jpg'),
    'avatar6.jpg': require('../../../assets/avatar/avatar6.jpg'),
    'avatar7.jpg': require('../../../assets/avatar/avatar7.jpg'),
    'avatar8.jpg': require('../../../assets/avatar/avatar8.jpg'),
};

export const AVATAR_KEYS = Object.keys(AVATAR_MAP);

interface AvatarChooserModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (avatarId: string) => void;
    currentAvatarId?: string;
}

const AvatarChooserModal: React.FC<AvatarChooserModalProps> = ({ visible, onClose, onSelect, currentAvatarId }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Backdrop */}
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                    activeOpacity={1}
                >
                    <View style={styles.backdrop} />
                </TouchableOpacity>

                {/* Modal Content */}
                <Animated.View
                    entering={SlideInDown.duration(300).easing(Easing.out(Easing.quad))}
                    style={styles.modalContainer}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Choose Avatar</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="black" size={18} />
                        </TouchableOpacity>
                    </View>

                    {/* Grid */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.gridContainer}
                    >
                        <View style={styles.grid}>
                            {AVATAR_KEYS.map((key, index) => {
                                const isSelected = currentAvatarId === key;
                                return (
                                    <Animated.View
                                        key={key}
                                        entering={FadeIn.delay(index * 50).duration(400)}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                onSelect(key);
                                                onClose();
                                            }}
                                            activeOpacity={0.7}
                                            style={[
                                                styles.avatarItem,
                                                isSelected && styles.selectedItem
                                            ]}
                                        >
                                            <Image
                                                source={AVATAR_MAP[key]}
                                                style={styles.avatarImage}
                                                resizeMode="cover"
                                            />
                                            {isSelected && (
                                                <View style={styles.checkBadge}>
                                                    <Text style={styles.checkText}>✓</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </Animated.View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 24, // Added padding back for centering
    },
    backdrop: {
        flex: 1,
    },
    modalContainer: {
        width: '100%',
        maxHeight: '80%', // Taller for grid
        backgroundColor: 'white',
        borderRadius: 24,
        borderWidth: 3,
        borderColor: 'black',
        padding: 20,
        // Neo-brutalism shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 8,
            height: 8,
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: FONT_BOLD,
        color: 'black',
        textTransform: 'uppercase',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FF8FAB',
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridContainer: {
        paddingBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12, // Compact gap
        justifyContent: 'center', // Center items
    },
    avatarItem: {
        width: ITEM_SIZE, // Uses calculated size
        height: ITEM_SIZE,
        borderRadius: 20, // More rounded as per ref image
        borderWidth: 2,
        borderColor: 'black',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    selectedItem: {
        borderColor: '#000',
        borderWidth: 4,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    checkBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4ade80',
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
    }
});

export default AvatarChooserModal;
