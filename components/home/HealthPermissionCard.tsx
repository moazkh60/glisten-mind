import { Fonts, GlistenColors } from '@/constants/theme';
import {
    getHealthStatus,
    HealthStatus,
    isHealthAvailable,
    requestHealthPermissions,
} from '@/utils/healthService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const DISMISSED_KEY = '@glisten_health_card_dismissed';

export function HealthPermissionCard() {
    const [status, setStatus] = useState<HealthStatus>('not_asked');
    const [dismissed, setDismissed] = useState(true); // hidden by default until we check
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const wasDismissed = await AsyncStorage.getItem(DISMISSED_KEY);
            const healthStatus = await getHealthStatus();
            setStatus(healthStatus);

            // Show card if health is available and either not asked or already granted
            if (isHealthAvailable() && !wasDismissed) {
                if (healthStatus === 'not_asked' || healthStatus === 'granted') {
                    setDismissed(false);
                }
            }
        })();
    }, []);

    const handleConnect = async () => {
        setLoading(true);
        const granted = await requestHealthPermissions();
        setStatus(granted ? 'granted' : 'denied');
        setLoading(false);
        if (!granted) {
            // If denied, hide the card
            setDismissed(true);
        }
    };

    const handleDismiss = async () => {
        setDismissed(true);
        await AsyncStorage.setItem(DISMISSED_KEY, 'true');
    };

    if (dismissed) return null;

    const platformName = Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect';
    const isConnected = status === 'granted';

    if (isConnected) {
        return (
            <View style={styles.connectedCard}>
                <View style={styles.header}>
                    <View style={styles.connectedIconWrap}>
                        <Ionicons name="checkmark-circle" size={20} color={GlistenColors.scoreGreen} />
                    </View>
                    <View style={styles.textWrap}>
                        <Text style={styles.connectedTitle}>{platformName} Connected</Text>
                        <Text style={styles.connectedSubtitle}>
                            Syncing HRV & heart rate data
                        </Text>
                    </View>
                    <Pressable onPress={handleDismiss} hitSlop={12}>
                        <Ionicons name="close" size={18} color={GlistenColors.textMuted} />
                    </Pressable>
                </View>
            </View>
        );
    }

    const platformIcon = Platform.OS === 'ios' ? 'heart' : 'fitness';

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconWrap}>
                    <Ionicons name={platformIcon as any} size={20} color="#FF6B8A" />
                </View>
                <View style={styles.textWrap}>
                    <Text style={styles.title}>Connect {platformName}</Text>
                    <Text style={styles.subtitle}>
                        Get real HRV & heart rate from your watch
                    </Text>
                </View>
                <Pressable onPress={handleDismiss} hitSlop={12}>
                    <Ionicons name="close" size={18} color={GlistenColors.textMuted} />
                </Pressable>
            </View>

            <Pressable
                style={[styles.connectBtn, loading && styles.connectBtnDisabled]}
                onPress={handleConnect}
                disabled={loading}
            >
                <Ionicons name="link" size={16} color="#fff" />
                <Text style={styles.connectText}>
                    {loading ? 'Connecting...' : `Connect ${platformName}`}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 107, 138, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 138, 0.15)',
    },
    connectedCard: {
        marginHorizontal: 20,
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(123, 237, 160, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(123, 237, 160, 0.15)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 107, 138, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    connectedIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(123, 237, 160, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWrap: {
        flex: 1,
    },
    title: {
        fontFamily: Fonts?.sansSemiBold,
        fontSize: 15,
        color: GlistenColors.textPrimary,
    },
    connectedTitle: {
        fontFamily: Fonts?.sansSemiBold,
        fontSize: 15,
        color: GlistenColors.scoreGreen,
    },
    subtitle: {
        fontFamily: Fonts?.sans,
        fontSize: 12,
        color: GlistenColors.textSecondary,
        marginTop: 2,
    },
    connectedSubtitle: {
        fontFamily: Fonts?.sans,
        fontSize: 12,
        color: GlistenColors.textSecondary,
        marginTop: 2,
    },
    connectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 14,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 138, 0.2)',
    },
    connectBtnDisabled: {
        opacity: 0.5,
    },
    connectText: {
        fontFamily: Fonts?.sansSemiBold,
        fontSize: 13,
        color: '#FF6B8A',
        letterSpacing: 0.5,
    },
});

