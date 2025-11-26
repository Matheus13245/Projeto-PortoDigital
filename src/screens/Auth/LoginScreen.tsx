import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useAuth } from "../../context/AuthContext";

import loginCar from "../../../assets/login-car.png";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const onSubmit = async () => {
    try {
      await signIn(email, senha);
      navigation.replace("Main");
    } catch (e: any) {
      alert(e?.message ?? "Falha no login");
    }
  };

  const goToSignUp = () => {
    navigation.navigate("SignUp");
  };

  const onSubmit = async () => {
  alert("Cliquei no Entrar");   // 👈 teste rápido
  try {
    await signIn(email, senha);
    navigation.replace("Main");
  } catch (e: any) {
    alert(e?.message ?? "Falha no login");
  }
};


  return (
    <LinearGradient
      colors={["#00131D", "#00313A", "#00E1A9", "#00FFC6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Topo com carro */}
          <View style={styles.header}>
            <View style={styles.carGlow}>
              <Image
                source={loginCar}
                style={styles.carImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>BEM VINDO</Text>
            <Text style={styles.subtitle}>Seu app de recarga otimizada</Text>
          </View>

          {/* Área do formulário */}
          <View style={styles.formContainer}>
            <TextInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              mode="flat"
              style={styles.input}
              underlineColor="transparent"
              textColor="#ffffff"
              autoCapitalize="none"
              keyboardType="email-address"
              theme={{
                colors: {
                  primary: "#00f5a0",
                  onSurface: "#ffffff",
                  placeholder: "#8e9aab",
                  background: "#262c35",
                },
              }}
            />

            <TextInput
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              mode="flat"
              style={styles.input}
              underlineColor="transparent"
              textColor="#ffffff"
              theme={{
                colors: {
                  primary: "#00f5a0",
                  onSurface: "#ffffff",
                  placeholder: "#8e9aab",
                  background: "#262c35",
                },
              }}
            />

            <Button
              mode="contained"
              onPress={onSubmit}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Entrar
            </Button>

            <TouchableOpacity onPress={goToSignUp} activeOpacity={0.7}>
              <Text style={styles.footerText}>
                Ainda não tem conta?{" "}
                <Text style={styles.footerLink}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* --------------------- ESTILOS --------------------- */

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 16,
  },
  carGlow: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#00f5a0",
    shadowColor: "#00f5a0",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  carImage: {
    width: 150,
    height: 100,
  },
  title: {
    marginTop: 24,
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#e5e7eb",
  },
  formContainer: {
    backgroundColor: "rgba(12, 17, 24, 0.92)",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
  },
  input: {
    backgroundColor: "#262c35",
    borderRadius: 12,
  },
  button: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "#00f5a0",
  },
  buttonLabel: {
    color: "#00120b",
    fontWeight: "700",
  },
  footerText: {
    marginTop: 12,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 13,
  },
  footerLink: {
    color: "#00f5a0",
    fontWeight: "600",
  },

  });
