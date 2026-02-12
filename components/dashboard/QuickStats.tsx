import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface QuickStat {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
}

interface QuickStatsProps {
    hasData?: boolean;
}

export function QuickStats({ hasData = false }: QuickStatsProps) {
    const stats: QuickStat[] = hasData
        ? [
            { label: 'Streak', value: '14d', icon: 'flame', iconColor: '#F9A87B' },
            { label: 'Today', value: '2', icon: 'checkmark-circle', iconColor: '#7BEDA0' },
            { label: 'HRV', value: '87', icon: 'heart', iconColor: '#F97B9D' },
        ]
        : [
            { label: 'Streak', value: '0d', icon: 'flame', iconColor: '#F9A87B' },
            { label: 'Today', value: '0', icon: 'checkmark-circle', iconColor: '#7BEDA0' },
            { label: 'HRV', value: '--', icon: 'heart', iconColor: '#F97B9D' },
        ];

    return (
        <View style={styles.row}>
            {stats.map((stat) => (
                <View key={stat.label} style={styles.statOuter}>
                    <LinearGradient
                        colors={['rgba(40, 35, 75, 0.5)', 'rgba(26, 23, 48, 0.7)']}
                        style={styles.stat}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name={stat.icon} size={14} color={stat.iconColor} />
                        <Text style={[styles.value, !hasData && stat.value === '--' && styles.valueMuted]}>
                            {stat.value}
                        </Text>
                        <Text style={styles.label}>{stat.label}</Text>
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
    statOuter: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    stat: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 14,
        alignItems: 'center',
        gap: 4,
    },
    value: {
        fontSize: 20,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
    },
    valueMuted: {
        color: GlistenColors.textMuted,
    },
    label: {
        fontSize: 10,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
    },
});
