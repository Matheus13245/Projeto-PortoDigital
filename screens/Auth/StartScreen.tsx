import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Start">;

export default function StartScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 16 }}>
      <Text variant="headlineMedium" style={{ textAlign: "center" }}>
        Bem-vindo
      </Text>

      <Button mode="contained" onPress={() => navigation.navigate("Login")}>
        Entrar
      </Button>

      <Button mode="outlined" onPress={() => navigation.navigate("SignUp")}>
        Criar conta
      </Button>
    </View>
  );
}
