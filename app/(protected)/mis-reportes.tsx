import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
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

type Reporte = {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  foto: string;     // puede ser URL o base64
  latitud: number;
  longitud: number;
  estado: "pendiente" | "en_revision" | "resuelto" | string;
  comentario_ministerio?: string;
  fecha: string;    // ISO
};

export default function MisReportes() {
  const router = useRouter();
  const { token } = useAuth();

  const [items, setItems] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reportes`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // ✅
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Respuesta inesperada");
      setItems(data as Reporte[]);
    } catch (e) {
      setError("No se pudieron cargar tus reportes.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const goDetail = (item: Reporte) => {
    router.push({
      pathname: "/reporte/[id]",        // SIN grupo "(protected)" en la ruta
      params: { id: item.id, item: JSON.stringify(item) },
    });
  };

  const renderItem = ({ item }: { item: Reporte }) => (
    <TouchableOpacity onPress={() => goDetail(item)} activeOpacity={0.8}>
      <View style={[s.card, { borderColor: PALETTE.border }]}>
        <View style={s.row}>
          <Image source={{ uri: toImageSrc(item.foto) }} style={s.thumb} />
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={s.title}>{item.titulo}</Text>
            <Text style={s.meta}>{formatDate(item.fecha)} · {item.codigo}</Text>
            <Text numberOfLines={2} style={s.desc}>{item.descripcion}</Text>
            <View style={s.tagsRow}>
              <EstadoChip estado={item.estado} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ProtectedScreen title="🗂️ Mis Reportes">
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator />
          <Text style={s.loadingText}>Cargando…</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</Text>
          <TouchableOpacity onPress={fetchData} style={[s.btn, s.btnOutline]}>
            <Text style={s.btnOutlineText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={s.center}>
          <Text style={{ color: PALETTE.text }}>Aún no tienes reportes.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 4 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={PALETTE.primary}
            />
          }
        />
      )}
    </ProtectedScreen>
  );
}

function EstadoChip({ estado }: { estado: string }) {
  const map = useMemo(() => ({
    pendiente: { bg: "#FEF3C7", fg: "#92400E", label: "Pendiente" },
    en_revision: { bg: "#DBEAFE", fg: "#1E40AF", label: "En revisión" },
    resuelto: { bg: "#DCFCE7", fg: "#065F46", label: "Resuelto" },
  }), []);

  const sdata = map[estado as keyof typeof map] ?? { bg: "#F3F4F6", fg: "#374151", label: estado };
  return (
    <View style={[s.chip, { backgroundColor: sdata.bg }]}>
      <Text style={{ color: sdata.fg, fontWeight: "700" }}>{sdata.label}</Text>
    </View>
  );
}

function toImageSrc(f: string) {
  if (!f) return "https://via.placeholder.com/200x120.png?text=Sin+foto";
  // Si ya es URL, úsala
  if (/^https?:\/\//i.test(f)) return f;
  // Si parece base64 (sin prefijo), añade el data URI
  if (/^[A-Za-z0-9+/=]+$/.test(f)) return `data:image/jpeg;base64,${f}`;
  // Último recurso: devuélvelo tal cual (por si ya trae data:)
  return f;
}

function formatDate(iso: string | undefined) {
  if (!iso) return "—";
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) return iso;
  return dt.toLocaleString("es-DO", {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

const s = StyleSheet.create({
  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  row: { flexDirection: "row", gap: 10 },
  thumb: { width: 96, height: 96, borderRadius: 12, backgroundColor: "#eee", marginRight: 10 },
  title: { fontSize: 16, fontWeight: "800", color: PALETTE.text },
  meta: { color: "#6b7280", marginBottom: 4 },
  desc: { color: PALETTE.text },
  tagsRow: { flexDirection: "row", gap: 8, marginTop: 8 },

  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },

  center: { alignItems: "center", justifyContent: "center", paddingVertical: 24 },
  loadingText: { marginTop: 8, fontWeight: "700", color: PALETTE.title },

  btn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutline: { borderWidth: 2, borderColor: PALETTE.primary, backgroundColor: "#fff" },
  btnOutlineText: { fontWeight: "800", color: PALETTE.primary },
});
