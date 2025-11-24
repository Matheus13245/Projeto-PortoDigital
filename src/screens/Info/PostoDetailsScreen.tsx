import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootNavigator";
import FavoriteButton from "../../components/FavoriteButton";
import { postos, Posto } from "../../data/postos";

type PostoDetailsRouteProps = RouteProp<RootStackParamList, "PostoDetails">;

export default function PostoDetailsScreen() {
  const route = useRoute<PostoDetailsRouteProps>();
  const { id, nome, latitude, longitude } = route.params as any;

  const postoCompleto: Posto | undefined = postos.find((p) => p.id === id);

  const [selectedCharge, setSelectedCharge] = useState<
    "lenta" | "media" | "rapida" | null
  >(null);

  const [calculatedTime, setCalculatedTime] = useState<number | null>(null);

  // ============================================
  //  CÁLCULO DO TEMPO DE ESPERA REAL
  // ============================================
  useEffect(() => {
    if (!selectedCharge || !postoCompleto?.fila) {
      setCalculatedTime(null);
      return;
    }

    const filaInfo = postoCompleto.fila[selectedCharge];

    // Tempos totais médios
    const temposTotais = {
      lenta: 660, // 11h
      media: 300, // 5h
      rapida: 30, // 30min
    };

    // Tempo médio restante de quem já está carregando
    const temposRestantes = {
      lenta: 420, // 7h restantes
      media: 180, // 3h restantes
      rapida: 20, // 20min restantes
    };

    const tempoTotal = temposTotais[selectedCharge];
    const tempoRestante = temposRestantes[selectedCharge];

    const vagasTotais = filaInfo.vagas;
    const pessoasNaFila = filaInfo.fila;

    // Vagas ocupadas (se existe fila, todas estão ocupadas)
    const vagasOcupadas = vagasTotais;
    const vagasDisponiveis = Math.max(vagasTotais - vagasOcupadas, 0);

    // SOMA DO TEMPO REAL:
    // 1. Tempo restante dos que estão carregando
    const tempoOcupados = vagasOcupadas * tempoRestante;

    // 2. Tempo dos que estão na fila (processando em paralelo pelas vagas)
    const tempoFila = pessoasNaFila > 0
      ? (pessoasNaFila / vagasTotais) * tempoTotal
      : 0;

    const tempoFinal = tempoOcupados + tempoFila;

    setCalculatedTime(tempoFinal);
  }, [selectedCharge]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nome}</Text>

      {/* CARD DA FILA */}
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
                        Vagas ocupadas (carregando): {vagasOcupadas}
                      </Text>

                      <Text style={styles.resultText}>
                        Pessoas esperando na fila: {pessoasNaFila}
                      </Text>

                      <Text style={styles.resultText}>
                        Vagas disponíveis agora: {vagasDisponiveis}
                      </Text>

                      <Text style={styles.resultText}>
                        Tempo estimado até sua vez:{" "}
                        {calculatedTime !== null
                          ? calculatedTime > 60
                            ? `${Math.ceil(calculatedTime / 60)}h`
                            : `${Math.ceil(calculatedTime)} min`
                          : "-"}
                      </Text>
                    </>
                  );
                })()}
              </View>
            )}
          </>
        )}
      </View>

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
});