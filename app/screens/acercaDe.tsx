import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Member = {
    name: string;
    matricula: string;
    phone: string;
    telegram: string;
    photo?: string;
};

const team: Member[] = [
    {
        name: "Rolando Mañón",
        matricula: "2023-1022",
        phone: "+18095550001",
        telegram: "https://t.me/rolando",
        photo: "https://via.placeholder.com/100",
    },
    {
        name: "Xavier Duvergé",
        matricula: "2023-0977",
        phone: "+18097815922",
        telegram: "https://t.me/xavier",
        photo: "https://via.placeholder.com/100",
    },
    {
        name: "Andriws Castillo",
        matricula: "2023-0940",
        phone: "+18095550003",
        telegram: "https://t.me/andriws",
        photo: "https://via.placeholder.com/100",
    },
    {
        name: "Jordys Valenzuela",
        matricula: "2023-0957",
        phone: "+18095550004",
        telegram: "https://t.me/jordys",
        photo: "https://via.placeholder.com/100",
    },
    {
        name: "José Ángel de Jesús",
        matricula: "2023-0954",
        phone: "+18095550005",
        telegram: "https://t.me/joseangel",
        photo: "https://via.placeholder.com/100",
    },
    {
        name: "Cristian Ledesma",
        matricula: "2023-0967",
        phone: "+18095550006",
        telegram: "https://t.me/cristian",
        photo: "https://via.placeholder.com/100",
    },
    {
        name: "Bily Álvarez",
        matricula: "2023-0952",
        phone: "+18095550007",
        telegram: "https://t.me/bily",
        photo: "https://via.placeholder.com/100",
    },
];

export default function AboutUsScreen() {
    const router = useRouter();
    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const openTelegram = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Botón de volver */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push("/(tabs)/explore")} // 👈 manda al tab Explore
            >
                <Ionicons name="arrow-back" size={20} color="#fff" />
                <Text style={styles.backButtonText}>← Explorer</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Grupo Vag-OS</Text>

            {team.map((member, index) => (
                <View key={index} style={styles.card}>
                    <Image source={{ uri: member.photo }} style={styles.photo} />

                    <View style={styles.info}>
                        <Text style={styles.name}>{member.name}</Text>
                        <Text style={styles.matricula}>Matrícula: {member.matricula}</Text>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleCall(member.phone)}
                            >
                                <Ionicons name="call" size={20} color="#fff" />
                                <Text style={styles.buttonText}> Llamar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => openTelegram(member.telegram)}
                            >
                                <Ionicons name="paper-plane" size={20} color="#fff" />
                                <Text style={styles.buttonText}> Telegram</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F8E9", // background
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#388e3c", // titlecolor
        marginBottom: 16,
        textAlign: "center",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#c5f8caff", // background-secondary
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: "center",
    },
    photo: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 12,
        backgroundColor: "#ddd",
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    matricula: {
        fontSize: 14,
        marginBottom: 8,
        color: "#555",
    },
    actions: {
        flexDirection: "row",
        gap: 10,
    },
    button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4caf50",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 16, color: '#1B5E20', fontWeight: 'bold' },
});

