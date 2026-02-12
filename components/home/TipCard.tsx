import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TIPS = [
    { icon: 'moon-outline' as const, text: 'Evening sessions boost HRV recovery overnight.' },
    { icon: 'flame-outline' as const, text: 'Consistency matters more than duration.' },
    { icon: 'leaf-outline' as const, text: 'Extended exhales activate the vagus nerve.' },
    { icon: 'pulse-outline' as const, text: 'Your HRV is highest when you feel rested.' },
    { icon: 'time-outline' as const, text: 'Just 3 minutes of focused breathing resets your nervous system.' },
];

export function TipCard() {
    const [tipIndex, setTipIndex] = useState(() =>
        Math.floor(Math.random() * TIPS.length)
    );
    const tip = TIPS[tipIndex];

    return (
        <View style={styles.outer}>
            <LinearGradient
                colors={['rgba(40, 35, 75, 0.4)', 'rgba(26, 23, 48, 0.6)']}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.iconWrap}>
                    <Ionicons name={tip.icon} size={16} color={GlistenColors.primary} />
                </View>
                <Text style={styles.text}>{tip.text}</Text>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        marginHorizontal: 20,
        marginTop: 14,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(139, 128, 249, 0.06)',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        gap: 12,
    },
    iconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(139, 128, 249, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    text: {
        flex: 1,
        fontSize: 13,
        fontFamily: Fonts?.sans,
        fontStyle: 'italic',
        color: GlistenColors.textSecondary,
        lineHeight: 18,
    },
});
