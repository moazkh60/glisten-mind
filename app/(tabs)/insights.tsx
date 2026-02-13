import { HrvChart } from '@/components/insights/HrvChart';
import { RecentSessions } from '@/components/insights/RecentSessions';
import { StatCards } from '@/components/insights/StatCards';
import { VagusToneTracker } from '@/components/insights/VagusToneTracker';
import { Fonts, GlistenColors } from '@/constants/theme';
import {
    SessionRecord,
    getAllSessions,
    getAverageHrv,
    getDailyHrvData,
    getHrvTrend,
    getSessionsInRange,
    getVagusToneScores,
} from '@/utils/sessionStorage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TIME_RANGES = ['This Week', 'This Month', 'All Time'];

export default function InsightsScreen() {
    const insets = useSafeAreaInsets();
    const [timeRange, setTimeRange] = useState(0);
    const [allSessions, setAllSessions] = useState<SessionRecord[]>([]);

    // Reload sessions whenever the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const sessions = await getAllSessions();
                setAllSessions(sessions);
            })();
        }, [])
    );

    const cycleTimeRange = () => {
        setTimeRange((prev) => (prev + 1) % TIME_RANGES.length);
    };

    // Derive all computed data from filtered sessions
    const filtered = getSessionsInRange(allSessions, timeRange);
    const { labels: hrvLabels, values: hrvValues } = getDailyHrvData(filtered);
    const avgHrv = getAverageHrv(filtered);
    const hrvTrend = getHrvTrend(filtered);
    const toneScores = getVagusToneScores(filtered);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>INSIGHTS</Text>
                    <Pressable style={styles.rangePill} onPress={cycleTimeRange}>
                        <Text style={styles.rangeText}>{TIME_RANGES[timeRange]}</Text>
                        <Ionicons name="chevron-down" size={12} color={GlistenColors.textSecondary} />
                    </Pressable>
                </View>

                {/* HRV Chart */}
                <View style={styles.section}>
                    <HrvChart labels={hrvLabels} values={hrvValues} />
                </View>

                {/* Stat Cards */}
                <View style={styles.section}>
                    <StatCards
                        avgHrv={avgHrv}
                        sessionCount={filtered.length}
                        hrvTrend={hrvTrend}
                    />
                </View>

                {/* Vagus Tone Tracker */}
                <View style={styles.section}>
                    <VagusToneTracker scores={toneScores} />
                </View>

                {/* Recent Sessions */}
                <View style={styles.section}>
                    <RecentSessions sessions={filtered} />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
    },
    title: {
        fontSize: 22,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
        letterSpacing: 1,
    },
    rangePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: GlistenColors.surfaceGlass,
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    rangeText: {
        fontSize: 12,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
    },
    section: {
        marginBottom: 16,
    },
});
