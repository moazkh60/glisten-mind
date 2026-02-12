import { Fonts, GlistenColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const SPARKLINE_DATA = [68, 70, 72, 69, 74, 76, 74, 78, 77, 80, 82];
const SPARK_W = 120;
const SPARK_H = 36;

function sparklinePoints(): string {
    const min = Math.min(...SPARKLINE_DATA);
    const max = Math.max(...SPARKLINE_DATA);
    const range = max - min || 1;
    return SPARKLINE_DATA.map((v, i) => {
        const x = (i / (SPARKLINE_DATA.length - 1)) * SPARK_W;
        const y = SPARK_H - ((v - min) / range) * (SPARK_H - 4) - 2;
        return `${x},${y}`;
    }).join(' ');
}

interface VagusToneTrackerProps {
    startScore?: number;
    endScore?: number;
}

export function VagusToneTracker({ startScore = 74, endScore = 82 }: VagusToneTrackerProps) {
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
                    <View style={styles.badge}>
                        <View style={styles.badgeDot} />
                        <Text style={styles.badgeText}>Improving</Text>
                    </View>
                </View>

                {/* Score + sparkline row */}
                <View style={styles.scoreRow}>
                    <Text style={styles.startScore}>{startScore}</Text>

                    <View style={styles.sparkContainer}>
                        <Svg width={SPARK_W} height={SPARK_H} viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}>
                            <Polyline
                                points={sparklinePoints()}
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
                        <Text style={styles.endLabel}>Good</Text>
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
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#7BEDA0',
    },
    badgeText: {
        fontSize: 11,
        fontFamily: Fonts?.sansSemiBold,
        color: '#7BEDA0',
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
