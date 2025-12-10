// src/screens/Auth/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
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
import { MAIN_GRADIENT, INPUT_THEME } from "../../styles/theme";
import { styles } from "./LoginScreen.styles";

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

  const goToSignUp = () => navigation.navigate("SignUp");

  return (
    <LinearGradient
      colors={MAIN_GRADIENT.colors}
      start={MAIN_GRADIENT.start}
      end={MAIN_GRADIENT.end}
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
          <View style={styles.header}>
            <View style={styles.carGlow}>
              <Image source={loginCar} style={styles.carImage} resizeMode="contain" />
            </View>
            <Text style={styles.title}>BEM-VINDO</Text>
            <Text style={styles.subtitle}>Seu app de recarga otimizada</Text>
          </View>

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
              theme={INPUT_THEME}
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
              theme={INPUT_THEME}
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
