import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";

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
    console.log("DATA LIDA:", data);
    if (data) setFavoritos(JSON.parse(data));
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
        <Text style={{ marginTop: 10 }}>Nenhum posto favoritado ainda.</Text>
      )}

      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
            <Text>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});