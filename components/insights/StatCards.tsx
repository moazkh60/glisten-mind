import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatCardProps {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    trend?: 'up' | 'down';
}

function StatCard({ label, value, icon, iconColor, trend }: StatCardProps) {
    return (
        <View style={styles.cardOuter}>
            <LinearGradient
                colors={['rgba(40, 35, 75, 0.6)', 'rgba(26, 23, 48, 0.8)']}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.cardLabel}>{label}</Text>
                    {trend && (
                        <Ionicons
                            name={trend === 'up' ? 'arrow-up' : 'arrow-down'}
                            size={14}
                            color={trend === 'up' ? '#7BEDA0' : '#F97B9D'}
                        />
                    )}
                    <Ionicons name={icon} size={16} color={iconColor} />
                </View>
                <Text style={styles.cardValue}>{value}</Text>
            </LinearGradient>
        </View>
    );
}

export function StatCards() {
    return (
        <View style={styles.row}>
            <StatCard
                label="Avg HRV"
                value="87 ms"
                icon="arrow-up"
                iconColor="#7BEDA0"
                trend="up"
            />
            <StatCard
                label="Sessions"
                value="12"
                icon="flame"
                iconColor="#F9A87B"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
    },
    cardOuter: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    card: {
        padding: 16,
        borderRadius: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    cardLabel: {
        fontSize: 12,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
        flex: 1,
    },
    cardValue: {
        fontSize: 28,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
    },
});
