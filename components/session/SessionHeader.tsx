import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SessionHeaderProps {
    title: string;
}

export function SessionHeader({ title }: SessionHeaderProps) {
    return (
        <View style={styles.container}>
            <Pressable
                style={styles.closeButton}
                onPress={() => router.back()}
                hitSlop={12}
            >
                <Ionicons name="close" size={20} color={GlistenColors.textSecondary} />
            </Pressable>

            <Text style={styles.title}>{title.toUpperCase()}</Text>

            <View style={styles.placeholder} />
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
        paddingBottom: 16,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: GlistenColors.surfaceGlass,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    title: {
        fontSize: 12,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.primary,
        letterSpacing: 2,
    },
    placeholder: {
        width: 36,
    },
});
