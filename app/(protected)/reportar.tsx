// app/(protected)/reportar.tsx
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
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
import ProtectedScreen from "./_ProtectedScreen";

const PALETTE = {
  bg: "#F1F8E9",
  title: "#388e3c",
  primary: "#4caf50",
  onPrimary: "#ffffff",
  border: "#E3F2E1",
  card: "#ffffff",
  text: "#1f2937",
};

const API_BASE = "https://adamix.net/medioambiente";

export default function Reportar() {
  const { token } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [latitud, setLatitud] = useState<string>("");
  const [longitud, setLongitud] = useState<string>("");

  const [sending, setSending] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // ---- Imagen (galería o cámara) ----
  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Autoriza el acceso a tus fotos.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true, // 👈 necesario para enviar a la API
      quality: 0.7,
      allowsEditing: true,
    });
    if (!res.canceled && res.assets?.length) {
      const a = res.assets[0];
      setFotoUri(a.uri ?? null);
      setFotoBase64(a.base64 ?? null);
    }
  };

  const takePhoto = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    if (cam.status !== "granted") {
      Alert.alert("Permiso requerido", "Autoriza el uso de la cámara.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.7,
      allowsEditing: true,
    });
    if (!res.canceled && res.assets?.length) {
      const a = res.assets[0];
      setFotoUri(a.uri ?? null);
      setFotoBase64(a.base64 ?? null);
    }
  };

  const clearPhoto = () => {
    setFotoUri(null);
    setFotoBase64(null);
  };

  // ---- Ubicación actual ----
  const getMyLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Autoriza el acceso a tu ubicación.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLatitud(String(pos.coords.latitude));
      setLongitud(String(pos.coords.longitude));
    } catch (e: any) {
      Alert.alert("Error", "No se pudo obtener tu ubicación.");
    } finally {
      setGettingLocation(false);
    }
  };

  // ---- Validación + Envío ----
  const validate = () => {
    if (!titulo.trim()) return "El título es requerido.";
    if (!descripcion.trim() || descripcion.trim().length < 10)
      return "La descripción debe tener al menos 10 caracteres.";
    if (!fotoBase64) return "La foto es requerida.";
    const lat = Number(latitud);
    const lng = Number(longitud);
    if (!isFinite(lat) || !isFinite(lng)) return "Latitud/Longitud inválidas.";
    return null;
  };

  const onSubmit = async () => {
    const msg = validate();
    if (msg) {
      Alert.alert("Validación", msg);
      return;
    }
    if (!token) {
      Alert.alert("Sesión requerida", "Inicia sesión para enviar reportes.");
      return;
    }

    setSending(true);
    try {
      const body = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        // La API espera el base64 "puro" (sin prefijo data:). Si lo pidiera, sería:
        // `data:image/jpeg;base64,${fotoBase64}`
        foto: fotoBase64!,
        latitud: Number(latitud),
        longitud: Number(longitud),
      };

      const res = await fetch(`${API_BASE}/reportes`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ requerido
        },
        body: JSON.stringify(body),
      });

      if (res.status === 201) {
        Alert.alert("Éxito", "Reporte creado correctamente.");
        // Limpia el formulario
        setTitulo("");
        setDescripcion("");
        clearPhoto();
        setLatitud("");
        setLongitud("");
      } else if (res.status === 401) {
        Alert.alert("No autorizado", "Tu sesión expiró. Inicia sesión nuevamente.");
      } else {
        const txt = await res.text().catch(() => "");
        Alert.alert("Error", `No se pudo crear el reporte. (HTTP ${res.status}) ${txt || ""}`);
      }
    } catch (e: any) {
      Alert.alert("Error", "No se pudo enviar el reporte.");
    } finally {
      setSending(false);
    }
  };

  return (
    <ProtectedScreen title="🚨 Reportar Daño Ambiental">
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
            {/* Título */}
            <View style={s.group}>
              <Text style={[s.label, { color: PALETTE.title }]}>Título</Text>
              <TextInput
                style={[s.input, { borderColor: PALETTE.title }]}
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ej. Vertido de residuos en río"
                returnKeyType="next"
              />
            </View>

            {/* Descripción */}
            <View style={s.group}>
              <Text style={[s.label, { color: PALETTE.title }]}>Descripción</Text>
              <TextInput
                style={[s.input, s.multiline, { borderColor: PALETTE.title }]}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Describe lo sucedido (qué, cuándo, dónde)…"
                multiline
              />
            </View>

            {/* Foto */}
            <View style={[s.card, { borderColor: PALETTE.border }]}>
              <Text style={[s.sectionTitle, { color: PALETTE.title }]}>Foto (requerida)</Text>

              {fotoUri ? (
                <View style={{ marginTop: 8 }}>
                  <Image source={{ uri: fotoUri }} style={s.preview} />
                  <View style={s.row}>
                    <TouchableOpacity style={[s.btn, s.btnOutline]} onPress={clearPhoto}>
                      <Text style={s.btnOutlineText}>Quitar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={[s.row, { marginTop: 8 }]}>
                  <TouchableOpacity
                    style={[s.btn, s.btnPrimary, { backgroundColor: PALETTE.primary }]}
                    onPress={takePhoto}
                  >
                    <Text style={[s.btnPrimaryText, { color: PALETTE.onPrimary }]}>Tomar foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.btn, s.btnOutline]} onPress={pickFromLibrary}>
                    <Text style={s.btnOutlineText}>Elegir de galería</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Ubicación */}
            <View style={[s.card, { borderColor: PALETTE.border }]}>
              <Text style={[s.sectionTitle, { color: PALETTE.title }]}>Ubicación</Text>

              <View style={s.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.label, { color: PALETTE.title }]}>Latitud</Text>
                  <TextInput
                    style={[s.input, { borderColor: PALETTE.title }]}
                    value={latitud}
                    onChangeText={setLatitud}
                    keyboardType="decimal-pad"
                    placeholder="Ej. 18.5001"
                  />
                </View>
                <View style={{ width: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[s.label, { color: PALETTE.title }]}>Longitud</Text>
                  <TextInput
                    style={[s.input, { borderColor: PALETTE.title }]}
                    value={longitud}
                    onChangeText={setLongitud}
                    keyboardType="decimal-pad"
                    placeholder="-69.8003"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[s.btn, s.btnOutline, { marginTop: 8 }]}
                onPress={getMyLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={s.btnOutlineText}>Usar mi ubicación actual</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Enviar */}
            <TouchableOpacity
              style={[s.submit, { backgroundColor: PALETTE.primary }]}
              onPress={onSubmit}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator color={PALETTE.onPrimary} />
              ) : (
                <Text style={[s.submitText, { color: PALETTE.onPrimary }]}>Enviar reporte</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ProtectedScreen>
  );
}

const s = StyleSheet.create({
  group: { marginBottom: 12 },
  label: { fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  multiline: { height: 110, textAlignVertical: "top" },

  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800" },

  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  preview: { width: "100%", height: 200, borderRadius: 12, backgroundColor: "#eee" },

  btn: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  btnPrimary: {},
  btnPrimaryText: { fontWeight: "800" },
  btnOutline: { borderWidth: 2, borderColor: PALETTE.primary, backgroundColor: "#fff" },
  btnOutlineText: { fontWeight: "800", color: PALETTE.primary },

  submit: { marginTop: 8, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  submitText: { fontWeight: "800" },
});
