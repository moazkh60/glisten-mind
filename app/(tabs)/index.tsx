import { BreathingOrb } from '@/components/home/BreathingOrb';
import { HomeHeader } from '@/components/home/HomeHeader';
import { ReadinessCard } from '@/components/home/ReadinessCard';
import { TipCard } from '@/components/home/TipCard';
import { Fonts, GlistenColors } from '@/constants/theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

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

        {/* Readiness card (empty state by default, pass hasData={true} when data exists) */}
        <ReadinessCard />

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
