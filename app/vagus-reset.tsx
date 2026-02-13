import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ORB_SIZE = 32;
const TRACK_PADDING = 40;
const TRAVEL = SCREEN_WIDTH - TRACK_PADDING * 2 - ORB_SIZE;

const SPEEDS: { label: string; durationMs: number }[] = [
    { label: 'Slow', durationMs: 3000 },
    { label: 'Medium', durationMs: 2000 },
];

export default function VagusResetScreen() {
    const insets = useSafeAreaInsets();
    const { flow } = useLocalSearchParams<{ flow?: string }>();
    const isCombined = flow === 'combined';
    const [speedIndex, setSpeedIndex] = useState(0);
    const [cycles, setCycles] = useState(0);
    const translateX = useSharedValue(0);

    const speed = SPEEDS[speedIndex];

    // Haptic at direction change
    const triggerHaptic = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // Count cycles
    const incrementCycle = () => {
        setCycles((c) => c + 1);
    };

    useEffect(() => {
        const half = speed.durationMs;

        translateX.value = withRepeat(
            withSequence(
                withTiming(TRAVEL, {
                    duration: half,
                    easing: Easing.inOut(Easing.ease),
                }),
                withTiming(0, {
                    duration: half,
                    easing: Easing.inOut(Easing.ease),
                })
            ),
            -1,
            false
        );

        // Haptic interval — fire at each direction change
        const hapticInterval = setInterval(() => {
            triggerHaptic();
        }, half);

        // Cycle counter — one full left→right→left = 1 cycle
        const cycleInterval = setInterval(() => {
            incrementCycle();
        }, half * 2);

        return () => {
            clearInterval(hapticInterval);
            clearInterval(cycleInterval);
            translateX.value = 0;
        };
    }, [speedIndex]);

    const orbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const handleClose = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
    };

    const handleContinueToBreathing = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 100);
        // Replace this screen with the breathing session
        router.replace('/session');
    };

    return (
        <LinearGradient
            colors={[GlistenColors.background, '#0F0D20', GlistenColors.background]}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backBtn} onPress={handleClose}>
                    <Ionicons name="chevron-back" size={22} color={GlistenColors.textPrimary} />
                </Pressable>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerLabel}>VAGUS NERVE RESET</Text>
                </View>
                <View style={{ width: 36 }} />
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
                <Text style={styles.instructionTitle}>Follow the light</Text>
                <Text style={styles.instructionSub}>
                    Move only your eyes, keeping your head still
                </Text>
            </View>

            {/* Orb track area */}
            <View style={styles.trackArea}>
                {/* Guide line */}
                <View style={styles.trackLine} />

                {/* Animated orb */}
                <Animated.View style={[styles.orbContainer, orbStyle]}>
                    <LinearGradient
                        colors={['#B8A9F0', '#8B80F9', '#6C5CE7']}
                        style={styles.orb}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                    {/* Glow effect */}
                    <View style={styles.orbGlow} />
                </Animated.View>

                {/* Direction indicators */}
                <View style={styles.directionRow}>
                    <Ionicons name="chevron-back" size={16} color={GlistenColors.textMuted} />
                    <Ionicons name="chevron-forward" size={16} color={GlistenColors.textMuted} />
                </View>
            </View>

            {/* Insight text */}
            <View style={styles.insightSection}>
                <View style={styles.insightCard}>
                    <Ionicons name="sparkles" size={16} color={GlistenColors.primary} />
                    <Text style={styles.insightText}>
                        Continue until you feel a yawn or deep sigh — that's your vagus nerve resetting
                    </Text>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{cycles}</Text>
                    <Text style={styles.statLabel}>CYCLES</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{speed.label}</Text>
                    <Text style={styles.statLabel}>SPEED</Text>
                </View>
            </View>

            {/* Speed toggle */}
            <View style={styles.speedSection}>
                <Text style={styles.speedTitle}>SPEED</Text>
                <View style={styles.speedRow}>
                    {SPEEDS.map((s, i) => (
                        <Pressable
                            key={s.label}
                            style={[
                                styles.speedBtn,
                                i === speedIndex && styles.speedBtnActive,
                            ]}
                            onPress={() => {
                                Haptics.selectionAsync();
                                setSpeedIndex(i);
                                setCycles(0);
                            }}
                        >
                            <Text
                                style={[
                                    styles.speedBtnText,
                                    i === speedIndex && styles.speedBtnTextActive,
                                ]}
                            >
                                {s.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                {isCombined ? (
                    <>
                        <Pressable style={styles.continueBtn} onPress={handleContinueToBreathing}>
                            <Text style={styles.continueBtnText}>CONTINUE TO BREATHING →</Text>
                        </Pressable>
                        <Pressable onPress={handleClose}>
                            <Text style={styles.skipText}>End Session</Text>
                        </Pressable>
                    </>
                ) : (
                    <Pressable style={styles.doneBtn} onPress={handleClose}>
                        <Text style={styles.doneBtnText}>DONE</Text>
                    </Pressable>
                )}
                <Text style={styles.footerHint}>Bilateral eye movement • Parasympathetic activation</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: GlistenColors.surfaceGlass,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerLabel: {
        fontSize: 11,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
        letterSpacing: 2,
    },
    instructions: {
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    instructionTitle: {
        fontSize: 28,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textPrimary,
        textAlign: 'center',
    },
    instructionSub: {
        fontSize: 14,
        fontFamily: Fonts?.sans,
        fontStyle: 'italic',
        color: GlistenColors.textSecondary,
        marginTop: 8,
        textAlign: 'center',
    },
    trackArea: {
        paddingHorizontal: TRACK_PADDING,
        height: 80,
        justifyContent: 'center',
        marginBottom: 20,
    },
    trackLine: {
        position: 'absolute',
        left: TRACK_PADDING + ORB_SIZE / 2,
        right: TRACK_PADDING + ORB_SIZE / 2,
        height: 2,
        backgroundColor: 'rgba(139, 128, 249, 0.12)',
        borderRadius: 1,
        top: '50%',
    },
    orbContainer: {
        width: ORB_SIZE,
        height: ORB_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orb: {
        width: ORB_SIZE,
        height: ORB_SIZE,
        borderRadius: ORB_SIZE / 2,
        borderWidth: 1,
        borderColor: 'rgba(184, 169, 240, 0.4)',
    },
    orbGlow: {
        position: 'absolute',
        width: ORB_SIZE + 20,
        height: ORB_SIZE + 20,
        borderRadius: (ORB_SIZE + 20) / 2,
        backgroundColor: 'rgba(139, 128, 249, 0.15)',
    },
    directionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    insightSection: {
        paddingHorizontal: 24,
        marginBottom: 28,
    },
    insightCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: GlistenColors.surfaceGlass,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(139, 128, 249, 0.08)',
    },
    insightText: {
        flex: 1,
        fontSize: 13,
        fontFamily: Fonts?.sans,
        fontStyle: 'italic',
        color: GlistenColors.textSecondary,
        lineHeight: 18,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 22,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
    },
    statLabel: {
        fontSize: 10,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textMuted,
        letterSpacing: 1.5,
    },
    statDivider: {
        width: 1,
        height: 28,
        backgroundColor: GlistenColors.surfaceBorder,
    },
    speedSection: {
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    speedTitle: {
        fontSize: 10,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textMuted,
        letterSpacing: 1.5,
    },
    speedRow: {
        flexDirection: 'row',
        gap: 10,
    },
    speedBtn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: GlistenColors.surfaceGlass,
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    speedBtnActive: {
        backgroundColor: 'rgba(139, 128, 249, 0.2)',
        borderColor: 'rgba(139, 128, 249, 0.4)',
    },
    speedBtnText: {
        fontSize: 13,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
    },
    speedBtnTextActive: {
        color: GlistenColors.primary,
    },
    footer: {
        marginTop: 'auto',
        alignItems: 'center',
        gap: 10,
    },
    doneBtn: {
        paddingHorizontal: 48,
        paddingVertical: 14,
        borderRadius: 28,
        backgroundColor: 'rgba(139, 128, 249, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(139, 128, 249, 0.3)',
    },
    doneBtnText: {
        fontSize: 13,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
        letterSpacing: 2.5,
    },
    continueBtn: {
        paddingHorizontal: 36,
        paddingVertical: 14,
        borderRadius: 28,
        backgroundColor: 'rgba(139, 128, 249, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(139, 128, 249, 0.4)',
    },
    continueBtnText: {
        fontSize: 13,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.primary,
        letterSpacing: 1.5,
    },
    skipText: {
        fontSize: 13,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textMuted,
        marginTop: 4,
    },
    footerHint: {
        fontSize: 10,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textMuted,
        letterSpacing: 0.5,
    },
});
