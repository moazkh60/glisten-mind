import { Fonts, GlistenColors } from '@/constants/theme';
import { MilestoneItem } from '@/utils/sessionStorage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MilestonesProps {
    milestones: MilestoneItem[];
}

export function Milestones({ milestones }: MilestonesProps) {
    const unlocked = milestones.filter((m) => m.unlocked).length;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Milestones</Text>
                <Text style={styles.countBadge}>{unlocked}/{milestones.length}</Text>
            </View>

            <View style={styles.grid}>
                {milestones.map((m) => (
                    <View key={m.id} style={styles.badgeOuter}>
                        <LinearGradient
                            colors={
                                m.unlocked
                                    ? ['rgba(40, 35, 75, 0.7)', 'rgba(26, 23, 48, 0.9)']
                                    : ['rgba(20, 18, 38, 0.5)', 'rgba(16, 14, 30, 0.6)']
                            }
                            style={styles.badge}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View
                                style={[
                                    styles.iconWrap,
                                    !m.unlocked && styles.iconWrapLocked,
                                ]}
                            >
                                <Ionicons
                                    name={m.icon as keyof typeof Ionicons.glyphMap}
                                    size={20}
                                    color={m.unlocked ? GlistenColors.primary : GlistenColors.textMuted}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.badgeTitle,
                                    !m.unlocked && styles.badgeTitleLocked,
                                ]}
                            >
                                {m.title}
                            </Text>
                            {m.unlocked && (
                                <View style={styles.checkWrap}>
                                    <Ionicons name="checkmark-circle" size={14} color="#7BEDA0" />
                                </View>
                            )}
                        </LinearGradient>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 15,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
    },
    countBadge: {
        fontSize: 12,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    badgeOuter: {
        width: '31%',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    badge: {
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 16,
        alignItems: 'center',
        gap: 8,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(139, 128, 249, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapLocked: {
        backgroundColor: 'rgba(139, 128, 249, 0.05)',
    },
    badgeTitle: {
        fontSize: 11,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
        textAlign: 'center',
    },
    badgeTitleLocked: {
        color: GlistenColors.textMuted,
    },
    checkWrap: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});
