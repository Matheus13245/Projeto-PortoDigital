// src/screens/Auth/StartScreen.tsx
import React from "react";
import { View, Image, StatusBar } from "react-native";
import { Text, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";

import loginCar from "../../../assets/login-car.png";
import { MAIN_GRADIENT } from "../../styles/theme";
import { styles } from "./StartScreen.styles";

type Props = NativeStackScreenProps<RootStackParamList, "Start">;

export default function StartScreen({ navigation }: Props) {
  return (
    <LinearGradient
      colors={MAIN_GRADIENT.colors}
      start={MAIN_GRADIENT.start}
      end={MAIN_GRADIENT.end}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" />

      <View style={styles.header}>
        <View style={styles.carGlow}>
          <Image source={loginCar} style={styles.carImage} resizeMode="contain" />
        </View>

        <Text style={styles.title}>BEM-VINDO</Text>
        <Text style={styles.subtitle}>Seu app de mobilidade elétrica</Text>
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Login")}
          style={styles.buttonPrimary}
          labelStyle={styles.buttonPrimaryLabel}
        >
          Entrar
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate("SignUp")}
          style={styles.buttonSecondary}
          labelStyle={styles.buttonSecondaryLabel}
        >
          Criar conta
        </Button>
      </View>
    </LinearGradient>
  );
}
