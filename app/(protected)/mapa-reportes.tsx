// app/(protected)/mapa-reportes.tsx
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker, UrlTile } from "react-native-maps";

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

// Centro aproximado de RD
const RD_REGION = {
  latitude: 18.7357,
  longitude: -70.1627,
  latitudeDelta: 4.5,
  longitudeDelta: 4.5,
};

type Reporte = {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  foto: string;
  latitud: number;
  longitud: number;
  estado: "pendiente" | "en_revision" | "resuelto" | string;
  comentario_ministerio?: string;
  fecha: string; // ISO
};

export default function MapaReportes() {
  const { token } = useAuth();
  const router = useRouter();

  // 👇 parámetros opcionales para centrar/abrir un reporte
  const { focusId, lat, lng } = useLocalSearchParams<{ focusId?: string; lat?: string; lng?: string }>();
  const focusLat = lat ? parseFloat(lat) : undefined;
  const focusLng = lng ? parseFloat(lng) : undefined;

  const [items, setItems] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<Record<string, any>>({}); // TS simple para .showCallout()

  // Cargar reportes del usuario
  const fetchData = async () => {
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reportes`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Reporte[];
      const valid = data.filter(
        (r) => Number.isFinite(r.latitud) && Number.isFinite(r.longitud)
      );
      setItems(valid);
    } catch (e) {
      setError("No se pudieron cargar los reportes en el mapa.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Ajustar cámara a todos los marcadores
  const fitAll = () => {
    if (!mapRef.current || items.length === 0) return;
    const coords = items.map((r) => ({ latitude: r.latitud, longitude: r.longitud }));
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  };

  // Cuando tenemos items y focusId/lat/lng, centramos y abrimos callout
  useEffect(() => {
    if (!mapRef.current || !items.length) return;

    if (focusId && items.some((r) => r.id === focusId)) {
      // Si vino id, ajusta a ese marcador y abre callout
      setTimeout(() => {
        try {
          // Ajusta a ese marker por identifier
          mapRef.current?.fitToSuppliedMarkers([focusId], {
            edgePadding: { top: 120, right: 120, bottom: 120, left: 120 },
            animated: true,
          });
          // Intenta abrir callout si tenemos ref
          markerRefs.current[focusId]?.showCallout?.();
        } catch {}
      }, 300);
      return;
    }

    // Si no hay id pero sí lat/lng, centra allí
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

    // Si hay varios puntos y no nos pasaron foco, encuadra todos
    if (items.length > 1) {
      setTimeout(fitAll, 200);
    }
  }, [items, focusId, focusLat, focusLng]);

  // Ir a mi ubicación
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

  const markerColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "#f59e0b";
      case "en_revision":
        return "#3b82f6";
      case "resuelto":
        return "#10b981";
      default:
        return "#4b5563";
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
    <ProtectedScreen title="🗺️ Mapa de Reportes">
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
              mapType="none" // ✅ OSM
              initialRegion={initialRegion}
              showsUserLocation
              showsMyLocationButton={false}
              toolbarEnabled={false}
            >
              {/* Capa base OpenStreetMap */}
              <UrlTile
                urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
                zIndex={0}
              />

              {/* Marcadores */}
              {items.map((r) => (
                <Marker
                  key={r.id}
                  identifier={r.id} // para fitToSuppliedMarkers
                  ref={(ref) => {
                    if (ref) markerRefs.current[r.id] = ref;
                  }}
                  coordinate={{ latitude: r.latitud, longitude: r.longitud }}
                  pinColor={markerColor(r.estado)}
                >
                  <Callout
                    onPress={() =>
                      router.push({
                        pathname: "/reporte/[id]",
                        params: { id: r.id, item: JSON.stringify(r) },
                      })
                    }
                  >
                    <View style={{ maxWidth: 220 }}>
                      <Text style={{ fontWeight: "800", marginBottom: 2 }}>{r.titulo}</Text>
                      <Text style={{ color: "#6b7280" }}>{r.codigo}</Text>
                      <Text numberOfLines={2} style={{ marginTop: 4 }}>
                        {r.descripcion}
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
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  mapWrap: { flex: 1, borderRadius: 16, overflow: "hidden" },
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
