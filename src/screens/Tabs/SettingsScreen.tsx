import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Feather as Icon } from "@expo/vector-icons";

// Ajuste esse tipo para seu RootNavigator
type RootStackParamList = {
  Start: undefined;
  Settings: undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Settings">;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProps>();

  const handleLogout = () => {
    navigation.navigate("Start");
  };

  return (
    <View style={styles.container}>
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Icon name="settings" size={30} color="white" />
        <Text style={styles.headerText}>Configurações</Text>
      </View>

      {/* Lista */}
      <ScrollView style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <Icon name="sun" size={20} color="white" />
          <Text style={styles.optionText}>Tema</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="shield" size={20} color="white" />
          <Text style={styles.optionText}>Segurança</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
           <Icon name="user" size={20} color="white" />
            <Text style={styles.optionText}>Acessibilidade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="globe" size={20} color="white" />
          <Text style={styles.optionText}>Idioma</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="help-circle" size={20} color="white" />
          <Text style={styles.optionText}>Ajuda</Text>
        </TouchableOpacity>

        {/* Botão de Sair funcional */}
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Icon name="log-out" size={20} color="white" />
          <Text style={styles.optionText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2937",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222F3E",
    padding: 20,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    marginLeft: 10,
  },
  optionsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D3A47",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  optionText: {
    color: "white",
    fontSize: 18,
    marginLeft: 15,
  },
});