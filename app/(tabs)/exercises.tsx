import { Fonts, GlistenColors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ExercisesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Exercises</Text>
            <Text style={styles.subtitle}>Coming soon</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlistenColors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
        marginTop: 8,
    },
});
