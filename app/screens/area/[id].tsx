// app/screens/area/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const API_BASE = "https://adamix.net/medioambiente";

type AreaProtegida = {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  ubicacion: string;
  superficie: string;
  imagen: string;   // url o base64
  latitud: number;
  longitud: number;
};

const PALETTE = {
  bg: "#F1F8E9",
  title: "#388e3c",
  primary: "#4caf50",
  onPrimary: "#ffffff",
  border: "#E3F2E1",
  card: "#ffffff",
  text: "#1f2937",
};

export default function AreaDetail() {
  const { id, item } = useLocalSearchParams<{ id: string; item?: string }>();
  const router = useRouter();

  const [area, setArea] = useState<AreaProtegida | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga: usa item serializado si llegó; si no, pide el listado y busca por id
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setLoading(true);

        if (item) {
          const parsed = JSON.parse(item) as AreaProtegida;
          setArea(parsed);
          return;
        }

        const res = await fetch(`${API_BASE}/areas_protegidas`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as AreaProtegida[];
        const found = data.find((a) => a.id === id);
        if (!found) throw new Error("No se encontró el área.");
        setArea(found);
      } catch (e: any) {
        setError(e?.message ?? "No se pudo cargar el área.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, item]);

  const imgSrc = useMemo(() => toImageSrc(area?.imagen), [area?.imagen]);

  const openExternalMaps = () => {
    if (!area) return;
    const label = encodeURIComponent(area.nombre || "Área protegida");
    const { latitud, longitud } = area;
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?ll=${latitud},${longitud}&q=${label}`
        : `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`;
    Linking.openURL(url);
  };

  const openInAppMap = () => {
    if (!area) return;
    router.push({
      pathname: "./screens/areas-mapa",
      params: { focusId: area.id, lat: String(area.latitud), lng: String(area.longitud) },
    });
  };

  if (loading) {
    return (
      <View style={[styles.safe, { backgroundColor: PALETTE.bg }]}>
        <Topbar onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Cargando…</Text>
        </View>
      </View>
    );
  }

  if (error || !area) {
    return (
      <View style={[styles.safe, { backgroundColor: PALETTE.bg }]}>
        <Topbar onBack={() => router.back()} />
        <View style={styles.center}>
          <Text style={{ color: "#b91c1c", marginBottom: 8 }}>{error ?? "Sin datos"}</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.btn, styles.btnOutline]}>
            <Text style={styles.btnOutlineText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.safe, { backgroundColor: PALETTE.bg }]}>
      <Topbar onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <View style={[styles.card, { borderColor: PALETTE.border }]}>
          <Text style={styles.title}>{area.nombre}</Text>
          <Text style={styles.type}>{area.tipo}</Text>

          {imgSrc ? <Image source={{ uri: imgSrc }} style={styles.cover} /> : null}

          <Text style={[styles.sectionTitle]}>Descripción</Text>
          <Text style={styles.text}>{area.descripcion || "—"}</Text>

          <Text style={[styles.sectionTitle]}>Ubicación</Text>
          <Text style={styles.text}>{area.ubicacion || "—"}</Text>

          <Text style={[styles.sectionTitle]}>Superficie</Text>
          <Text style={styles.text}>{area.superficie || "—"}</Text>

          <Text style={[styles.sectionTitle]}>Coordenadas</Text>
          <Text style={styles.text}>
            Lat: {area.latitud} · Lng: {area.longitud}
          </Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <TouchableOpacity onPress={openInAppMap} style={[styles.btn, styles.btnPrimary]}>
              <Text style={styles.btnPrimaryText}>Ver en mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openExternalMaps} style={[styles.btn, styles.btnOutline]}>
              <Text style={styles.btnOutlineText}>Abrir en Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Topbar({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.topbar}>
      <TouchableOpacity onPress={onBack}>
        <Text style={[styles.topLink, { color: PALETTE.title }]}>← Atrás</Text>
      </TouchableOpacity>
      <Text style={[styles.h1, { color: PALETTE.title }]}>Área Protegida</Text>
      <View style={{ width: 64 }} />
    </View>
  );
}

function toImageSrc(s?: string | null) {
  if (!s) return undefined as any;
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[A-Za-z0-9+/=]+$/.test(s)) return `data:image/jpeg;base64,${s}`; // base64 "puro"
  return s; // por si ya trae data:
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topbar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topLink: { fontWeight: "700" },
  h1: { fontSize: 18, fontWeight: "800" },

  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginTop: 6,
  },

  title: { fontSize: 20, fontWeight: "800", color: PALETTE.text },
  type: { color: "#6b7280", marginTop: 2, marginBottom: 8 },

  cover: { width: "100%", height: 220, borderRadius: 12, backgroundColor: "#eee", marginVertical: 6 },

  sectionTitle: { marginTop: 12, fontSize: 15, fontWeight: "800", color: "#1f2937" },
  text: { color: PALETTE.text, marginTop: 4 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  loadingText: { marginTop: 8, fontWeight: "700", color: PALETTE.title },

  btn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: PALETTE.primary },
  btnPrimaryText: { fontWeight: "800", color: PALETTE.onPrimary },
  btnOutline: { borderWidth: 2, borderColor: PALETTE.primary, backgroundColor: "#fff" },
  btnOutlineText: { fontWeight: "800", color: PALETTE.primary },
});
