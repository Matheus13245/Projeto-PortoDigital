import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StartScreen from "../screens/Auth/StartScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";
import MainTabs from "./MainTabs";

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  SignUp: undefined;
  Main: undefined; // Tabs
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={StartScreen} options={{ title: "Bem-vindo" }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Entrar" }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "Criar conta" }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}












