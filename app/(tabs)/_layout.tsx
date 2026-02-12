import { HapticTab } from '@/components/haptic-tab';
import { GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: GlistenColors.primary,
        tabBarInactiveTintColor: GlistenColors.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter_600SemiBold',
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          backgroundColor: GlistenColors.surface,
          borderTopColor: GlistenColors.surfaceBorder,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Ionicons name={focused ? 'moon' : 'moon-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Flow',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'flame' : 'flame-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'pulse' : 'pulse-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'trending-up' : 'trending-up-outline'} size={24} color={color} />
          ),
        }}
      />
      {/* Hide the old explore tab */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconWrap: {
    backgroundColor: 'rgba(139, 128, 249, 0.12)',
    borderRadius: 12,
    padding: 6,
  },
});
