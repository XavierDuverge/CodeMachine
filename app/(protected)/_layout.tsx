// app/(protected)/_layout.tsx
import { Redirect, Slot } from "expo-router";
import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../_layout";

const PALETTE = {
  bg: "#F1F8E9",
  title: "#388e3c",
};

export default function ProtectedLayout() {
  const { loading, token } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: PALETTE.bg }]}>
        <View style={s.center}>
          <ActivityIndicator />
          <Text style={[s.loadingText, { color: PALETTE.title }]}>Cargando…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!token) {
    // Si no está logueado → al Login
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  loadingText: { fontWeight: "700" },
});
