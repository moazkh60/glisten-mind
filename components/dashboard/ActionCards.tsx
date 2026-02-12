import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ActionCard {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

export function ActionCards() {
    const cards: ActionCard[] = [
        {
            id: 'breathe',
            label: 'Breathe',
            icon: 'swap-horizontal',
            onPress: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/session');
            },
        },
        {
            id: 'stimulate',
            label: 'Stimulate',
            icon: 'radio-outline',
            onPress: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // TODO: navigate to stimulation screen
            },
        },
    ];

    return (
        <View style={styles.row}>
            {cards.map((card) => (
                <Pressable
                    key={card.id}
                    style={styles.cardPressable}
                    onPress={card.onPress}
                >
                    <LinearGradient
                        colors={['rgba(40, 35, 75, 0.6)', 'rgba(26, 23, 48, 0.8)']}
                        style={styles.card}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.iconWrap}>
                            <Ionicons name={card.icon} size={22} color={GlistenColors.primary} />
                        </View>
                        <Text style={styles.label}>{card.label}</Text>
                    </LinearGradient>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 14,
    },
    cardPressable: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    card: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
        gap: 10,
    },
    iconWrap: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: 'rgba(139, 128, 249, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
    },
});
