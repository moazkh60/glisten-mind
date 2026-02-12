import { BlobButton } from '@/components/session/BlobButton';
import { DurationPicker } from '@/components/session/DurationPicker';
import { PatternPicker } from '@/components/session/PatternPicker';
import { SessionHeader } from '@/components/session/SessionHeader';
import { SessionTimer } from '@/components/session/SessionTimer';
import {
    BreathingPattern,
    DEFAULT_DURATION,
    DEFAULT_PATTERN,
} from '@/constants/breathingPatterns';
import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SessionPhase = 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

export default function SessionScreen() {
    const insets = useSafeAreaInsets();

    const [pattern, setPattern] = useState<BreathingPattern>(DEFAULT_PATTERN);
    const [durationMin, setDurationMin] = useState(DEFAULT_DURATION);
    const [isRunning, setIsRunning] = useState(false);
    const [remaining, setRemaining] = useState(DEFAULT_DURATION * 60);
    const [phase, setPhase] = useState<SessionPhase>('idle');

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Update remaining when duration changes (only when idle)
    useEffect(() => {
        if (!isRunning) {
            setRemaining(durationMin * 60);
        }
    }, [durationMin, isRunning]);

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

            // Trigger haptic at phase transitions
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
        setIsRunning(true);
        setRemaining(durationMin * 60);
    };

    const handleSessionEnd = () => {
        setIsRunning(false);
        setPhase('idle');
        if (timerRef.current) clearInterval(timerRef.current);
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
                <Text style={styles.instructionTitle}>Follow the vibrations</Text>
                <Text style={styles.instructionSubtitle}>Eyes closed encouraged</Text>
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

            {/* Pattern & duration pickers (hidden during session) */}
            {!isRunning && (
                <View style={styles.pickers}>
                    <PatternPicker selected={pattern} onSelect={setPattern} />
                    <View style={styles.spacer} />
                    <DurationPicker selected={durationMin} onSelect={setDurationMin} />
                </View>
            )}

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                <View style={styles.footerLine} />
                <Text style={styles.footerLabel}>EVENING CALM MODE</Text>
                <Text style={styles.footerSub}>THEME: MIDNIGHT LAVENDER</Text>
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
