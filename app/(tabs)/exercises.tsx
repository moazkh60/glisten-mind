import { ActionCards } from '@/components/dashboard/ActionCards';
import { DriftButton } from '@/components/dashboard/DriftButton';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { StatusInsight } from '@/components/dashboard/StatusInsight';
import { ToneRing } from '@/components/dashboard/ToneRing';
import { Fonts, GlistenColors } from '@/constants/theme';
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { getReadinessTitle } from '@/utils/sessionStorage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FlowScreen() {
    const insets = useSafeAreaInsets();
    const { latestSession } = useSessionHistory();

    // Time-based greeting — refreshes on focus
    const [hour, setHour] = useState(() => new Date().getHours());

    useFocusEffect(
        useCallback(() => {
            setHour(new Date().getHours());
        }, [])
    );

    const greeting =
        hour >= 5 && hour < 12
            ? 'Good Morning'
            : hour >= 12 && hour < 17
                ? 'Good Afternoon'
                : hour >= 17 && hour < 21
                    ? 'Good Evening'
                    : 'Good Night';

    // Time-based mode label
    const mode = hour >= 20 || hour < 6 ? 'NIGHTFALL' : hour >= 17 ? 'DUSK' : 'DAYLIGHT';

    const hasData = !!latestSession;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerLabel}>VAGUS SYNC • {mode}</Text>
                        <Text style={styles.greeting}>{greeting}</Text>
                    </View>
                </View>

                {/* Tone Ring */}
                <View style={styles.ringSection}>
                    <ToneRing
                        hasData={hasData}
                        score={latestSession?.score}
                        label={latestSession ? getReadinessTitle(latestSession.patternId) : undefined}
                    />
                </View>

                {/* Quick Stats */}
                <View style={styles.section}>
                    <QuickStats hasData={hasData} />
                </View>

                {/* Status Insight */}
                <View style={styles.section}>
                    <StatusInsight hasData={hasData} />
                </View>

                {/* Action Cards */}
                <View style={styles.section}>
                    <ActionCards />
                </View>

                {/* Combined session CTA */}
                <View style={styles.ctaSection}>
                    <DriftButton />
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
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 4,
    },
    headerLabel: {
        fontSize: 10,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    greeting: {
        fontSize: 26,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textPrimary,
    },
    ringSection: {
        marginTop: 4,
        marginBottom: 8,
    },
    section: {
        marginBottom: 14,
    },
    ctaSection: {
        marginTop: 8,
        marginBottom: 16,
    },
});
