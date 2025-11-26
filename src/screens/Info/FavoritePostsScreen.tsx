// src/screens/Info/FavoritePostsScreen.tsx
import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";

import { styles } from "./FavoritePostsScreen.styles";

interface Props {
  navigation: NavigationProp<any>;
}

interface Posto {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
}

export default function FavoritePostsScreen({ navigation }: Props) {
  const [favoritos, setFavoritos] = useState<Posto[]>([]);

  const loadFavoritos = async () => {
    const data = await AsyncStorage.getItem("@postos_favoritos");
    if (data) {
      setFavoritos(JSON.parse(data));
    } else {
      setFavoritos([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavoritos();
    }, [])
  );

  const handleSelect = (posto: Posto) => {
    navigation.navigate("PostoDetails", {
      id: posto.id,
      nome: posto.nome,
      latitude: posto.latitude,
      longitude: posto.longitude,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Postos Favoritos</Text>

      {favoritos.length === 0 && (
        <Text style={styles.emptyText}>Nenhum posto favoritado ainda.</Text>
      )}

      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleSelect(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.itemTitle}>{item.nome}</Text>
            <Text style={styles.itemSubtitle}>
              {`Lat: ${item.latitude.toFixed(4)} • Long: ${item.longitude.toFixed(
                4
              )}`}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
