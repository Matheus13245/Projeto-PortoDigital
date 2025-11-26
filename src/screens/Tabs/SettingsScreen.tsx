// src/screens/Tabs/SettingsScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { styles } from "./SettingsScreen.styles";

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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    navigation.navigate("Start");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.optionsWrapper}>
        {/* Opções "estáticas" */}
        <Option icon="sun" label="Tema" />
        <Option icon="shield" label="Segurança" />
        <Option icon="user" label="Acessibilidade" />
        <Option icon="globe" label="Idioma" />
        <Option icon="help-circle" label="Ajuda" />

        {/* Notificações com switch */}
        <View style={styles.option}>
          <Icon name="bell" size={22} color="#ffffff" />
          <Text style={styles.optionText}>Notificações</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>

        {/* Botão de sair */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
      <Icon name="chevron-right" size={20} color="#8A8F9A" />
    </TouchableOpacity>
  );
}
