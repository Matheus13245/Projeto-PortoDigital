import React from "react";
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";

import loginCar from "../../../assets/login-car.png";

type Props = NativeStackScreenProps<RootStackParamList, "Start">;

export default function StartScreen({ navigation }: Props) {
  return (
    <LinearGradient
      colors={["#00131D", "#00313A", "#00E1A9", "#00FFC6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.carGlow}>
          <Image source={loginCar} style={styles.carImage} resizeMode="contain" />
        </View>

        <Text style={styles.title}>BEM-VINDO</Text>
        <Text style={styles.subtitle}>Seu app de mobilidade elétrica</Text>
      </View>

      {/* Botões */}
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

/* ESTILOS */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "flex-start",
  },

  header: {
    alignItems: "center",
    marginTop: 16,
  },

  carGlow: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(0, 255, 198, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00FFC6",
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 16,
  },

  carImage: {
    width: 160,
    height: 110,
  },

  title: {
    marginTop: 26,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#ffffff",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#e5e7eb",
  },

  actions: {
    marginTop: 40,
    gap: 16,
  },

  buttonPrimary: {
    backgroundColor: "#0EE6B7",
    borderRadius: 999,
    paddingVertical: 10,
  },

  buttonPrimaryLabel: {
    color: "#00313A",
    fontWeight: "700",
    fontSize: 16,
  },

  buttonSecondary: {
    borderWidth: 1.8,
    borderColor: "rgba(255,255,255,0.85)",
    borderRadius: 999,
    paddingVertical: 10,
  },

  buttonSecondaryLabel: {
    fontWeight: "700",
    color: "#ffffff",
    fontSize: 16,
  },
});
