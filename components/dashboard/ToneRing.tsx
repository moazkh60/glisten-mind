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

const SIZE = 240;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_ANGLE = 310;
const ARC_LENGTH = (ARC_ANGLE / 360) * CIRCUMFERENCE;
const ROTATION = 90 + (360 - ARC_ANGLE) / 2;

interface ToneRingProps {
    hasData?: boolean;
    score?: number;
    label?: string;
}

export function ToneRing({ hasData = false, score = 82, label = 'DEEP CALM' }: ToneRingProps) {
    const progress = useSharedValue(0);

    useEffect(() => {
        if (hasData) {
            progress.value = withTiming(score / 100, {
                duration: 1500,
                easing: Easing.out(Easing.cubic),
            });
        }
    }, [score, hasData]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = ARC_LENGTH * (1 - progress.value);
        return { strokeDashoffset };
    });

    return (
        <View style={styles.container}>
            <Svg
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                style={{ transform: [{ rotate: `${ROTATION}deg` }] }}
            >
                <Defs>
                    <SvgGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#B8A9F0" stopOpacity="1" />
                        <Stop offset="0.6" stopColor="#8B80F9" stopOpacity="1" />
                        <Stop offset="1" stopColor="#6C5CE7" stopOpacity="0.8" />
                    </SvgGradient>
                </Defs>

                {/* Track */}
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

                {/* Progress arc */}
                {hasData && (
                    <AnimatedCircle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        stroke="url(#ringGrad)"
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                        strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
                        strokeLinecap="round"
                        animatedProps={animatedProps}
                    />
                )}
            </Svg>

            {/* Center content */}
            <View style={styles.center}>
                {hasData ? (
                    <>
                        <Text style={styles.toneLabel}>TONE</Text>
                        <Text style={styles.scoreText}>{score}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{label}</Text>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.emptyIconWrap}>
                            <Ionicons name="pulse-outline" size={28} color={GlistenColors.primary} />
                        </View>
                        <Text style={styles.toneLabel}>TONE</Text>
                        <Text style={styles.emptyScore}>--</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>AWAITING DATA</Text>
                        </View>
                    </>
                )}
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
    toneLabel: {
        fontSize: 11,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
        letterSpacing: 2,
        marginBottom: 2,
    },
    scoreText: {
        fontSize: 64,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
        lineHeight: 72,
    },
    emptyScore: {
        fontSize: 52,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textMuted,
        lineHeight: 60,
    },
    emptyIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(139, 128, 249, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    badge: {
        marginTop: 4,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: GlistenColors.surfaceGlass,
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    badgeText: {
        fontSize: 11,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
        letterSpacing: 1.5,
    },
});
