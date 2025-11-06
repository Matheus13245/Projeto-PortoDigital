import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MapScreen from "../screens/Tabs/MapScreen";

// 4 placeholders internos (para manter só 1 arquivo de tela externo)
function CarInfoScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Informações do Carro (placeholder)</Text>
    </View>
  );
}
function HealthScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Saúde / Telemetria (placeholder)</Text>
    </View>
  );
}
function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Perfil (placeholder)</Text>
    </View>
  );
}
function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Configurações (placeholder)</Text>
    </View>
  );
}

export type TabParamList = {
  CarInfo: undefined;
  Health: undefined;
  Map: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: true,     // ✅ sem ícones, mostramos rótulos
        tabBarStyle: { height: 60 },
      }}
    >
      <Tab.Screen name="CarInfo" component={CarInfoScreen} options={{ title: "Carro" }} />
      <Tab.Screen name="Health" component={HealthScreen} options={{ title: "Telemetria" }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: "Mapa" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Configurações" }} />
    </Tab.Navigator>
  );
}


