import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import {
  useRoute,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/RootNavigator";
import FavoriteButton from "../../components/FavoriteButton";
import { postos, Posto } from "../../data/postos";
import { styles } from "./PostoDetailsScreen.styles";

type PostoDetailsRouteProps = RouteProp<RootStackParamList, "PostoDetails">;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function PostoDetailsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<PostoDetailsRouteProps>();

  const { id } = route.params as any;

  const posto: Posto | undefined = postos.find((p) => p.id === id);

  if (!posto) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Posto não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const { nome, latitude, longitude, fila, outOfRange } = posto;

  const [calculatedTime, setCalculatedTime] = useState<number | null>(null);

  // Cálculo baseado no tipo existente
  useEffect(() => {
    if (!fila) return;

    const temposTotais = {
      lenta: 660,
      media: 300,
      rapida: 30,
    };

    const temposRestantes = {
      lenta: 420,
      media: 180,
      rapida: 20,
    };

    const tempoTotal = temposTotais[fila.tipo];
    const tempoRestante = temposRestantes[fila.tipo];

    const vagasOcupadas = fila.vagas;
    const tempoOcupados = vagasOcupadas * tempoRestante;

    const tempoFila =
      fila.fila > 0 ? (fila.fila / fila.vagas) * tempoTotal : 0;

    const tempoFinal = tempoOcupados + tempoFila;
    setCalculatedTime(tempoFinal);
  }, [fila]);

  const handleCriarRota = () => {
    if (outOfRange) return; // BLOQUEIA AÇÃO

    navigation.navigate("Main", {
      screen: "Map",
      params: {
        rotaDestino: {
          latitude,
          longitude,
          nome,
        },
      },
    });
  };

  const buttonDisabled = outOfRange;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{nome}</Text>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações do Carregamento</Text>

          <Text style={styles.resultTitle}>
            {fila.tipo === "lenta" && "🔋 Carga Lenta (10–12h)"}
            {fila.tipo === "media" && "⚡ Carga Média (4–6h)"}
            {fila.tipo === "rapida" && "🚀 Carga Rápida (~30 min)"}
          </Text>

          <Text style={styles.resultText}>Vagas totais: {fila.vagas}</Text>
          <Text style={styles.resultText}>Carregando agora: {fila.vagas}</Text>
          <Text style={styles.resultText}>Na fila: {fila.fila}</Text>

          <Text style={styles.resultText}>
            Sua vez em:{" "}
            {calculatedTime
              ? calculatedTime > 60
                ? `${Math.ceil(calculatedTime / 60)}h`
                : `${Math.ceil(calculatedTime)} min`
              : "-"}
          </Text>

          {outOfRange && (
            <Text
              style={{
                color: "red",
                marginTop: 10,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              ⚠ Este posto está fora de alcance!
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              buttonDisabled && { backgroundColor: "#888" },
            ]}
            onPress={handleCriarRota}
            disabled={buttonDisabled}
          >
            <Text style={styles.primaryButtonText}>
              {buttonDisabled ? "Fora de alcance" : "Criar rota até o posto"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Mapa</Text>
          </TouchableOpacity>

        </View>

        <FavoriteButton posto={{ id, nome, latitude, longitude }} />
      </View>
    </SafeAreaView>
  );
}