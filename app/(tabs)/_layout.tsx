import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

// 👇 Importa el contexto para cambiar el título según sesión
import { useAuth } from '../_layout';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      {/* 👇 Nueva pestaña Perfil */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: user ? 'Perfil' : 'Entrar',
          tabBarIcon: ({ color, size }) =>
           Platform.OS === "ios" ? (
        <IconSymbol size={size ?? 28} name="person.fill" color={color} />
      ) : (
        <Ionicons name="person" size={size ?? 28} color={color} />
      ),
        }}
      />
    </Tabs>
  );
}
