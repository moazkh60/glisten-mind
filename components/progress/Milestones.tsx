import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Milestone {
    id: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    unlocked: boolean;
}

const MILESTONES: Milestone[] = [
    { id: '1', title: 'First Session', icon: 'leaf', unlocked: true },
    { id: '2', title: '7 Day Streak', icon: 'flame', unlocked: true },
    { id: '3', title: '1 Hour Total', icon: 'time', unlocked: true },
    { id: '4', title: '30 Sessions', icon: 'star', unlocked: false },
    { id: '5', title: 'Night Owl', icon: 'moon', unlocked: false },
    { id: '6', title: 'Zen Master', icon: 'diamond', unlocked: false },
];

export function Milestones() {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Milestones</Text>

            <View style={styles.grid}>
                {MILESTONES.map((m) => (
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
                                    name={m.icon}
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
    sectionTitle: {
        fontSize: 15,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
        marginBottom: 12,
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
});
