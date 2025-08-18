// app/(auth)/login.tsx
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../_layout";

// Paleta acorde a tu app
const PALETTE = {
  bg: "#F1F8E9",
  primary: "#4caf50",     // botones
  title: "#388e3c",       // títulos
  onPrimary: "#ffffff",   // texto en botón
  card: "#ffffff",
  border: "#E3F2E1",
  text: "#1f2937",
};

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const passRef = useRef<TextInput>(null);

  const onSubmit = async () => {
    if (!correo.trim() || !password) {
      Alert.alert("Campos requeridos", "Completa correo y contraseña.");
      return;
    }
    setLoading(true);
    try {
      await login(correo.trim(), password);
      router.replace("/(tabs)/perfil"); // ✅ ruta absoluta correcta
    } catch (err: any) {
      Alert.alert("No se pudo iniciar sesión", err?.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: PALETTE.bg }]}>
      {/* Top bar */}
      <View style={s.topbar}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/perfil")}>
          <Text style={[s.topLink, { color: PALETTE.title }]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={s.container}>
          <Text style={[s.h1, { color: PALETTE.title }]}>Iniciar sesión</Text>
          <Text style={s.subtitle}>Accede para reportar y consultar información.</Text>

          <View style={[s.card, { borderColor: PALETTE.border }]}>
            <View style={s.group}>
              <Text style={[s.label, { color: PALETTE.title }]}>Correo</Text>
              <TextInput
                style={[s.input, { borderColor: PALETTE.title }]}
                placeholder="ej: juan@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={correo}
                onChangeText={setCorreo}
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passRef.current?.focus()}
                autoFocus
              />
            </View>

            <View style={s.group}>
              <Text style={[s.label, { color: PALETTE.title }]}>Contraseña</Text>
              <View style={s.passwordRow}>
                <TextInput
                  ref={passRef}
                  style={[s.input, { flex: 1, borderColor: PALETTE.title }]}
                  placeholder="••••••••"
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={setPassword}
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                />
                <TouchableOpacity onPress={() => setShowPass((v) => !v)} style={s.showBtn}>
                  <Text style={{ color: PALETTE.title, fontWeight: "700" }}>
                    {showPass ? "Ocultar" : "Ver"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[s.primary, { backgroundColor: PALETTE.primary }]}
              onPress={onSubmit}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={PALETTE.onPrimary} /> : <Text style={[s.btnText, { color: PALETTE.onPrimary }]}>Entrar</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/(auth)/register")} style={s.alt}>
              <Text style={{ color: PALETTE.title }}>
                ¿No tienes cuenta? <Text style={{ fontWeight: "700" }}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 20 },
  h1: { fontSize: 26, fontWeight: "800" },
  subtitle: { color: "#4b5563", marginTop: 4, marginBottom: 12 },

  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },

  group: { gap: 6, marginBottom: 12 },
  label: { fontWeight: "700" },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
  },

  passwordRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  showBtn: { paddingHorizontal: 8, paddingVertical: 10 },

  primary: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { fontWeight: "bold" },
  alt: { alignItems: "center", marginTop: 12 },
  topbar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topLink: { fontWeight: "700" },
});
