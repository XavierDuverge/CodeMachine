// app/screens/videos.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe"; // nativo (Android/iOS)

const API_BASE = "https://adamix.net/medioambiente";
// Usa proxy SOLO en web para evitar CORS. En móvil llamamos directo.
const USE_ALL_ORIGINS = Platform.OS === "web";

type Categoria = "reciclaje" | "conservacion" | "cambio_climatico" | "biodiversidad" | "todos";

interface VideoItem {
  id: string;
  titulo: string;
  descripcion: string;
  url: string;
  thumbnail: string;
  categoria: Categoria | string;
  duracion: string;
  fecha_creacion?: string;
}

const CATEGORIAS = [
  { label: "Todos", value: "todos" as Categoria },
  { label: "Reciclaje", value: "reciclaje" as Categoria },
  { label: "Conservación", value: "conservacion" as Categoria },
  { label: "Cambio Climático", value: "cambio_climatico" as Categoria },
  { label: "Biodiversidad", value: "biodiversidad" as Categoria },
];

// Extrae ID de YouTube (watch/share/embed/shorts)
function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.split("/")[1] || null;
    const v = u.searchParams.get("v");
    if (v) return v;
    const parts = u.pathname.split("/");
    const idx = parts.findIndex((p) => ["embed", "shorts"].includes(p));
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    return null;
  } catch {
    return null;
  }
}

/** Player unificado:
 * - Web: iframe nativo (mejor proporción, nítido)
 * - Nativo: YoutubePlayer (WebView interno)
 */
function VideoPlayer({ videoId }: { videoId: string }) {
  if (Platform.OS === "web") {
    return (
      <View style={{ width: "100%", aspectRatio: 16 / 9, borderRadius: 8, overflow: "hidden" }}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=1`}
          title="YouTube video player"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ display: "block", border: "0" }}
        />
      </View>
    );
  }

  return (
    <YoutubePlayer
      height={220}
      width={"100%"}
      play
      videoId={videoId}
      initialPlayerParams={{ modestbranding: true, rel: false, controls: 1 }}
      // Nota: estas props aplican al WebView nativo (no al iframe web)
      webViewProps={{
        allowsInlineMediaPlayback: true,
        originWhitelist: ["*"],
        onShouldStartLoadWithRequest: (req: { url: string }) => {
          const url = req.url || "";
          const allowed =
            url.startsWith("https://www.youtube.com/embed/") ||
            url.startsWith("https://www.youtube-nocookie.com/embed/") ||
            url.startsWith("about:blank") ||
            url.startsWith("data:");
          return allowed;
        },
      }}
    />
  );
}

export default function VideosScreen() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [categoria, setCategoria] = useState<Categoria>("todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const buildUrl = () => {
    const base = `${API_BASE}/videos`;
    const url = categoria !== "todos" ? `${base}?categoria=${encodeURIComponent(categoria)}` : base;
    return USE_ALL_ORIGINS ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` : url;
  };

  const fetchVideos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(buildUrl(), { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: VideoItem[] = await res.json();

      const normalized = data.map((v) => {
        const yt = getYouTubeId(v.url);
        return {
          ...v,
          thumbnail:
            v.thumbnail?.startsWith("http")
              ? v.thumbnail
              : yt
              ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg`
              : "https://via.placeholder.com/640x360.png?text=Video",
        };
      });

      setVideos(normalized);
    } catch (e: any) {
      setVideos([]);
      setError(`Error cargando la API: ${e?.message ?? e}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria]);

  // Búsqueda local
  const list = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return videos;
    return videos.filter(
      (v) => v.titulo.toLowerCase().includes(term) || v.descripcion.toLowerCase().includes(term)
    );
  }, [videos, search]);

  const renderItem = ({ item, index }: { item: VideoItem; index: number }) => {
    const ytId = getYouTubeId(item.url);
    const keyForActive = `${item.id}-${index}`; // la API puede repetir id
    const isActive = activeId === keyForActive;

    return (
      <View style={styles.card}>
        {isActive && ytId ? (
          <VideoPlayer videoId={ytId} />
        ) : (
          <TouchableOpacity onPress={() => setActiveId(keyForActive)} activeOpacity={0.9}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
            <View style={styles.playOverlay}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </TouchableOpacity>
        )}

        <Text style={styles.name} numberOfLines={2}>{item.titulo}</Text>
        <Text style={styles.description} numberOfLines={3}>{item.descripcion}</Text>

        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>{String(item.categoria)}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <Text style={styles.duration}>{item.duracion || "—"}</Text>
        </View>

        {isActive && (
          <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveId(null)}>
            <Text style={styles.closeTxt}>Cerrar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Igual que tu Explore/Areas: botón atrás al tab Explore */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(tabs)/explore")}>
        <Text style={styles.backButtonText}>← Explorer</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Videos Educativos</Text>

      {/* Chips categoría */}
      <View style={styles.tipoContainer}>
        {CATEGORIAS.map((c) => (
          <TouchableOpacity
            key={c.value}
            style={[styles.tipoButton, categoria === c.value && styles.tipoButtonActive]}
            onPress={() => {
              setActiveId(null);
              setCategoria(c.value);
            }}
          >
            <Text style={[styles.tipoText, categoria === c.value && styles.tipoTextActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buscador local */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por título o descripción..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text>{error}</Text>
          <TouchableOpacity style={styles.searchButton} onPress={fetchVideos}>
            <Text style={styles.searchButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" color="#1B5E20" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item, i) => `${item.id}-${i}`} // ids repetidos
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>No se encontraron videos.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 16, color: "#1B5E20", fontWeight: "bold" },

  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },

  tipoContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  tipoButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tipoButtonActive: { backgroundColor: "#1B5E20" },
  tipoText: { color: "#374151", fontSize: 12 },
  tipoTextActive: { color: "white", fontWeight: "bold" },

  searchContainer: { flexDirection: "row", marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#1B5E20",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: { color: "white", fontWeight: "bold" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
    overflow: "hidden",
  },
  // Thumbnail con proporción correcta también en web
  thumb: { width: "100%", aspectRatio: 16 / 9, borderRadius: 8, backgroundColor: "#ccc" },

  playOverlay: {
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  playIcon: { color: "white", fontSize: 56, fontWeight: "900", lineHeight: 56 },

  name: { fontSize: 16, fontWeight: "bold", color: "#111827", marginTop: 10 },
  description: { fontSize: 13, color: "#374151", marginTop: 4 },

  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  badge: { backgroundColor: "#1B5E20", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeTxt: { color: "#fff", fontSize: 12, textTransform: "capitalize", fontWeight: "600" },
  duration: { fontSize: 12, color: "#4B5563", marginLeft: 8 },

  closeBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  closeTxt: { fontWeight: "bold", color: "#111827" },

  center: { alignItems: "center", justifyContent: "center", padding: 20 },
});
