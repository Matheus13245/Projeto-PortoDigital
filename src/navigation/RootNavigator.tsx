import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StartScreen from "../screens/Auth/StartScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";
import MainTabs from "./MainTabs";
import PostoDetailsScreen from "../screens/Info/PostoDetailsScreen";
import FavoritePostsScreen from "../screens/Info/FavoritePostsScreen"; // << ADICIONADO

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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
       initialRouteName="Start"
  screenOptions={{
    headerShown: false,
  }}
>
  <Stack.Screen name="Start" component={StartScreen} />
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="SignUp" component={SignUpScreen} />
  <Stack.Screen name="Main" component={MainTabs} />
  <Stack.Screen
    name="PostoDetails"
    component={PostoDetailsScreen}
    options={{ headerShown: false }} // reforço
  />
  <Stack.Screen
    name="FavoritePosts"
    component={FavoritePostsScreen}
    options={{ headerShown: false }} // se precisar
  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}