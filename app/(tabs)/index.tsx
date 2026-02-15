import { BreathingOrb } from '@/components/home/BreathingOrb';
import { HealthPermissionCard } from '@/components/home/HealthPermissionCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { ReadinessCard } from '@/components/home/ReadinessCard';
import { TipCard } from '@/components/home/TipCard';
import { Fonts, GlistenColors } from '@/constants/theme';
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { getReadinessTitle } from '@/utils/sessionStorage';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { latestSession } = useSessionHistory();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        {/* Hero text */}
        <View style={styles.heroSection}>
          <Text style={styles.heroText}>
            Ease and <Text style={styles.heroItalic}>unwind</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Preparing your parasympathetic system
          </Text>
        </View>

        {/* Breathing orb */}
        <BreathingOrb />

        {/* Readiness card — shows real data after first session */}
        <ReadinessCard
          hasData={!!latestSession}
          title={latestSession ? getReadinessTitle(latestSession.patternId) : undefined}
          score={latestSession?.score}
          hrv={latestSession?.hrv}
          breathRate={latestSession?.breathRate}
        />

        {/* Health platform connection prompt */}
        <HealthPermissionCard />

        {/* Contextual tip */}
        <TipCard />
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
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  heroText: {
    fontSize: 32,
    fontFamily: Fonts?.sans,
    color: GlistenColors.textPrimary,
    textAlign: 'center',
  },
  heroItalic: {
    fontStyle: 'italic',
    fontFamily: Fonts?.sansBold,
    color: GlistenColors.primary,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: Fonts?.sans,
    color: GlistenColors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
});
