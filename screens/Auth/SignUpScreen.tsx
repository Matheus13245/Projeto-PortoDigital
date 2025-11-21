import React, { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export default function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const onSubmit = async () => {
    await signUp(nome, email, senha);
    navigation.replace("Main");
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text variant="titleLarge" style={{ textAlign: "center" }}>
        Criar conta
      </Text>

      <TextInput label="Nome" value={nome} onChangeText={setNome} />
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
        Registrar
      </Button>
    </View>
  );
}






