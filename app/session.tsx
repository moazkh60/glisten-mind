import { BlobButton } from '@/components/session/BlobButton';
import { DurationPicker } from '@/components/session/DurationPicker';
import { PatternPicker } from '@/components/session/PatternPicker';
import { SessionHeader } from '@/components/session/SessionHeader';
import { SessionTimer } from '@/components/session/SessionTimer';
import {
    BREATHING_PATTERNS,
    BreathingPattern,
    DEFAULT_DURATION,
} from '@/constants/breathingPatterns';
import { Fonts, GlistenColors } from '@/constants/theme';
import { createAndSaveSession, getLatestSession } from '@/utils/sessionStorage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SessionPhase = 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

/**
 * Pick pattern based on time of day (fallback when no data).
 */
function getTimeBasedPattern(): BreathingPattern {
    const hour = new Date().getHours();
    let targetId: string;

    if (hour >= 5 && hour < 12) {
        targetId = 'coherent';       // morning — balance & energise
    } else if (hour >= 12 && hour < 17) {
        targetId = 'box-breathing';  // afternoon — focus
    } else if (hour >= 17 && hour < 21) {
        targetId = 'vagus-calm';     // evening — wind down
    } else {
        targetId = '4-7-8';          // night — sleep prep
    }

    return BREATHING_PATTERNS.find((p) => p.id === targetId) ?? BREATHING_PATTERNS[0];
}

