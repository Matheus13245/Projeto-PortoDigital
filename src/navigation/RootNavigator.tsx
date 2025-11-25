import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/Auth/StartScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";
import MainTabs from "./MainTabs";
import PostoDetailsScreen from "../screens/Info/PostoDetailsScreen";
import FavoritePostsScreen from "../screens/Info/FavoritePostsScreen"; // << ADICIONADO
import StationRecommendationsAuth from "../screens/Tabs/StationRecommendationsAuth";

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  SignUp: undefined;
  Main:
    | {
        screen?: string;
        params?: any;
      }
    | undefined;

  PostoDetails: {
    id: number;
    nome: string;
    latitude: number;
    longitude: number;
  };

  FavoritePosts: undefined; // << ADICIONADO

  StationRecommendationsAuth: undefined; // << ADICIONADO
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{ title: "Bem-vindo" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Entrar" }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: "Criar conta" }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostoDetails"
          component={PostoDetailsScreen}
          options={{ title: "Detalhes do Posto" }}
        />

        {/* NOVA TELA PARA FAVORITOS */}
        <Stack.Screen
          name="FavoritePosts"
          component={FavoritePostsScreen}
          options={{ title: "Postos Favoritos" }}
        />

        <Stack.Screen
          name="StationRecommendationsAuth"
          component={StationRecommendationsAuth}
          options={{ title: "Recomendações de Postos" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
