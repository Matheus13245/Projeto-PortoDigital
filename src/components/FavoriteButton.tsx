// src/components/FavoriteButton.tsx
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

  // Verifica se o posto já está salvo nos favoritos
  const checkIfFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem("@postos_favoritos");
      const lista: FavoritePosto[] = stored ? JSON.parse(stored) : [];
      setIsFavorite(lista.some((p) => p.id === posto.id));
    } catch (err) {
      console.log("Erro ao ler favoritos:", err);
    }
  };

  useEffect(() => {
    checkIfFavorite();
  }, []);

  // Alterna favorito
  const toggleFavorite = async () => {
    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem("@postos_favoritos");
      const lista: FavoritePosto[] = stored ? JSON.parse(stored) : [];

      let updatedList: FavoritePosto[];

      if (isFavorite) {
        // Remover
        updatedList = lista.filter((p) => p.id !== posto.id);
      } else {
        // Adicionar
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
        styles.buttonBase,
        isFavorite ? styles.buttonFavorited : styles.buttonAdd,
      ]}
      onPress={toggleFavorite}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator
          color={isFavorite ? COLORS.primaryButton : COLORS.primaryButtonLabel}
        />
      ) : (
        <Text
          style={[
            styles.textBase,
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
  buttonBase: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },

  // Estado "Adicionar aos favoritos" → botão verde sólido
  buttonAdd: {
    backgroundColor: COLORS.primaryButton, // verde AX
  },
  textAdd: {
    color: COLORS.primaryButtonLabel, // verde-escuro do tema
  },

  // Estado "Remover dos favoritos" → borda verde, fundo transparente
  buttonFavorited: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.primaryButton,
  },
  textFavorited: {
    color: COLORS.primaryButton,
  },

  textBase: {
    fontWeight: "700",
    fontSize: 15,
  },
});
