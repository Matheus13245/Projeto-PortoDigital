import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Start: undefined;
  Settings: undefined;
};

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Settings"
>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProps>();

  const handleLogout = () => {
    navigation.navigate("Start");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1216" />

      {/* Título */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      {/* Lista de opções */}
      <ScrollView contentContainerStyle={styles.optionsWrapper}>
        <Option icon="sun" label="Tema" />
        <Option icon="shield" label="Segurança" />
        <Option icon="user" label="Acessibilidade" />
        <Option icon="globe" label="Idioma" />
        <Option icon="help-circle" label="Ajuda" />

        {/* Botão de Sair */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Option({
  label,
  icon,
}: {
  label: string;
  icon: React.ComponentProps<typeof Icon>["name"];
}) {
  return (
    <TouchableOpacity style={styles.option}>
      <Icon name={icon} size={22} color="#ffffff" />
      <Text style={styles.optionText}>{label}</Text>
      <Icon name="chevron-right" size={20} color="#6b7280" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1216",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1c2530",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },
  optionsWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141820",
    padding: 16,
    borderRadius: 14,
    justifyContent: "space-between",
  },
  optionText: {
    color: "#ffffff",
    fontSize: 16,
    flex: 1,
    marginLeft: 16,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#E53935",
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
