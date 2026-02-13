import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const SPARK_W = 120;
const SPARK_H = 36;

function sparklinePoints(data: number[]): string {
    if (data.length === 0) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    return data
        .map((v, i) => {
            const x = (i / Math.max(data.length - 1, 1)) * SPARK_W;
            const y = SPARK_H - ((v - min) / range) * (SPARK_H - 4) - 2;
            return `${x},${y}`;
        })
        .join(' ');
}

interface VagusToneTrackerProps {
    scores: number[];
}

export function VagusToneTracker({ scores }: VagusToneTrackerProps) {
    const hasData = scores.length > 0;

    if (!hasData) {
        return (
            <View style={styles.outer}>
                <LinearGradient
                    colors={['rgba(40, 35, 75, 0.6)', 'rgba(26, 23, 48, 0.8)']}
                    style={[styles.container, styles.emptyContainer]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.emptyIconWrap}>
                        <Ionicons name="pulse-outline" size={22} color={GlistenColors.primary} />
                    </View>
                    <View>
                        <Text style={styles.title}>Vagus Tone</Text>
                        <Text style={styles.emptyText}>
                            Complete sessions to track your vagal tone progress
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    const startScore = scores[0];
    const endScore = scores[scores.length - 1];
    const isImproving = endScore >= startScore;

    return (
        <View style={styles.outer}>
            <LinearGradient
                colors={['rgba(40, 35, 75, 0.6)', 'rgba(26, 23, 48, 0.8)']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Header row */}
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Vagus Tone</Text>
                    <View style={[styles.badge, !isImproving && styles.badgeDecline]}>
                        <View style={[styles.badgeDot, !isImproving && styles.badgeDotDecline]} />
                        <Text style={[styles.badgeText, !isImproving && styles.badgeTextDecline]}>
                            {isImproving ? 'Improving' : 'Declining'}
                        </Text>
                    </View>
                </View>

                {/* Score + sparkline row */}
                <View style={styles.scoreRow}>
                    <Text style={styles.startScore}>{startScore}</Text>

                    <View style={styles.sparkContainer}>
                        <Svg width={SPARK_W} height={SPARK_H} viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}>
                            <Polyline
                                points={sparklinePoints(scores)}
                                fill="none"
                                stroke={GlistenColors.primary}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </View>

                    <View style={styles.endScoreWrap}>
                        <Text style={styles.endScore}>{endScore}</Text>
                        <Text style={styles.endLabel}>
                            {endScore >= 80 ? 'Great' : endScore >= 60 ? 'Good' : 'Building'}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    container: {
        padding: 16,
        borderRadius: 16,
    },
    emptyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    emptyIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(139, 128, 249, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 12,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textMuted,
        marginTop: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 14,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: 'rgba(123, 237, 160, 0.1)',
    },
    badgeDecline: {
        backgroundColor: 'rgba(249, 123, 157, 0.1)',
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#7BEDA0',
    },
    badgeDotDecline: {
        backgroundColor: '#F97B9D',
    },
    badgeText: {
        fontSize: 11,
        fontFamily: Fonts?.sansSemiBold,
        color: '#7BEDA0',
    },
    badgeTextDecline: {
        color: '#F97B9D',
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    startScore: {
        fontSize: 32,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textSecondary,
    },
    sparkContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    endScoreWrap: {
        alignItems: 'center',
    },
    endScore: {
        fontSize: 32,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.primary,
    },
    endLabel: {
        fontSize: 11,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
        marginTop: -2,
    },
});
