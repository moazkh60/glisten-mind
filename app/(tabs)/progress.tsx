import { CalendarHeatmap } from '@/components/progress/CalendarHeatmap';
import { LifetimeStats } from '@/components/progress/LifetimeStats';
import { Milestones } from '@/components/progress/Milestones';
import { StreakRing } from '@/components/progress/StreakRing';
import { Fonts, GlistenColors } from '@/constants/theme';
import {
    SessionRecord,
    getActiveDaysThisMonth,
    getAllSessions,
    getBestStreak,
    getCurrentStreak,
    getMilestones,
    getTotalMinutes,
} from '@/utils/sessionStorage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProgressScreen() {
    const insets = useSafeAreaInsets();
    const [sessions, setSessions] = useState<SessionRecord[]>([]);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const all = await getAllSessions();
                setSessions(all);
            })();
        }, [])
    );

    // Derive all progress data
    const streak = getCurrentStreak(sessions);
    const bestStreak = getBestStreak(sessions);
    const totalMinutes = getTotalMinutes(sessions);
    const activeDays = getActiveDaysThisMonth(sessions);
    const milestones = getMilestones(sessions);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="moon" size={18} color={GlistenColors.primary} />
                    <Text style={styles.title}>YOUR JOURNEY</Text>
                </View>

                {/* Streak Ring */}
                <View style={styles.section}>
                    <StreakRing days={streak} />
                </View>

                {/* Calendar */}
                <View style={styles.section}>
                    <CalendarHeatmap activeDays={activeDays} />
                </View>

                {/* Lifetime Stats */}
                <View style={styles.section}>
                    <LifetimeStats
                        totalSessions={sessions.length}
                        totalMinutes={totalMinutes}
                        bestStreak={bestStreak}
                    />
                </View>

                {/* Milestones */}
                <View style={styles.section}>
                    <Milestones milestones={milestones} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlistenColors.background,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
        letterSpacing: 1.5,
    },
    section: {
        marginBottom: 20,
    },
});
