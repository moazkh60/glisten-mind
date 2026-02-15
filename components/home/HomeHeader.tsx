import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function HomeHeader() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60_000);
        return () => clearInterval(timer);
    }, []);

    const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    const timeStr = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <View style={styles.moonBadge}>
                    <Ionicons name="moon" size={18} color={GlistenColors.primary} />
                </View>
                <View style={styles.textGroup}>
                    <Text style={styles.modeLabel}>NIGHT MODE</Text>
                    <Text style={styles.dateTime}>{dayName}, {timeStr}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    moonBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: GlistenColors.surfaceGlass,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textGroup: {
        gap: 1,
    },
    modeLabel: {
        fontSize: 11,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
        letterSpacing: 1.5,
    },
    dateTime: {
        fontSize: 12,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
    },
});
