import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type FavoritePosto = {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
};

type FavoriteButtonProps = {
  posto: FavoritePosto;
};

export default function FavoriteButton({ posto }: FavoriteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  /** Checa se já está salvo */
  const checkIfFavorite = async () => {
    const stored = await AsyncStorage.getItem("@postosFavoritos");
    const lista: FavoritePosto[] = stored ? JSON.parse(stored) : [];

    const found = lista.some((p) => p.id === posto.id);
    setIsFavorite(found);
  };

  useEffect(() => {
    checkIfFavorite();
  }, []);

  /** Alternar favorito */
  const toggleFavorite = async () => {
    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem("@postosFavoritos");
      const lista: FavoritePosto[] = stored ? JSON.parse(stored) : [];

      let updatedList: FavoritePosto[] = [];

      if (isFavorite) {
        // REMOVE se já está nos favoritos
        updatedList = lista.filter((p) => p.id !== posto.id);
      } else {
        // ADICIONA se ainda não está
        updatedList = [...lista, posto];
      }

      await AsyncStorage.setItem("@postosFavoritos", JSON.stringify(updatedList));
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.log("Erro ao atualizar favoritos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, isFavorite && styles.buttonUnfavorite]}
      onPress={toggleFavorite}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>
          {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonUnfavorite: {
    backgroundColor: "#c02929",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});