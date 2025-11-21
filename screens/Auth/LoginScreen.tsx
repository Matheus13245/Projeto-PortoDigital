import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useAuth } from "../../context/AuthContext";

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
      Alert.alert("Erro", e?.message ?? "Falha no login");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text variant="titleLarge" style={{ textAlign: "center" }}>
        Entrar
      </Text>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Button mode="contained" onPress={onSubmit}>
        Continuar
      </Button>
    </View>
  );
}




