// app/(protected)/_ProtectedScreen.tsx (opcional, helper local)
import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PALETTE = {
  bg: "#F1F8E9",
  title: "#388e3c",
  primary: "#4caf50",
  onPrimary: "#ffffff",
  border: "#E3F2E1",
  card: "#ffffff",
};

export default function ProtectedScreen({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  const router = useRouter();

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: PALETTE.bg }]}>
      {/* Top bar */}
      <View style={s.topbar}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/perfil")}>
          <Text style={[s.topLink, { color: PALETTE.title }]}>← Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={s.body}>
        <Text style={[s.h1, { color: PALETTE.title }]}>{title}</Text>
        <View style={[s.card, { borderColor: PALETTE.border }]}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  topbar: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topLink: { fontWeight: "700" },
  body: { flex: 1, padding: 20, gap: 12 },
  h1: { fontSize: 22, fontWeight: "800" },
 card: { backgroundColor: PALETTE.card, borderRadius: 16, padding: 16, borderWidth: 1, flex: 1 },
});
