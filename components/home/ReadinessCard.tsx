import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ReadinessCardProps {
    title?: string;
    score?: number;
    hrv?: number;
    breathRate?: number;
}

export function ReadinessCard({
    title = 'Deep Stillness',
    score = 88,
    hrv = 94,
    breathRate = 8,
}: ReadinessCardProps) {
    const progressWidth = `${Math.min(score, 100)}%`;

    return (
        <View style={styles.cardOuter}>
            <LinearGradient
                colors={['rgba(40, 35, 75, 0.6)', 'rgba(26, 23, 48, 0.8)']}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Header */}
                <Text style={styles.sectionLabel}>NIGHTLY READINESS</Text>

                {/* Score row */}
                <View style={styles.scoreRow}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.scoreValue}>{score}</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressTrack}>
                    <LinearGradient
                        colors={[GlistenColors.primaryMuted, GlistenColors.primary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressFill, { width: progressWidth as any }]}
                    />
                </View>

                {/* Metrics row */}
                <View style={styles.metricsRow}>
                    <View style={styles.metric}>
                        <View style={[styles.metricIcon, { backgroundColor: 'rgba(249, 123, 157, 0.15)' }]}>
                            <Ionicons name="heart" size={14} color={GlistenColors.heartPink} />
                        </View>
                        <View>
                            <Text style={styles.metricLabel}>HRV</Text>
                            <Text style={styles.metricValue}>{hrv} ms</Text>
                        </View>
                    </View>

                    <View style={styles.metric}>
                        <View style={[styles.metricIcon, { backgroundColor: 'rgba(123, 184, 237, 0.15)' }]}>
                            <Ionicons name="water" size={14} color={GlistenColors.breathBlue} />
                        </View>
                        <View>
                            <Text style={styles.metricLabel}>BREATH</Text>
                            <Text style={styles.metricValue}>{breathRate} bpm</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    cardOuter: {
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    card: {
        padding: 20,
        borderRadius: 20,
    },
    sectionLabel: {
        fontSize: 11,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 14,
    },
    title: {
        fontSize: 26,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
    },
    scoreValue: {
        fontSize: 36,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.primary,
    },
    progressTrack: {
        height: 4,
        backgroundColor: 'rgba(139, 128, 249, 0.12)',
        borderRadius: 2,
        marginBottom: 18,
        overflow: 'hidden',
    },
    progressFill: {
        height: 4,
        borderRadius: 2,
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 24,
    },
    metric: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metricIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 10,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textMuted,
        letterSpacing: 1,
    },
    metricValue: {
        fontSize: 14,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
    },
});
