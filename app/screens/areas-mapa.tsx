// app/screens/areas-mapa.tsx
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker, UrlTile } from "react-native-maps";

const API_BASE = "https://adamix.net/medioambiente";

type AreaProtegida = {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  ubicacion: string;
  superficie: string;
  imagen: string;
  latitud: number;
  longitud: number;
};

// Centro aproximado de República Dominicana
const RD_REGION = {
  latitude: 18.7357,
  longitude: -70.1627,
  latitudeDelta: 4.5,
  longitudeDelta: 4.5,
};

// Paleta básica consistente con el resto de la app
const PALETTE = {
  bg: "#F1F8E9",
  title: "#388e3c",
  primary: "#4caf50",
  onPrimary: "#ffffff",
  border: "#E3F2E1",
  card: "#ffffff",
  text: "#1f2937",
};

export default function AreasMapaScreen() {
  const router = useRouter();

  // Si navegas desde el listado puedes enviar estos params para centrar un área:
  // router.push({ pathname: "/screens/areas-mapa", params: { focusId: id, lat, lng } });
  const { focusId, lat, lng, tipo, busqueda } = useLocalSearchParams<{
    focusId?: string;
    lat?: string;
    lng?: string;
    tipo?: string;
    busqueda?: string;
  }>();

  const focusLat = lat ? parseFloat(lat) : undefined;
  const focusLng = lng ? parseFloat(lng) : undefined;

  const [items, setItems] = useState<AreaProtegida[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<Record<string, any>>({}); // para .showCallout()

  const buildUrl = () => {
    const params: string[] = [];
    if (tipo) params.push(`tipo=${encodeURIComponent(String(tipo))}`);
    if (busqueda) params.push(`busqueda=${encodeURIComponent(String(busqueda))}`);
    const qs = params.length ? `?${params.join("&")}` : "";
    return `${API_BASE}/areas_protegidas${qs}`;
  };

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(buildUrl(), {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as AreaProtegida[];
      const valid = data.filter(
        (a) => Number.isFinite(a.latitud) && Number.isFinite(a.longitud)
      );
      setItems(valid);
    } catch (e) {
      setError("No se pudieron cargar las áreas protegidas.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, busqueda]); // si llegan params desde la lista, recarga

  const fitAll = () => {
    if (!mapRef.current || items.length === 0) return;
    const coords = items.map((a) => ({ latitude: a.latitud, longitude: a.longitud }));
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  };

  // Enfocar al iniciar si hay focusId o lat/lng
  useEffect(() => {
    if (!mapRef.current || !items.length) return;

    if (focusId && items.some((a) => a.id === focusId)) {
      setTimeout(() => {
        try {
          mapRef.current?.fitToSuppliedMarkers([focusId], {
            edgePadding: { top: 120, right: 120, bottom: 120, left: 120 },
            animated: true,
          });
          markerRefs.current[focusId]?.showCallout?.();
        } catch {}
      }, 300);
      return;
    }

    if (Number.isFinite(focusLat) && Number.isFinite(focusLng)) {
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: focusLat!,
          longitude: focusLng!,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        });
      }, 200);
      return;
    }

    if (items.length > 1) setTimeout(fitAll, 200);
  }, [items, focusId, focusLat, focusLng]);

  const goMyLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Autoriza el acceso a tu ubicación.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      mapRef.current?.animateToRegion({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } catch {
      Alert.alert("Error", "No se pudo obtener tu ubicación.");
    } finally {
      setLocating(false);
    }
  };

  const initialRegion = useMemo(() => {
    if (Number.isFinite(focusLat) && Number.isFinite(focusLng)) {
      return {
        latitude: focusLat!,
        longitude: focusLng!,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
    }
    if (items.length === 1) {
      return {
        latitude: items[0].latitud,
        longitude: items[0].longitud,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
    }
    return RD_REGION;
  }, [items, focusLat, focusLng]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: PALETTE.bg }]}>
      {/* Barra superior simple */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
          <Text style={[styles.topLink, { color: PALETTE.title }]}>← Explorer</Text>
        </TouchableOpacity>
        <Text style={[styles.h1, { color: PALETTE.title }]}>🗺️ Mapa de Áreas</Text>
        <TouchableOpacity onPress={fetchData}>
          <Text style={[styles.topLink, { color: PALETTE.title }]}>Recargar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapWrap}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Cargando mapa…</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</Text>
            <TouchableOpacity onPress={fetchData} style={[styles.btn, styles.btnOutline]}>
              <Text style={styles.btnOutlineText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFill}
              mapType="none" // ✅ usamos OpenStreetMap
              initialRegion={initialRegion}
              showsUserLocation
              showsMyLocationButton={false}
              toolbarEnabled={false}
            >
              {/* Capa base de OpenStreetMap */}
              <UrlTile
                urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
                zIndex={0}
              />

              {/* Marcadores de áreas */}
              {items.map((a) => (
                <Marker
                  key={a.id}
                  identifier={a.id}
                  ref={(ref) => {
                    if (ref) markerRefs.current[a.id] = ref;
                  }}
                  coordinate={{ latitude: a.latitud, longitude: a.longitud }}
                  pinColor="#2E7D32"
                  title={a.nombre}
                  description={a.tipo}
                >
                  <Callout
                    onPress={() =>
                      // Si creas una pantalla de detalle, navega allí:
                      // - Ej: app/screens/area/[id].tsx
                      // - Puedes pasar el objeto serializado para evitar otro fetch
                      router.push({
                        pathname: "/screens/area/[id]",
                        params: { id: a.id, item: JSON.stringify(a) },
                      })
                    }
                  >
                    <View style={{ maxWidth: 240 }}>
                      <Text style={{ fontWeight: "800", marginBottom: 2 }}>{a.nombre}</Text>
                      <Text style={{ color: "#6b7280" }}>{a.tipo}</Text>
                      <Text numberOfLines={3} style={{ marginTop: 4 }}>
                        {a.descripcion}
                      </Text>
                      <Text style={{ marginTop: 6, color: "#2563eb", fontWeight: "700" }}>
                        Ver detalle →
                      </Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>

            {/* Controles flotantes */}
            <View style={styles.fabContainer}>
              <TouchableOpacity style={[styles.fab, { backgroundColor: PALETTE.card }]} onPress={fitAll}>
                <Text style={styles.fabText}>↙︎↗︎</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fab, { backgroundColor: PALETTE.primary }]}
                onPress={goMyLocation}
                disabled={locating}
              >
                {locating ? (
                  <ActivityIndicator color={PALETTE.onPrimary} />
                ) : (
                  <Text style={[styles.fabText, { color: PALETTE.onPrimary }]}>📍</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
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

  mapWrap: { flex: 1, marginTop: 6, borderRadius: 16, overflow: "hidden" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 8, fontWeight: "700", color: PALETTE.title },

  fabContainer: {
    position: "absolute",
    right: 12,
    bottom: 12,
    gap: 10,
  } as any,
  fab: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  fabText: { fontWeight: "900", fontSize: 16, color: "#111827" },

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
