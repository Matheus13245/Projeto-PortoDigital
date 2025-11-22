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
  const [alreadyFavorite, setAlreadyFavorite] = useState(false);

  /** Checa se já está nos favoritos */
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("@postosFavoritos");
      const lista: FavoritePosto[] = stored ? JSON.parse(stored) : [];

      if (lista.some((p) => p.id === posto.id)) {
        setAlreadyFavorite(true);
      }
    })();
  }, []);

  /** Adiciona aos favoritos */
  const handleAddFavorite = async () => {
    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem("@postosFavoritos");
      const lista: FavoritePosto[] = stored ? JSON.parse(stored) : [];

      // Se já existir, não adiciona novamente
      if (lista.some((p) => p.id === posto.id)) {
        setAlreadyFavorite(true);
        return;
      }

      const novaLista = [...lista, posto];
      await AsyncStorage.setItem("@postosFavoritos", JSON.stringify(novaLista));
      setAlreadyFavorite(true);
    } catch (err) {
      console.log("Erro ao salvar favorito:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, alreadyFavorite && styles.buttonDisabled]}
      onPress={handleAddFavorite}
      disabled={alreadyFavorite || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>
          {alreadyFavorite ? "Já favorito ✓" : "Adicionar aos favoritos"}
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
  buttonDisabled: {
    backgroundColor: "#5c7eaa",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});