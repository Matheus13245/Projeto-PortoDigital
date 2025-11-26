import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../styles/theme";

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

  // Verifica favoritos salvos
  const checkIfFavorite = async () => {
    const stored = await AsyncStorage.getItem("@postos_favoritos");
    const lista: FavoritePosto[] = stored ? JSON.parse(stored) : [];

    setIsFavorite(lista.some((p) => p.id === posto.id));
  };

  useEffect(() => {
    checkIfFavorite();
  }, []);

  // Alterna o favorito
  const toggleFavorite = async () => {
    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem("@postos_favoritos");
      const lista: FavoritePosto[] = stored ? JSON.parse(stored) : [];

      let updatedList: FavoritePosto[];

      if (isFavorite) {
        updatedList = lista.filter((p) => p.id !== posto.id);
      } else {
        updatedList = [...lista, posto];
      }

      await AsyncStorage.setItem(
        "@postos_favoritos",
        JSON.stringify(updatedList)
      );

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.log("Erro ao atualizar favoritos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFavorite ? styles.buttonFavorited : styles.buttonAdd,
      ]}
      onPress={toggleFavorite}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.primaryButtonLabel} />
      ) : (
        <Text
          style={[
            styles.text,
            isFavorite ? styles.textFavorited : styles.textAdd,
          ]}
        >
          {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },

  // Adicionar aos favoritos → botão verde sólido
  buttonAdd: {
    backgroundColor: COLORS.primaryButton,
  },
  textAdd: {
    color: COLORS.primaryButtonLabel,
    fontWeight: "700",
    fontSize: 15,
  },

  // Remover favoritos → botão com borda verde e fundo transparente
  buttonFavorited: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.primaryButton,
  },
  textFavorited: {
    color: COLORS.primaryButton,
    fontWeight: "700",
    fontSize: 15,
  },

  text: {
    fontWeight: "bold",
  },
});
