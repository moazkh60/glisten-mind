import { Fonts, GlistenColors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
    Circle,
    Defs,
    Line,
    Polyline,
    Stop,
    LinearGradient as SvgGradient,
    Path as SvgPath
} from 'react-native-svg';

const CHART_WIDTH = 320;
const CHART_HEIGHT = 160;
const PADDING_LEFT = 36;
const PADDING_RIGHT = 12;
const PADDING_TOP = 24;
const PADDING_BOTTOM = 28;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DATA = [82, 85, 92, 86, 90, 89, 87]; // HRV values
const Y_MIN = 70;
const Y_MAX = 100;

function valueToY(value: number): number {
    const graphHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    return PADDING_TOP + graphHeight * (1 - (value - Y_MIN) / (Y_MAX - Y_MIN));
}

function indexToX(index: number): number {
    const graphWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
    return PADDING_LEFT + (index / (DAYS.length - 1)) * graphWidth;
}

export function HrvChart() {
    const points = DATA.map((v, i) => `${indexToX(i)},${valueToY(v)}`).join(' ');

    // Area fill path (line down to bottom, across, and back)
    const firstX = indexToX(0);
    const lastX = indexToX(DATA.length - 1);
    const bottomY = CHART_HEIGHT - PADDING_BOTTOM;
    const areaPath = `M${firstX},${valueToY(DATA[0])} ${DATA.map(
        (v, i) => `L${indexToX(i)},${valueToY(v)}`
    ).join(' ')} L${lastX},${bottomY} L${firstX},${bottomY} Z`;

    // Y-axis labels
    const yLabels = [70, 80, 90, 100];

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
                {DATA.map((v, i) => (
                    <React.Fragment key={i}>
                        <Circle
                            cx={indexToX(i)}
                            cy={valueToY(v)}
                            r={3.5}
                            fill={GlistenColors.primary}
                            stroke={GlistenColors.background}
                            strokeWidth={2}
                        />
                    </React.Fragment>
                ))}

                {/* Y-axis labels */}
                {yLabels.map((val) => (
                    <SvgPath key={`y-${val}`} d="M0,0" />
                ))}
            </Svg>

            {/* Y-axis text labels (rendered as RN Text for better fonts) */}
            {yLabels.map((val) => (
                <Text
                    key={`yl-${val}`}
                    style={[
                        styles.yLabel,
                        { top: valueToY(val) - 6 },
                    ]}
                >
                    {val} ms
                </Text>
            ))}

            {/* X-axis day labels */}
            <View style={styles.xLabels}>
                {DAYS.map((day, i) => (
                    <Text key={day} style={[styles.xLabel, { left: indexToX(i) - 12 }]}>
                        {day}
                    </Text>
                ))}
            </View>

            {/* Value labels above points */}
            {DATA.map((v, i) => (
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
