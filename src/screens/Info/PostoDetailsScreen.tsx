// src/screens/Info/PostoDetailsScreen.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
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
import { COLORS } from "../../styles/theme"; // ✅ importa cores

type PostoDetailsRouteProps = RouteProp<RootStackParamList, "PostoDetails">;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function PostoDetailsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<PostoDetailsRouteProps>();
  const { id, nome, latitude, longitude } = route.params as any;

  const postoCompleto: Posto | undefined = postos.find((p) => p.id === id);

  const [selectedCharge, setSelectedCharge] = useState<
    "lenta" | "media" | "rapida" | null
  >(null);

  const [calculatedTime, setCalculatedTime] = useState<number | null>(null);

  const handleCriarRota = () => {
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

  // cálculo de tempo de espera
  useEffect(() => {
    if (!selectedCharge || !postoCompleto?.fila) {
      setCalculatedTime(null);
      return;
    }

    const filaInfo = postoCompleto.fila[selectedCharge];

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

    const tempoTotal = temposTotais[selectedCharge];
    const tempoRestante = temposRestantes[selectedCharge];

    const vagasTotais = filaInfo.vagas;
    const pessoasNaFila = filaInfo.fila;

    const vagasOcupadas = vagasTotais;
    const tempoOcupados = vagasOcupadas * tempoRestante;

    const tempoFila =
      pessoasNaFila > 0 ? (pessoasNaFila / vagasTotais) * tempoTotal : 0;

    const tempoFinal = tempoOcupados + tempoFila;
    setCalculatedTime(tempoFinal);
  }, [selectedCharge, postoCompleto]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{nome}</Text>

        {/* CARD DE FILA */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fila de Espera</Text>

          {!postoCompleto?.fila ? (
            <Text style={styles.resultText}>
              Nenhuma informação disponível.
            </Text>
          ) : (
            <>
              <Text style={styles.sectionLabel}>
                Selecione o tipo de carregamento:
              </Text>

              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedCharge}
                  onValueChange={(value) =>
                    setSelectedCharge(
                      value as "lenta" | "media" | "rapida" | null
                    )
                  }
                  style={styles.picker}
                  dropdownIconColor={COLORS.textPrimary} // ✅ ícone claro
                >
                  <Picker.Item
                    label="Escolher..."
                    value={null}
                    color={COLORS.textSecondary} // cinza
                  />
                  <Picker.Item
                    label="🔋 Lenta (10–12h)"
                    value="lenta"
                    color={COLORS.textPrimary} // branco
                  />
                  <Picker.Item
                    label="⚡ Média (4–6h)"
                    value="media"
                    color={COLORS.textPrimary}
                  />
                  <Picker.Item
                    label="🚀 Rápida (~30 min)"
                    value="rapida"
                    color={COLORS.textPrimary}
                  />
                </Picker>
              </View>

              {selectedCharge && (
                <View style={styles.infoBox}>
                  <Text style={styles.resultTitle}>
                    {selectedCharge === "lenta" && "🔋 Carga Lenta"}
                    {selectedCharge === "media" && "⚡ Carga Média"}
                    {selectedCharge === "rapida" && "🚀 Carga Rápida"}
                  </Text>

                  {(() => {
                    const filaInfo = postoCompleto.fila[selectedCharge];

                    const vagasTotais = filaInfo.vagas;
                    const vagasOcupadas = vagasTotais;
                    const pessoasNaFila = filaInfo.fila;
                    const vagasDisponiveis = Math.max(
                      vagasTotais - vagasOcupadas,
                      0
                    );

                    return (
                      <>
                        <Text style={styles.resultText}>
                          Vagas totais: {vagasTotais}
                        </Text>

                        <Text style={styles.resultText}>
                          Carregando agora: {vagasOcupadas}
                        </Text>

                        <Text style={styles.resultText}>
                          Na fila: {pessoasNaFila}
                        </Text>

                        <Text style={styles.resultText}>
                          Disponíveis agora: {vagasDisponiveis}
                        </Text>

                        <Text style={styles.resultText}>
                          Sua vez em:{" "}
                          {calculatedTime !== null
                            ? calculatedTime > 60
                              ? `${Math.ceil(calculatedTime / 60)}h`
                              : `${Math.ceil(calculatedTime)} min`
                            : "-"}
                        </Text>

                        <TouchableOpacity
                          style={styles.primaryButton}
                          onPress={handleCriarRota}
                        >
                          <Text style={styles.primaryButtonText}>
                            Criar rota até o posto
                          </Text>
                        </TouchableOpacity>
                      </>
                    );
                  })()}
                </View>
              )}
            </>
          )}
        </View>

        {/* FAVORITAR */}
        <FavoriteButton posto={{ id, nome, latitude, longitude }} />
      </View>
    </SafeAreaView>
  );
}
