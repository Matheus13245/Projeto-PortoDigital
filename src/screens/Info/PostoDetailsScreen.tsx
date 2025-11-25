import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import FavoriteButton from "../../components/FavoriteButton";
import { postos, Posto } from "../../data/postos";

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

  // Navegar para o mapa com rota
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

  // ============================================
  //  CÁLCULO DE TEMPO
  // ============================================
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
  }, [selectedCharge]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nome}</Text>

      {/* CARD DE FILA */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fila de Espera</Text>

        {!postoCompleto?.fila ? (
          <Text>Nenhuma informação disponível.</Text>
        ) : (
          <>
            <Text style={styles.sectionLabel}>
              Selecione o tipo de carregamento:
            </Text>

            <Picker
              selectedValue={selectedCharge}
              onValueChange={(value) => setSelectedCharge(value)}
              style={styles.picker}
            >
              <Picker.Item label="Escolher..." value={null} />
              <Picker.Item label="🔋 Lenta (10–12h)" value="lenta" />
              <Picker.Item label="⚡ Média (4–6h)" value="media" />
              <Picker.Item label="🚀 Rápida (~30 min)" value="rapida" />
            </Picker>

            {/* EXIBIR RESULTADO QUANDO ESCOLHER */}
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

                      {/* BOTÃO ADICIONADO AQUI */}
                      <TouchableOpacity
                        style={styles.button}
                        onPress={handleCriarRota}
                      >
                        <Text style={styles.buttonText}>
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
  );
}

// ----------------------------------------------------
// STYLES
// ----------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionLabel: {
    marginTop: 10,
    fontWeight: "500",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 10,
  },
  infoBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resultTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  resultText: {
    marginTop: 3,
    color: "#333",
  },
  button: {
    marginTop: 15,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});