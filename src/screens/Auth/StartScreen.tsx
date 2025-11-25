import React from "react";
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Text, Button } from "react-native-paper";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";

import loginCar from "../../../assets/login-car.png";

type Props = NativeStackScreenProps<RootStackParamList, "Start">;

export default function StartScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1216" />

      {/* Carro com glow */}
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

      {/* Rodapé */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.footerText}>
          Já tem uma conta? <Text style={styles.footerLink}>Entrar</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ESTILOS */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1216",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 16,
  },
  carGlow: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#0c1118",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#00f5a0",
    shadowColor: "#00f5a0",
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  carImage: {
    width: 160,
    height: 110,
  },
  title: {
    marginTop: 26,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#ffffff",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#9ca3af",
  },
  actions: {
    gap: 16,
  },
  buttonPrimary: {
    backgroundColor: "#00f5a0",
    borderRadius: 999,
    paddingVertical: 4,
  },
  buttonPrimaryLabel: {
    fontWeight: "700",
    color: "#00120b",
    fontSize: 16,
  },
  buttonSecondary: {
    borderWidth: 1.4,
    borderColor: "#ffffff",
    borderRadius: 999,
    paddingVertical: 4,
  },
  buttonSecondaryLabel: {
    fontWeight: "700",
    color: "#ffffff",
    fontSize: 16,
  },
  footerText: {
    marginTop: 14,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 13,
  },
  footerLink: {
    color: "#00f5a0",
    fontWeight: "700",
  },
});
