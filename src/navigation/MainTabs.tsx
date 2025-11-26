import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import CarInfoScreen from "../screens/Tabs/CarInfoScreen";
import MapScreen from "../screens/Tabs/MapScreen";
import ProfileScreen from "../screens/Tabs/ProfileScreen";
import SettingsScreen from "../screens/Tabs/SettingsScreen";

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
  screenOptions={{
    headerShown: false,
    tabBarStyle: {
      backgroundColor: "#0D141A", // <<< novo fundo premium
      borderTopColor: "transparent",
      elevation: 0,
      height: 72,
      paddingBottom: 10,
      paddingTop: 10,
    },
    tabBarActiveTintColor: "#00FFC6",
    tabBarInactiveTintColor: "#7A8894",
    sceneStyle: {
      backgroundColor: "#0A0F14", // fundo de TODAS as telas do tab
    },
  }}
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



