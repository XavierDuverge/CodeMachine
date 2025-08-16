import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  // Auto-login si estaba en remember me
 useEffect(() => {
  const checkUser = async () => {
    const userData = await AsyncStorage.getItem("rememberedUser");
    if (userData) {
      setLoggedIn(true); // ahora sí detecta que está logueado
    }
  };
  checkUser();
}, []);

  const handleLogin = async () => {
    try {
      const usersJSON = await AsyncStorage.getItem("users");
      const users = usersJSON ? JSON.parse(usersJSON) : [];

      const user = users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (user) {
        if (remember) {
          await AsyncStorage.setItem("rememberedUser", username);
        }
        Alert.alert("✅ Login exitoso");
        router.replace("/");
      } else {
        Alert.alert("❌ Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error al leer datos de usuario");
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <LinearGradient colors={["#78e782ff", "#43ce94ff"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#ccc"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.optionsRow}>
          <View style={styles.rememberMe}>
            <Switch value={remember} onValueChange={setRemember} />
            <Text style={styles.rememberText}>Remember me</Text>
          </View>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.registerLink}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center" },
  container: {
    backgroundColor: "rgba(255,255,255,0.15)",
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#fff" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, marginBottom: 15, paddingHorizontal: 10 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: "#fff" },
  optionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  rememberMe: { flexDirection: "row", alignItems: "center" },
  rememberText: { color: "#fff", marginLeft: 5 },
  forgotText: { color: "#fff", textDecorationLine: "underline" },
  loginButton: { backgroundColor: "#fff", paddingVertical: 15, borderRadius: 30, alignItems: "center", marginBottom: 15 },
  loginText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  registerText: { color: "#fff", textAlign: "center" },
  registerLink: { fontWeight: "bold", textDecorationLine: "underline" },
});
// Sets a flag in AsyncStorage to indicate the user is logged in and navigates to home
async function setLoggedIn(loggedIn: boolean) {
  if (loggedIn) {
    await AsyncStorage.setItem("isLoggedIn", "true");
  } else {
    await AsyncStorage.removeItem("isLoggedIn");
  }
}

