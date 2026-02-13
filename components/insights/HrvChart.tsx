import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
    Circle,
    Defs,
    Line,
    Polyline,
    Stop,
    LinearGradient as SvgGradient,
    Path as SvgPath,
} from 'react-native-svg';

const CHART_WIDTH = 320;
const CHART_HEIGHT = 160;
const PADDING_LEFT = 36;
const PADDING_RIGHT = 12;
const PADDING_TOP = 24;
const PADDING_BOTTOM = 28;

interface HrvChartProps {
    labels: string[];
    values: number[];
}

export function HrvChart({ labels, values }: HrvChartProps) {
    // Filter out zero-values to check if we have any real data
    const realValues = values.filter((v) => v > 0);
    const hasData = realValues.length > 0;

    if (!hasData) {
        return (
            <View style={[styles.container, styles.emptyContainer]}>
                <View style={styles.emptyIconWrap}>
                    <Ionicons name="analytics-outline" size={28} color={GlistenColors.primary} />
                </View>
                <Text style={styles.emptyTitle}>HRV Trend</Text>
                <Text style={styles.emptyText}>
                    Complete sessions to see your heart rate variability trend
                </Text>
            </View>
        );
    }

    // Compute Y range from real values
    const minVal = Math.min(...realValues);
    const maxVal = Math.max(...realValues);
    const Y_MIN = Math.max(0, Math.floor((minVal - 10) / 10) * 10);
    const Y_MAX = Math.ceil((maxVal + 10) / 10) * 10;
    const yRange = Y_MAX - Y_MIN || 1;

    function valueToY(value: number): number {
        const graphHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
        return PADDING_TOP + graphHeight * (1 - (value - Y_MIN) / yRange);
    }

    function indexToX(index: number): number {
        const graphWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
        return PADDING_LEFT + (index / Math.max(labels.length - 1, 1)) * graphWidth;
    }

    // Only plot non-zero points
    const validPoints = values
        .map((v, i) => ({ v, i }))
        .filter(({ v }) => v > 0);

    const points = validPoints.map(({ v, i }) => `${indexToX(i)},${valueToY(v)}`).join(' ');

    // Area fill path
    const firstValid = validPoints[0];
    const lastValid = validPoints[validPoints.length - 1];
    const bottomY = CHART_HEIGHT - PADDING_BOTTOM;
    const areaPath = `M${indexToX(firstValid.i)},${valueToY(firstValid.v)} ${validPoints
        .map(({ v, i }) => `L${indexToX(i)},${valueToY(v)}`)
        .join(' ')} L${indexToX(lastValid.i)},${bottomY} L${indexToX(firstValid.i)},${bottomY} Z`;

    // Y-axis labels
    const yStep = Math.max(Math.round(yRange / 3 / 5) * 5, 5);
    const yLabels: number[] = [];
    for (let v = Y_MIN; v <= Y_MAX; v += yStep) {
        yLabels.push(v);
    }

    return (
        <View style={styles.container}>
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
                <Defs>
                    <SvgGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#8B80F9" stopOpacity="0.3" />
                        <Stop offset="1" stopColor="#8B80F9" stopOpacity="0.02" />
                    </SvgGradient>
                    <SvgGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#6C5CE7" stopOpacity="0.8" />
                        <Stop offset="0.5" stopColor="#8B80F9" stopOpacity="1" />
                        <Stop offset="1" stopColor="#B8A9F0" stopOpacity="0.9" />
                    </SvgGradient>
                </Defs>

                {/* Horizontal grid lines */}
                {yLabels.map((val) => (
                    <Line
                        key={val}
                        x1={PADDING_LEFT}
                        y1={valueToY(val)}
                        x2={CHART_WIDTH - PADDING_RIGHT}
                        y2={valueToY(val)}
                        stroke="rgba(139, 128, 249, 0.08)"
                        strokeWidth={1}
                    />
                ))}

                {/* Area fill */}
                <SvgPath d={areaPath} fill="url(#areaGrad)" />

                {/* Line */}
                <Polyline
                    points={points}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data points */}
                {validPoints.map(({ v, i }) => (
                    <Circle
                        key={i}
                        cx={indexToX(i)}
                        cy={valueToY(v)}
                        r={3.5}
                        fill={GlistenColors.primary}
                        stroke={GlistenColors.background}
                        strokeWidth={2}
                    />
                ))}
            </Svg>

            {/* Y-axis text labels */}
            {yLabels.map((val) => (
                <Text
                    key={`yl-${val}`}
                    style={[styles.yLabel, { top: valueToY(val) - 6 }]}
                >
                    {val} ms
                </Text>
            ))}

            {/* X-axis day labels */}
            <View style={styles.xLabels}>
                {labels.map((label, i) => (
                    <Text key={`${label}-${i}`} style={[styles.xLabel, { left: indexToX(i) - 12 }]}>
                        {label}
                    </Text>
                ))}
            </View>

            {/* Value labels above points */}
            {validPoints.map(({ v, i }) => (
                <Text
                    key={`vl-${i}`}
                    style={[
                        styles.valueLabel,
                        {
                            left: indexToX(i) - 10,
                            top: valueToY(v) - 18,
                        },
                    ]}
                >
                    {v}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        height: CHART_HEIGHT + 10,
        backgroundColor: GlistenColors.surfaceGlass,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
        padding: 8,
        overflow: 'hidden',
    },
    emptyContainer: {
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    emptyIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(139, 128, 249, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 14,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
    },
    emptyText: {
        fontSize: 12,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textMuted,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    yLabel: {
        position: 'absolute',
        left: 10,
        fontSize: 9,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textMuted,
    },
    xLabels: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
    },
    xLabel: {
        position: 'absolute',
        fontSize: 9,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textMuted,
    },
    valueLabel: {
        position: 'absolute',
        fontSize: 9,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
        textAlign: 'center',
        width: 24,
    },
});
