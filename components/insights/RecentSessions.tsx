import { Fonts, GlistenColors } from '@/constants/theme';
import { SessionRecord } from '@/utils/sessionStorage';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RecentSessionsProps {
    sessions: SessionRecord[];
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
}

function formatTime(iso: string): string {
    const d = new Date(iso);
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m} ${ampm}`;
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
    if (sessions.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Recent Sessions</Text>
                <View style={styles.emptyState}>
                    <Ionicons name="time-outline" size={22} color={GlistenColors.textMuted} />
                    <Text style={styles.emptyText}>
                        Your completed sessions will appear here
                    </Text>
                </View>
            </View>
        );
    }

    // Show last 5 sessions, most recent first
    const recent = [...sessions].reverse().slice(0, 5);

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>

            {recent.map((session, index) => (
                <View
                    key={session.id}
                    style={[
                        styles.sessionItem,
                        index === recent.length - 1 && styles.sessionItemLast,
                    ]}
                >
                    <View style={styles.iconWrap}>
                        <Ionicons name="leaf-outline" size={16} color={GlistenColors.primary} />
                    </View>

                    <View style={styles.sessionInfo}>
                        <Text style={styles.sessionPattern}>{session.patternName}</Text>
                        <Text style={styles.sessionMeta}>
                            {formatDate(session.completedAt)} · {formatTime(session.completedAt)}
                        </Text>
                    </View>

                    <Text style={styles.sessionDuration}>{session.durationMin} min</Text>

                    <View style={styles.checkWrap}>
                        <Ionicons name="checkmark-circle" size={18} color="#7BEDA0" />
                    </View>
                </View>
            ))}
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
    emptyState: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 16,
    },
    emptyText: {
        fontSize: 13,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textMuted,
    },
    sessionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(139, 128, 249, 0.06)',
        gap: 12,
    },
    sessionItemLast: {
        borderBottomWidth: 0,
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(139, 128, 249, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sessionInfo: {
        flex: 1,
    },
    sessionPattern: {
        fontSize: 14,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
    },
    sessionMeta: {
        fontSize: 11,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
        marginTop: 2,
    },
    sessionDuration: {
        fontSize: 13,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
    },
    checkWrap: {
        marginLeft: 4,
    },
});
