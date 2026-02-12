import { ActionCards } from '@/components/dashboard/ActionCards';
import { DriftButton } from '@/components/dashboard/DriftButton';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { StatusInsight } from '@/components/dashboard/StatusInsight';
import { ToneRing } from '@/components/dashboard/ToneRing';
import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FlowScreen() {
    const insets = useSafeAreaInsets();

    // Time-based greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

    // Time-based mode label
    const mode = hour >= 20 || hour < 6 ? 'NIGHTFALL' : hour >= 17 ? 'DUSK' : 'DAYLIGHT';

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
                        <Text style={styles.greeting}>{greeting}, Alex</Text>
                    </View>
                    <Pressable style={styles.settingsBtn}>
                        <Ionicons name="grid-outline" size={20} color={GlistenColors.textSecondary} />
                    </Pressable>
                </View>

                {/* Tone Ring */}
                <View style={styles.ringSection}>
                    <ToneRing />
                </View>

                {/* Quick Stats */}
                <View style={styles.section}>
                    <QuickStats />
                </View>

                {/* Status Insight */}
                <View style={styles.section}>
                    <StatusInsight />
                </View>

                {/* Action Cards */}
                <View style={styles.section}>
                    <ActionCards />
                </View>
            </ScrollView>

            {/* Fixed bottom CTA */}
            <View style={[styles.bottomCta, { paddingBottom: insets.bottom + 10 }]}>
                <DriftButton />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlistenColors.background,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
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
    settingsBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: GlistenColors.surfaceGlass,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    ringSection: {
        marginTop: 8,
        marginBottom: 12,
    },
    section: {
        marginBottom: 18,
    },
    bottomCta: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 12,
        backgroundColor: GlistenColors.background,
    },
});
