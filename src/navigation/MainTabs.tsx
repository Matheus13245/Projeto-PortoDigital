import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import CarInfoScreen from "../screens/Tabs/CarInfoScreen";
import MapScreen from "../screens/Tabs/MapScreen";
import ProfileScreen from "../screens/Tabs/ProfileScreen";
import SettingsScreen from "../screens/Tabs/SettingsScreen";

import { COLORS } from "../styles/theme"; // 👈 ajuste do caminho

export type TabParamList = {
  CarInfo: undefined;
  Map: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // 👈 some a faixa branca de todas as telas do tab

        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primaryButton,
        tabBarInactiveTintColor: "#8A8F9A",

        tabBarStyle: {
          height: 64,
          backgroundColor: "#1B1E24", // preto suave, não preto puro
          borderTopWidth: 0,
          elevation: 0,
        },

        headerTitleAlign: "center",

        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof Feather>["name"];

          switch (route.name) {
            case "CarInfo":
              iconName = "battery";
              break;
            case "Map":
              iconName = "map";
              break;
            case "Profile":
              iconName = "user";
              break;
            case "Settings":
              iconName = "settings";
              break;
            default:
              iconName = "circle";
          }

          return <Feather name={iconName} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="CarInfo"
        component={CarInfoScreen}
        options={{ title: "Carro" }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ title: "Mapa" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Configurações" }}
      />
    </Tab.Navigator>
  );
}
