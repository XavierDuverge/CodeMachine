import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import type { LocationObjectCoords } from "expo-location";

export default function ReportDamageScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [errors, setErrors] = useState({
    title: false,
    description: false,
    photo: false,
    location: false,
  });

  const [focusedInput, setFocusedInput] = useState<"title" | "description" | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se necesita permiso para acceder a la galería.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setErrors((prev) => ({ ...prev, photo: false }));
    }
  };

  const getLocation = async () => {
    setLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Se necesita permiso para acceder a la ubicación."
      );
      setLoadingLocation(false);
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    setLoadingLocation(false);
    setErrors((prev) => ({ ...prev, location: false }));
  };

  const handleSubmit = () => {
    let newErrors = {
      title: title.trim() === "",
      description: description.trim() === "",
      photo: photoUri === null,
      location: location === null,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    Alert.alert("¡Enviado!", "Gracias por ayudar al planeta 🌍");
    setTitle("");
    setDescription("");
    setPhotoUri(null);
    setLocation(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Reportar Daño Ambiental</Text>

        {/* Input Título */}
        <TextInput
          style={[
            styles.input,
            errors.title
              ? { borderColor: "#b71c1c" }
              : focusedInput === "title"
              ? { borderColor: "#4caf50" }
              : { borderColor: "#ccc" },
          ]}
          placeholder="Título"
          placeholderTextColor="#999"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (errors.title) setErrors((prev) => ({ ...prev, title: false }));
          }}
          onFocus={() => setFocusedInput("title")}
          onBlur={() => setFocusedInput(null)}
          underlineColorAndroid="transparent"
        />

        {/* Input Descripción */}
        <TextInput
          style={[
            styles.input,
            { height: 120, textAlignVertical: "top" },
            errors.description
              ? { borderColor: "#b71c1c" }
              : focusedInput === "description"
              ? { borderColor: "#4caf50" }
              : { borderColor: "#ccc" },
          ]}
          placeholder="Descripción"
          placeholderTextColor="#999"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (errors.description)
              setErrors((prev) => ({ ...prev, description: false }));
          }}
          multiline
          onFocus={() => setFocusedInput("description")}
          onBlur={() => setFocusedInput(null)}
          underlineColorAndroid="transparent"
        />

        {/* Botón Foto */}
        <TouchableOpacity
          style={[
            styles.button,
            errors.photo ? { backgroundColor: "#b71c1c" } : photoUri ? styles.buttonSelected : {},
            { marginBottom: 15 },
          ]}
          onPress={pickImage}
        >
          <Text style={styles.buttonText}>
            {photoUri ? "Cambiar Foto" : "Seleccionar Foto"}
          </Text>
        </TouchableOpacity>

        {photoUri && (
          <Image
            source={{ uri: photoUri }}
            style={{ width: "100%", height: 180, borderRadius: 12, marginBottom: 20 }}
          />
        )}

        {/* Botón Ubicación */}
        <TouchableOpacity
          style={[
            styles.button,
            errors.location ? { backgroundColor: "#b71c1c" } : {},
            loadingLocation ? { backgroundColor: "#a5d6a7" } : {},
            location && !loadingLocation ? styles.buttonSelected : {},
            { marginBottom: 25 },
          ]}
          onPress={getLocation}
          disabled={loadingLocation}
        >
          <Text style={styles.buttonText}>
            {loadingLocation
              ? "Obteniendo ubicación..."
              : location
              ? "Ubicación Obtenida ✅"
              : "Obtener Ubicación"}
          </Text>
        </TouchableOpacity>

        {location && (
          <Text style={styles.locationText}>
            Lat: {location.latitude.toFixed(5)} - Lon: {location.longitude.toFixed(5)}
          </Text>
        )}

        {/* Botón Enviar */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Enviar Reporte</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 30,
    textAlign: "center",
    color: "#1b5e20",
  },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    color: "#333",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#2e7d32",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  buttonSelected: {
    backgroundColor: "#2e7d32",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  locationText: {
    textAlign: "center",
    marginBottom: 20,
    color: "#2e7d32",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#1b5e20",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#174d13",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 8,
  },
  submitText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 20,
  },
});
