// app/(auth)/register.tsx
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../_layout";

const PALETTE = {
  bg: "#F1F8E9",
  primary: "#4caf50",
  title: "#388e3c",
  onPrimary: "#ffffff",
  card: "#ffffff",
  border: "#E3F2E1",
  text: "#1f2937",
};

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    telefono: "",
    matricula: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // refs
  const nombreRef = useRef<TextInput>(null);
  const apellidoRef = useRef<TextInput>(null);
  const correoRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const telRef = useRef<TextInput>(null);
  const matriculaRef = useRef<TextInput>(null);

  const set = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Máscaras simples
  const maskCedula = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    const a = d.slice(0, 3);
    const b = d.slice(3, 10);
    const c = d.slice(10, 11);
    return [a, b && `-${b}`, c && `-${c}`].filter(Boolean).join("");
  };
  const maskPhone = (v: string) => v.replace(/\D/g, "").slice(0, 15);

  const validate = () => {
    if (!form.cedula.trim() || form.cedula.replace(/\D/g, "").length !== 11)
      return "Cédula inválida (debe tener 11 dígitos).";
    if (!form.nombre.trim()) return "Nombre requerido.";
    if (!form.apellido.trim()) return "Apellido requerido.";
    if (!form.correo.trim() || !/\S+@\S+\.\S+/.test(form.correo))
      return "Correo inválido.";
    if (!form.password || form.password.length < 6)
      return "Contraseña mínima de 6 caracteres.";
    if (!form.telefono.trim()) return "Teléfono requerido.";
    if (!form.matricula.trim()) return "Matrícula requerida.";
    return null;
  };

  const onSubmit = async () => {
    const msg = validate();
    if (msg) {
      Alert.alert("Validación", msg);
      return;
    }
    setLoading(true);
    try {
      await register({
        cedula: form.cedula.replace(/\D/g, ""),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        correo: form.correo.trim(),
        password: form.password,
        telefono: form.telefono.trim(),
        matricula: form.matricula.trim(),
      });
      router.replace("/(tabs)/perfil");
    } catch (err: any) {
      Alert.alert("No se pudo registrar", err?.message ?? "Error desconocido");
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
          <Text style={[s.h1, { color: PALETTE.title }]}>Crear cuenta</Text>
          <Text style={s.subtitle}>Completa tus datos para registrarte.</Text>

          <View style={[s.card, { borderColor: PALETTE.border }]}>
            <Field
              label="Cédula"
              value={form.cedula}
              onChangeText={(v) => set("cedula", maskCedula(v))}
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => nombreRef.current?.focus()}
            />
            <Field
              innerRef={nombreRef}
              label="Nombre"
              value={form.nombre}
              onChangeText={(v) => set("nombre", v)}
              returnKeyType="next"
              onSubmitEditing={() => apellidoRef.current?.focus()}
            />
            <Field
              innerRef={apellidoRef}
              label="Apellido"
              value={form.apellido}
              onChangeText={(v) => set("apellido", v)}
              returnKeyType="next"
              onSubmitEditing={() => correoRef.current?.focus()}
            />
            <Field
              innerRef={correoRef}
              label="Correo"
              value={form.correo}
              onChangeText={(v) => set("correo", v)}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passRef.current?.focus()}
            />

            <Text style={[s.label, { color: PALETTE.title }]}>Contraseña</Text>
            <View style={s.passwordRow}>
              <TextInput
                ref={passRef}
                style={[s.input, { flex: 1, borderColor: PALETTE.title }]}
                placeholder="••••••••"
                secureTextEntry={!showPass}
                value={form.password}
                onChangeText={(v) => set("password", v)}
                textContentType="password"
                returnKeyType="next"
                onSubmitEditing={() => telRef.current?.focus()}
              />
              <TouchableOpacity onPress={() => setShowPass((v) => !v)} style={s.showBtn}>
                <Text style={{ color: PALETTE.title, fontWeight: "700" }}>
                  {showPass ? "Ocultar" : "Ver"}
                </Text>
              </TouchableOpacity>
            </View>

            <Field
              innerRef={telRef}
              label="Teléfono"
              value={form.telefono}
              onChangeText={(v) => set("telefono", maskPhone(v))}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => matriculaRef.current?.focus()}
            />
            <Field
              innerRef={matriculaRef}
              label="Matrícula"
              value={form.matricula}
              onChangeText={(v) => set("matricula", v)}
              returnKeyType="done"
            />

            <TouchableOpacity
              style={[s.primary, { backgroundColor: PALETTE.primary }]}
              onPress={onSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={PALETTE.onPrimary} />
              ) : (
                <Text style={[s.btnText, { color: PALETTE.onPrimary }]}>Registrarme</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/(auth)/login")} style={s.alt}>
              <Text style={{ color: PALETTE.title }}>
                ¿Ya tienes cuenta? <Text style={{ fontWeight: "700" }}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 👇 Acepta tanto RefObject como MutableRefObject con null
type InputRef =
  | React.RefObject<TextInput>
  | React.MutableRefObject<TextInput | null>;

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  returnKeyType,
  onSubmitEditing,
  innerRef,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
  innerRef?: InputRef;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[s.label, { color: PALETTE.title }]}>{label}</Text>
      <TextInput
        ref={innerRef as any}  // TS feliz: compatible con ambos tipos de ref
        style={[s.input, { borderColor: PALETTE.title }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholder={label}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20 },
  h1: { fontSize: 26, fontWeight: "800" },
  subtitle: { color: "#4b5563", marginTop: 4, marginBottom: 12 },

  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },

  label: { fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
  },

  passwordRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  showBtn: { paddingHorizontal: 8, paddingVertical: 10 },

  primary: {
    marginTop: 4,
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
