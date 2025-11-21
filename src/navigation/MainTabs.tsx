import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CarInfoScreen from "../screens/Tabs/CarInfoScreen";
import HealthScreen from "../screens/Tabs/HealthScreen";
import MapScreen from "../screens/Tabs/MapScreen";
import ProfileScreen from "../screens/Tabs/ProfileScreen";
import SettingsScreen from "../screens/Tabs/SettingsScreen";



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


