import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigation.replace("Start");
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 16 }}>
      <Text variant="headlineSmall" style={{ textAlign: "center" }}>
        EV Charging App
      </Text>

      <Text style={{ textAlign: "center" }}>
        {user ? `Olá, ${user.name ?? user.email}!` : "Modo visitante (mock)."}
      </Text>

      <Button onPress={handleSignOut}>Sair</Button>
      <Button onPress={() => navigation.navigate("Start")}>
      Voltar para início
      </Button>
    </View>
  );
}




