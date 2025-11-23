import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import FavoriteButton from "../../components/FavoriteButton";
import { postos, Posto } from "../../data/postos";

type PostoDetailsRouteProps = RouteProp<RootStackParamList, "PostoDetails">;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, "PostoDetails">;

export default function PostoDetailsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<PostoDetailsRouteProps>();

  // Recebe os parâmetros básicos do posto
  const { id, nome, latitude, longitude } = route.params;

  // Busca o posto completo na base de dados (para pegar a fila)
  const postoCompleto: Posto | undefined = postos.find((p) => p.id === id);

  const handleCriarRota = () => {
    navigation.navigate("Main", {
      screen: "Map",
      params: {
        rotaDestino: {
          latitude,
          longitude,
          nome,
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nome}</Text>

      {/* Card da fila */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fila de Espera</Text>

        <View style={styles.queueContainer}>
          {postoCompleto?.fila ? (
            <>
              <Text style={styles.queueItem}>
                🔋 Carga Lenta — Vagas: {postoCompleto.fila.lenta.vagas} | Fila: {postoCompleto.fila.lenta.fila} pessoas
              </Text>

              <Text style={styles.queueItem}>
                ⚡ Carga Média — Vagas: {postoCompleto.fila.media.vagas} | Fila: {postoCompleto.fila.media.fila} pessoas
              </Text>

              <Text style={styles.queueItem}>
                🚀 Carga Rápida — Vagas: {postoCompleto.fila.rapida.vagas} | Fila: {postoCompleto.fila.rapida.fila} pessoas
              </Text>
            </>
          ) : (
            <Text style={styles.placeholder}>Nenhuma informação disponível.</Text>
          )}
        </View>
      </View>

      {/* Botão para criar rota */}
      <TouchableOpacity style={styles.button} onPress={handleCriarRota}>
        <Text style={styles.buttonText}>Criar rota até o posto</Text>
      </TouchableOpacity>

      {/* Botão de adicionar aos favoritos */}
      <FavoriteButton
        posto={{
          id,
          nome,
          latitude,
          longitude,
        }}
      />
    </View>
  );
}

// ------------------ STYLES ---------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  queueContainer: {
    marginTop: 10,
  },

  queueItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    color: "#333",
  },

  placeholder: {
    marginTop: 10,
    color: "#555",
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});