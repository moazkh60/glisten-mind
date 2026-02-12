import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Stop, LinearGradient as SvgGradient } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 180;
const STROKE_WIDTH = 7;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_ANGLE = 300;
const ARC_LENGTH = (ARC_ANGLE / 360) * CIRCUMFERENCE;
const ROTATION = 90 + (360 - ARC_ANGLE) / 2;

interface StreakRingProps {
    days?: number;
    maxDays?: number;
}

export function StreakRing({ days = 14, maxDays = 30 }: StreakRingProps) {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(Math.min(days / maxDays, 1), {
            duration: 1400,
            easing: Easing.out(Easing.cubic),
        });
    }, [days]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: ARC_LENGTH * (1 - progress.value),
    }));

    return (
        <View style={styles.container}>
            <Svg
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                style={{ transform: [{ rotate: `${ROTATION}deg` }] }}
            >
                <Defs>
                    <SvgGradient id="streakGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#F9A87B" stopOpacity="1" />
                        <Stop offset="0.5" stopColor="#8B80F9" stopOpacity="1" />
                        <Stop offset="1" stopColor="#6C5CE7" stopOpacity="0.8" />
                    </SvgGradient>
                </Defs>

                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke="rgba(139, 128, 249, 0.1)"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
                    strokeLinecap="round"
                />

                <AnimatedCircle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke="url(#streakGrad)"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
                    strokeLinecap="round"
                    animatedProps={animatedProps}
                />
            </Svg>

            <View style={styles.center}>
                <Ionicons name="flame" size={24} color="#F9A87B" />
                <Text style={styles.days}>{days} days</Text>
                <Text style={styles.label}>Daily Streak</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: SIZE,
        height: SIZE,
        alignSelf: 'center',
    },
    center: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    days: {
        fontSize: 36,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
        marginTop: 2,
    },
    label: {
        fontSize: 12,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
        marginTop: -2,
    },
});
