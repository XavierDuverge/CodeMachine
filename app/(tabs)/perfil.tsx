import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../_layout';

const PALETTE = {
  bg: '#F1F8E9',
  bg2: '#c5f8ca',
  primary: '#4caf50',
  title: '#388e3c',
  onPrimary: '#ffffff',
  surface: '#ffffff',
  border: '#E3F2E1',
  text: '#1f2937',
  chevron: '#94a3b8',
};

export default function Perfil() {
  const { user, logout } = useAuth();

  const initials = useMemo(() => {
    if (!user) return '👤';
    const n = `${user.nombre ?? ''} ${user.apellido ?? ''}`.trim();
    const parts = n.split(' ').filter(Boolean);
    const ini = (parts[0]?.[0] ?? '').toUpperCase() + (parts[1]?.[0] ?? '').toUpperCase();
    return ini || '👤';
  }, [user]);

  // ======== SIN SESIÓN ========
  if (!user) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: PALETTE.bg }]}>
        <View style={s.centerWrap}>
          <Text style={[s.h1Center, { color: PALETTE.title }]}>Tu Cuenta</Text>

          <View style={[s.card, s.cardMax, { borderColor: PALETTE.border }]}>
            <Text style={s.paragraphCenter}>
              Inicia sesión o regístrate para acceder a reportes, normativas y otras
              funciones del sistema.
            </Text>

            {/* CTAs apilados, ancho completo */}
            <View style={{ width: '100%', marginTop: 16 }}>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity
                  style={[s.button, s.buttonPrimary, { backgroundColor: PALETTE.primary }]}
                >
                  <Text style={[s.buttonOutlineText, { color: PALETTE.primary }]}>
                    Iniciar sesión
                  </Text>
                </TouchableOpacity>
              </Link>

              <View style={s.dividerRow}>
                <View style={s.divider} />
                
                <View style={s.divider} />
              </View>

              <Link href="/(auth)/register" asChild>
                <TouchableOpacity
                  style={[
                    s.button,
                    s.buttonOutline,
                    { borderColor: PALETTE.primary, backgroundColor: PALETTE.bg2 },
                  ]}
                >
                  <Text style={[s.buttonOutlineText, { color: PALETTE.primary }]}>
                    Registrarse
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ======== CON SESIÓN ========
  return (
    <SafeAreaView style={[s.safe, { backgroundColor: PALETTE.bg }]}>
      <View style={[s.header, { backgroundColor: PALETTE.bg2 }]}>
        <View style={[s.avatar, { backgroundColor: PALETTE.primary }]}>
          <Text style={[s.avatarText, { color: PALETTE.onPrimary }]}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.h1, { color: PALETTE.title }]}>{user.nombre} {user.apellido}</Text>
          <Text style={s.subtitle}>{user.correo}</Text>
        </View>
      </View>

      <View style={[s.card, { borderColor: PALETTE.border }]}>
        <Row label="Correo" value={user.correo} />
        <Row label="Teléfono" value={user.telefono || '—'} />
        <Row label="Cédula" value={user.cedula || '—'} />
      </View>

      <View style={[s.card, { borderColor: PALETTE.border }]}>
        <Link href="/(protected)/normativas" asChild>
          <TouchableOpacity style={s.linkRow}>
            <Text style={s.linkText}>📜 Normativas Ambientales</Text>
            <Text style={s.chev}>›</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(protected)/reportar" asChild>
          <TouchableOpacity style={s.linkRow}>
            <Text style={s.linkText}>🚨 Reportar Daño Ambiental</Text>
            <Text style={s.chev}>›</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(protected)/mis-reportes" asChild>
          <TouchableOpacity style={s.linkRow}>
            <Text style={s.linkText}>🗂️ Mis Reportes</Text>
            <Text style={s.chev}>›</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(protected)/mapa-reportes" asChild>
          <TouchableOpacity style={s.linkRow}>
            <Text style={s.linkText}>🗺️ Mapa de Reportes</Text>
            <Text style={s.chev}>›</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(protected)/cambiar-password" asChild>
          <TouchableOpacity style={s.linkRow}>
            <Text style={s.linkText}>🔐 Cambiar Contraseña</Text>
            <Text style={s.chev}>›</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Link href="/(tabs)/perfil" asChild>
        <TouchableOpacity
          onPress={logout}
          style={[s.button, s.buttonOutline, { borderColor: PALETTE.primary, backgroundColor: PALETTE.bg2, marginTop: 16 }]}
        >
          <Text style={[s.buttonOutlineText, { color: PALETTE.primary }]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, padding: 20 },

  // --- CENTRADO sin sesión ---
  // CENTRADO sin sesión
  centerWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  h1Center: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  cardMax: { alignSelf: 'center', width: '92%', maxWidth: 520 },
  paragraphCenter: { color: '#4b5563', lineHeight: 20, textAlign: 'center' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  divider: { flex: 1, height: 1, backgroundColor: '#E5E7EB', borderRadius: 1 },
  dividerText: { color: '#6b7280', fontWeight: '700', marginHorizontal: 8 },

  
  
  // --- CON SESIÓN ---
  h1: { fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#4b5563', marginTop: 2 },

  header: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, marginBottom: 14 },
  avatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontWeight: '800', fontSize: 18 },

  // Tarjetas / filas
  card: { backgroundColor: PALETTE.surface, borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 14 },
  row: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: PALETTE.border },
  rowLabel: { fontSize: 12, color: '#2E7D32', fontWeight: '700', marginBottom: 2 },
  rowValue: { fontSize: 15, color: PALETTE.text },

  linkRow: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 8,
  },
  linkText: { fontSize: 15, color: PALETTE.text },
  chev: { fontSize: 24, lineHeight: 24, color: PALETTE.chevron },

  // Botones
  button: { width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonPrimary: {},
  buttonPrimaryText: { fontWeight: '700' },
  buttonOutline: { borderWidth: 2 },
  buttonOutlineText: { fontWeight: '700' },
});
