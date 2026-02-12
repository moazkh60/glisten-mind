import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Session {
    id: string;
    date: string;
    pattern: string;
    duration: string;
    completed: boolean;
}

const MOCK_SESSIONS: Session[] = [
    { id: '1', date: 'Feb 12', pattern: 'Deep Calm', duration: '15 min', completed: true },
    { id: '2', date: 'Feb 11', pattern: 'Focus Breath', duration: '10 min', completed: true },
    { id: '3', date: 'Feb 10', pattern: 'Sleep Drift', duration: '20 min', completed: true },
];

export function RecentSessions() {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>

            {MOCK_SESSIONS.map((session, index) => (
                <View
                    key={session.id}
                    style={[
                        styles.sessionItem,
                        index === MOCK_SESSIONS.length - 1 && styles.sessionItemLast,
                    ]}
                >
                    <View style={styles.iconWrap}>
                        <Ionicons name="leaf-outline" size={16} color={GlistenColors.primary} />
                    </View>

                    <View style={styles.sessionInfo}>
                        <Text style={styles.sessionMeta}>
                            {session.date} · {session.pattern}
                        </Text>
                    </View>

                    <Text style={styles.sessionDuration}>{session.duration}</Text>

                    {session.completed && (
                        <View style={styles.checkWrap}>
                            <Ionicons name="checkmark-circle" size={18} color="#7BEDA0" />
                        </View>
                    )}
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
    sessionMeta: {
        fontSize: 14,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textPrimary,
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
