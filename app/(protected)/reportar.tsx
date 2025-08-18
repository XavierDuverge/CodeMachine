import React from "react";
import { Text } from "react-native";
import ProtectedScreen from "./_ProtectedScreen";

export default function Reportar() {
  return (
    <ProtectedScreen title="🚨 Reportar Daño Ambiental">
      <Text>Formulario de reporte (título, descripción, foto, lat/lng) — próximamente.</Text>
    </ProtectedScreen>
  );
}
