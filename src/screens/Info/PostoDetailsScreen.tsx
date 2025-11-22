import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import FavoriteButton from "../../components/FavoriteButton";

type PostoDetailsRouteProps = RouteProp<RootStackParamList, "PostoDetails">;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, "PostoDetails">;

export default function PostoDetailsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<PostoDetailsRouteProps>();
  
  const posto = route.params;

  const handleCriarRota = () => {
    navigation.navigate("Main", {
      screen: "Map",
      params: {
        rotaDestino: {
          latitude: posto.latitude,
          longitude: posto.longitude,
          nome: posto.nome,
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{posto.nome}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fila de Espera</Text>
        <Text style={styles.placeholder}>Nenhuma informação ainda...</Text>
      </View>

      {/* Botão para criar rota */}
      <TouchableOpacity style={styles.button} onPress={handleCriarRota}>
        <Text style={styles.buttonText}>Criar rota até o posto</Text>
      </TouchableOpacity>

      {/* Botão de adicionar aos favoritos */}
      <FavoriteButton
        posto={{
          id: posto.id,
          nome: posto.nome,
          latitude: posto.latitude,
          longitude: posto.longitude,
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