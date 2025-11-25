import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useAuth } from "../../context/AuthContext";

import loginCar from "../../../assets/login-car.png";


type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export default function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const onSubmit = async () => {
    try {
      await signUp(nome, email, senha);
      navigation.replace("Main");
    } catch (e: any) {
      alert(e?.message ?? "Falha ao criar conta");
    }
  };

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1216" />

      {/* Topo com carro */}
      <View style={styles.header}>
        <View style={styles.carGlow}>
          <Image source={loginCar} style={styles.carImage} resizeMode="contain" />
        </View>

        <Text style={styles.title}>CADASTRE-SE</Text>
      </View>

      {/* Área do formulário */}
      <View style={styles.formContainer}>
        <TextInput
          label="Nome completo"
          value={nome}
          onChangeText={setNome}
          mode="flat"
          style={styles.input}
          underlineColor="transparent"
          theme={{
            colors: {
              primary: "#00f5a0",
              background: "#262c35",
              surfaceVariant: "#262c35",
              onSurfaceVariant: "#ffffff",
            },
          }}
        />

        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          mode="flat"
          style={styles.input}
          underlineColor="transparent"
          theme={{
            colors: {
              primary: "#00f5a0",
              background: "#262c35",
              surfaceVariant: "#262c35",
              onSurfaceVariant: "#ffffff",
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
          theme={{
            colors: {
              primary: "#00f5a0",
              background: "#262c35",
              surfaceVariant: "#262c35",
              onSurfaceVariant: "#ffffff",
            },
          }}
        />

        <Button
          mode="contained"
          onPress={onSubmit}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Cadastrar-se
        </Button>

        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.footerText}>
            Já tem conta?{" "}
            <Text style={styles.footerLink}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* --------------------- ESTILOS --------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1216",
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
    backgroundColor: "#0c1118",
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
  formContainer: {
    backgroundColor: "#141820",
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