export default function SessionScreen() {
    const insets = useSafeAreaInsets();

    const [pattern, setPattern] = useState<BreathingPattern>(() => getTimeBasedPattern());
    const [durationMin, setDurationMin] = useState(DEFAULT_DURATION);
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [remaining, setRemaining] = useState(DEFAULT_DURATION * 60);
    const [phase, setPhase] = useState<SessionPhase>('idle');

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // On mount, check if there's saved session data to pick pattern from
    useEffect(() => {
        (async () => {
            const latest = await getLatestSession();
            if (latest) {
                const savedPattern = BREATHING_PATTERNS.find((p) => p.id === latest.patternId);
                if (savedPattern) {
                    setPattern(savedPattern);
                }
            }
            // If no data, keeps the time-based default
        })();
    }, []);

    // Time-based mode label for footer
    const hour = new Date().getHours();
    const modeLabel =
        hour >= 5 && hour < 12
            ? 'MORNING CLARITY'
            : hour >= 12 && hour < 17
                ? 'AFTERNOON FOCUS'
                : hour >= 17 && hour < 21
                    ? 'EVENING CALM'
                    : 'NIGHT RESTORE';

    // Update remaining when duration changes (only when idle)
    useEffect(() => {
        if (!isRunning && !isCompleted) {
            setRemaining(durationMin * 60);
        }
    }, [durationMin, isRunning, isCompleted]);

    // Countdown timer
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setRemaining((prev) => {
                    if (prev <= 1) {
                        handleSessionEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning]);

    // Breathing cycle
    const runBreathingCycle = useCallback(() => {
        if (!isRunning) return;

        const cycle = (currentPhase: SessionPhase) => {
            setPhase(currentPhase);

            if (currentPhase === 'inhale' || currentPhase === 'exhale') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            let duration = 0;
            let nextPhase: SessionPhase = 'inhale';

            switch (currentPhase) {
                case 'inhale':
                    duration = pattern.inhale * 1000;
                    nextPhase = pattern.holdIn > 0 ? 'holdIn' : 'exhale';
                    break;
                case 'holdIn':
                    duration = pattern.holdIn * 1000;
                    nextPhase = 'exhale';
                    break;
                case 'exhale':
                    duration = pattern.exhale * 1000;
                    nextPhase = pattern.holdOut > 0 ? 'holdOut' : 'inhale';
                    break;
                case 'holdOut':
                    duration = pattern.holdOut * 1000;
                    nextPhase = 'inhale';
                    break;
            }

            phaseTimerRef.current = setTimeout(() => {
                cycle(nextPhase);
            }, duration);
        };

        cycle('inhale');
    }, [isRunning, pattern]);

    useEffect(() => {
        if (isRunning) {
            runBreathingCycle();
        }

        return () => {
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        };
    }, [isRunning, runBreathingCycle]);

    const handleStart = () => {
        setIsCompleted(false);
        setIsRunning(true);
        setRemaining(durationMin * 60);
    };

    const handleSessionEnd = () => {
        setIsRunning(false);
        setIsCompleted(true);
        setPhase('idle');
        if (timerRef.current) clearInterval(timerRef.current);
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Save session data
        const cycleDuration = pattern.inhale + pattern.holdIn + pattern.exhale + pattern.holdOut;
        createAndSaveSession(pattern.id, pattern.name, durationMin, cycleDuration);
    };

    const handleCompleteSession = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        router.back();
    };

    return (
        <LinearGradient
            colors={[GlistenColors.background, '#0F0D20', GlistenColors.background]}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <SessionHeader title={pattern.name} />

            {/* Haptics badge */}
            <View style={styles.hapticsBadge}>
                <Ionicons name="radio-outline" size={18} color={GlistenColors.primary} />
                <Text style={styles.hapticsText}>HAPTICS ENGAGED</Text>
            </View>

            {/* Instruction */}
            <View style={styles.instruction}>
                {isCompleted ? (
                    <>
                        <Text style={styles.instructionTitle}>Session Complete</Text>
                        <Text style={styles.instructionSubtitle}>Well done — your body is resetting</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.instructionTitle}>Follow the vibrations</Text>
                        <Text style={styles.instructionSubtitle}>Eyes closed encouraged</Text>
                    </>
                )}
            </View>

            {/* Blob */}
            <BlobButton phase={phase} onStart={handleStart} />

            {/* Timer */}
            <View style={styles.timerArea}>
                <SessionTimer
                    remaining={remaining}
                    totalMinutes={durationMin}
                    isRunning={isRunning}
                />
            </View>

            {/* Pattern & duration pickers (only when idle and not completed) */}
            {!isRunning && !isCompleted && (
                <View style={styles.pickers}>
                    <PatternPicker selected={pattern} onSelect={setPattern} />
                    <View style={styles.spacer} />
                    <DurationPicker selected={durationMin} onSelect={setDurationMin} />
                </View>
            )}

            {/* Complete Session button — shown AFTER session finishes */}
            {isCompleted && (
                <View style={styles.completeSection}>
                    <Pressable style={styles.completeBtn} onPress={handleCompleteSession}>
                        <Text style={styles.completeBtnText}>COMPLETE SESSION</Text>
                    </Pressable>
                </View>
            )}

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                <View style={styles.footerLine} />
                <Text style={styles.footerLabel}>{modeLabel}</Text>
                <Text style={styles.footerSub}>{pattern.description.toUpperCase()}</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    hapticsBadge: {
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    hapticsText: {
        fontSize: 11,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.primary,
        letterSpacing: 2,
    },
    instruction: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 8,
        paddingHorizontal: 20,
    },
    instructionTitle: {
        fontSize: 26,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textPrimary,
        textAlign: 'center',
    },
    instructionSubtitle: {
        fontSize: 14,
        fontFamily: Fonts?.sans,
        fontStyle: 'italic',
        color: GlistenColors.textSecondary,
        marginTop: 6,
    },
    timerArea: {
        marginTop: 12,
    },
    pickers: {
        marginTop: 20,
        gap: 14,
    },
    spacer: {
        height: 4,
    },
    completeSection: {
        alignItems: 'center',
        marginTop: 24,
    },
    completeBtn: {
        paddingHorizontal: 36,
        paddingVertical: 14,
        borderRadius: 28,
        backgroundColor: 'rgba(139, 128, 249, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(139, 128, 249, 0.4)',
    },
    completeBtnText: {
        fontSize: 13,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.primary,
        letterSpacing: 2,
    },
    footer: {
        alignItems: 'center',
        marginTop: 'auto',
        gap: 4,
    },
    footerLine: {
        width: 30,
        height: 2,
        borderRadius: 1,
        backgroundColor: GlistenColors.textMuted,
        marginBottom: 8,
    },
    footerLabel: {
        fontSize: 10,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textMuted,
        letterSpacing: 2,
    },
    footerSub: {
        fontSize: 9,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textMuted,
        letterSpacing: 1.5,
        opacity: 0.6,
    },
});
