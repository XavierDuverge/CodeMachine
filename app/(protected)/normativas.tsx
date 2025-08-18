// app/(protected)/normativas.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Linking,
    RefreshControl,
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
  chip: "#c5f8ca",
};

const API_BASE = "https://adamix.net/medioambiente";

type Normativa = {
  id: string;
  titulo: string;
  tipo: string;
  numero: string;
  fecha_publicacion: string; // YYYY-MM-DD
  descripcion: string;
  url_documento: string;
};

const TIPOS = ["", "Ley", "Decreto", "Resolución", "Reglamento"]; // "" = todos

export default function Normativas() {
  const { token } = useAuth();
  const [items, setItems] = useState<Normativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tipo, setTipo] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");

  const searchRef = useRef<TextInput>(null);

  const queryString = useMemo(() => {
    const params: string[] = [];
    if (tipo) params.push(`tipo=${encodeURIComponent(tipo)}`);
    if (busqueda.trim()) params.push(`busqueda=${encodeURIComponent(busqueda.trim())}`);
    return params.length ? `?${params.join("&")}` : "";
  }, [tipo, busqueda]);

  const fetchData = useCallback(async () => {
    if (!token) return; // ProtectedScreen evita esto, pero por si acaso
    setError(null);
    setLoading(true);
    try {
      const url = `${API_BASE}/normativas${queryString}`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // ✅ Requerido
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Respuesta inesperada");
      setItems(data as Normativa[]);
    } catch (e) {
      setError("No se pudieron cargar las normativas.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, queryString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const applyFilters = () => fetchData();
  const clearFilters = () => {
    setTipo("");
    setBusqueda("");
    setTimeout(() => fetchData(), 0);
  };

  const renderItem = ({ item }: { item: Normativa }) => (
    <View style={[s.card, { borderColor: PALETTE.border }]}>
      <View style={s.cardHeader}>
        <Text style={s.title}>{item.titulo}</Text>
        {item.tipo ? <Text style={s.badge}>{item.tipo}</Text> : null}
      </View>

      <Text style={s.meta}>
        {item.numero ? `Núm. ${item.numero}` : "—"} ·{" "}
        {formatDate(item.fecha_publicacion)}
      </Text>

      {item.descripcion ? (
        <Text style={s.desc} numberOfLines={3}>
          {item.descripcion}
        </Text>
      ) : null}

      <View style={s.actionsRow}>
        {item.url_documento ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(item.url_documento)}
            style={[s.btn, s.btnOutline]}
          >
            <Text style={[s.btnOutlineText]}>Abrir documento</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <ProtectedScreen title="📜 Normativas Ambientales">
      {/* Filtros */}
      <View style={s.filters}>
        <View style={s.searchRow}>
          <TextInput
            ref={searchRef}
            style={[s.input, { borderColor: PALETTE.title }]}
            placeholder="Buscar por título, número o descripción…"
            value={busqueda}
            onChangeText={setBusqueda}
            returnKeyType="search"
            onSubmitEditing={applyFilters}
          />
        </View>

        <View style={s.tipoRow}>
          {TIPOS.map((t) => {
            const active = t === tipo;
            return (
              <TouchableOpacity
                key={t || "todos"}
                onPress={() => setTipo((prev) => (prev === t ? "" : t))}
                style={[
                  s.chip,
                  { backgroundColor: active ? PALETTE.primary : PALETTE.chip },
                ]}
              >
                <Text style={{ color: active ? PALETTE.onPrimary : "#1f2937", fontWeight: "700" }}>
                  {t || "Todos"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={s.filterButtons}>
          <TouchableOpacity
            onPress={applyFilters}
            style={[s.btn, s.btnPrimary, { backgroundColor: PALETTE.primary }]}
          >
            <Text style={[s.btnPrimaryText, { color: PALETTE.onPrimary }]}>Aplicar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearFilters} style={[s.btn, s.btnOutline]}>
            <Text style={s.btnOutlineText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator />
          <Text style={[s.loadingText, { color: PALETTE.title }]}>Cargando…</Text>
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
          <Text style={{ color: PALETTE.text }}>Sin resultados con los filtros actuales.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 4 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PALETTE.primary} />
          }
        />
      )}
    </ProtectedScreen>
  );
}

function formatDate(s: string | undefined) {
  if (!s) return "—";
  // s = "YYYY-MM-DD"
  const [y, m, d] = s.split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return s;
  try {
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return s;
  }
}

const s = StyleSheet.create({
  filters: { marginBottom: 12 },
  searchRow: { marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  tipoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  } as any, // RN <0.73 no soporta gap; si da problema, reemplaza por márgenes
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  filterButtons: { flexDirection: "row", gap: 8 } as any,

  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  title: { fontSize: 16, fontWeight: "800", color: PALETTE.text, flex: 1, paddingRight: 8 },
  badge: {
    backgroundColor: "#E8F5E9",
    color: "#1B5E20",
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  meta: { color: "#4b5563", marginBottom: 6 },
  desc: { color: PALETTE.text },
  actionsRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },

  btn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {},
  btnPrimaryText: { fontWeight: "800" },
  btnOutline: { borderWidth: 2, borderColor: PALETTE.primary, backgroundColor: "#fff" },
  btnOutlineText: { fontWeight: "800", color: PALETTE.primary },

  center: { alignItems: "center", justifyContent: "center", paddingVertical: 24 },
  loadingText: { marginTop: 8, fontWeight: "700" },
});
