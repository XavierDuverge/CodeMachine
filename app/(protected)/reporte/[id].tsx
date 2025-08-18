// app/(protected)/reporte/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../../_layout";
import ProtectedScreen from "../_ProtectedScreen";

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
    foto: string; // puede ser url o base64
    latitud: number;
    longitud: number;
    estado: string;
    comentario_ministerio?: string;
    fecha: string; // ISO
};

export default function ReporteDetail() {
    const { id, item } = useLocalSearchParams<{ id: string; item?: string }>();
    const router = useRouter();
    const { token } = useAuth();

    const [reporte, setReporte] = useState<Reporte | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Intenta usar el item serializado si vino desde la lista.
    useEffect(() => {
        (async () => {
            try {
                setError(null);
                setLoading(true);

                if (item) {
                    const parsed = JSON.parse(item as string) as Reporte;
                    setReporte(parsed);
                    return;
                }

                // Fallback: si entraron directo, buscamos por id en el listado del usuario.
                const res = await fetch(`${API_BASE}/reportes`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = (await res.json()) as Reporte[];
                const found = data.find((r) => r.id === id);
                if (!found) throw new Error("No se encontró el reporte.");
                setReporte(found);
            } catch (e: any) {
                setError(e?.message ?? "No se pudo cargar el reporte.");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, item, token]);

    const imgSrc = useMemo(() => toImageSrc(reporte?.foto), [reporte?.foto]);

    // Reemplaza openMaps por esta función:
    const goToInAppMap = () => {
        if (!reporte) return;
        router.push({
            pathname: "/mapa-reportes",
            params: {
                focusId: reporte.id,
                lat: String(reporte.latitud),
                lng: String(reporte.longitud),
            },
        });
    };


    if (loading) {
        return (
            <ProtectedScreen title="📝 Detalle del Reporte">
                <View style={styles.center}>
                    <ActivityIndicator />
                    <Text style={styles.loadingText}>Cargando…</Text>
                </View>
            </ProtectedScreen>
        );
    }

    if (error || !reporte) {
        return (
            <ProtectedScreen title="📝 Detalle del Reporte">
                <View style={styles.center}>
                    <Text style={{ color: "#b91c1c", marginBottom: 8 }}>{error ?? "Sin datos"}</Text>
                    <TouchableOpacity onPress={() => router.replace("/(protected)/mis-reportes")} style={[styles.btn, styles.btnOutline]}>
                        <Text style={styles.btnOutlineText}>Volver a Mis Reportes</Text>
                    </TouchableOpacity>
                </View>
            </ProtectedScreen>
        );
    }

    return (
        <ProtectedScreen title="📝 Detalle del Reporte">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={[styles.card, { borderColor: PALETTE.border }]}>
                    <Text style={styles.title}>{reporte.titulo}</Text>
                    <Text style={styles.meta}>
                        {formatDate(reporte.fecha)} · {reporte.codigo}
                    </Text>

                    {imgSrc ? <Image source={{ uri: imgSrc }} style={styles.cover} /> : null}

                    <View style={{ marginTop: 12 }}>
                        <EstadoChip estado={reporte.estado} />
                    </View>

                    <Text style={[styles.section, styles.sectionTitle]}>Descripción</Text>
                    <Text style={styles.desc}>{reporte.descripcion || "—"}</Text>

                    <Text style={[styles.section, styles.sectionTitle]}>Ubicación</Text>
                    <Text style={styles.desc}>
                        Lat: {reporte.latitud} · Lng: {reporte.longitud}
                    </Text>
                    <TouchableOpacity onPress={goToInAppMap} style={[styles.btn, styles.btnOutline, { marginTop: 8 }]}>
                        <Text style={styles.btnOutlineText}>Ver en mapa</Text>
                    </TouchableOpacity>

                    <Text style={[styles.section, styles.sectionTitle]}>Comentario del Ministerio</Text>
                    <Text style={styles.desc}>{reporte.comentario_ministerio || "Sin comentarios aún."}</Text>
                </View>
            </ScrollView>
        </ProtectedScreen>
    );
}

function EstadoChip({ estado }: { estado: string }) {
    const map = useMemo(
        () => ({
            pendiente: { bg: "#FEF3C7", fg: "#92400E", label: "Pendiente" },
            en_revision: { bg: "#DBEAFE", fg: "#1E40AF", label: "En revisión" },
            resuelto: { bg: "#DCFCE7", fg: "#065F46", label: "Resuelto" },
        }),
        []
    );
    const sdata = (map as any)[estado] ?? { bg: "#F3F4F6", fg: "#374151", label: estado || "—" };
    return (
        <View style={[styles.chip, { backgroundColor: sdata.bg }]}>
            <Text style={{ color: sdata.fg, fontWeight: "700" }}>{sdata.label}</Text>
        </View>
    );
}

function toImageSrc(f?: string | null) {
    if (!f) return undefined as any;
    if (/^https?:\/\//i.test(f)) return f;
    if (/^[A-Za-z0-9+/=]+$/.test(f)) return `data:image/jpeg;base64,${f}`;
    return f; // por si ya trae prefijo data:
}

function formatDate(iso?: string) {
    if (!iso) return "—";
    const dt = new Date(iso);
    if (isNaN(dt.getTime())) return iso;
    return dt.toLocaleString("es-DO", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: PALETTE.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
    },
    title: { fontSize: 18, fontWeight: "800", color: PALETTE.text },
    meta: { color: "#6b7280", marginTop: 2, marginBottom: 8 },
    cover: { width: "100%", height: 220, borderRadius: 12, backgroundColor: "#eee", marginVertical: 6 },

    section: { marginTop: 12 },
    sectionTitle: { fontSize: 15, fontWeight: "800", color: "#1f2937" },
    desc: { color: PALETTE.text, marginTop: 4 },

    chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, alignSelf: "flex-start" },

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
