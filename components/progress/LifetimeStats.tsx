import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Stat {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
}

const STATS: Stat[] = [
    { label: 'Total Sessions', value: '47', icon: 'leaf', iconColor: '#7BEDA0' },
    { label: 'Minutes', value: '312', icon: 'time-outline', iconColor: '#8B80F9' },
    { label: 'Best Streak', value: '21', icon: 'trophy', iconColor: '#F9A87B' },
];

export function LifetimeStats() {
    return (
        <View style={styles.row}>
            {STATS.map((stat) => (
                <View key={stat.label} style={styles.cardOuter}>
                    <LinearGradient
                        colors={['rgba(40, 35, 75, 0.6)', 'rgba(26, 23, 48, 0.8)']}
                        style={styles.card}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name={stat.icon} size={18} color={stat.iconColor} />
                        <Text style={styles.label}>{stat.label}</Text>
                        <Text style={styles.value}>{stat.value}</Text>
                    </LinearGradient>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 10,
    },
    cardOuter: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    card: {
        padding: 14,
        borderRadius: 16,
        alignItems: 'center',
        gap: 6,
    },
    label: {
        fontSize: 10,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
        textAlign: 'center',
    },
    value: {
        fontSize: 22,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
    },
});
