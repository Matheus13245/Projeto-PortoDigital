import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import FavoriteButton from "../../components/FavoriteButton";
import { postos, Posto } from "../../data/postos";

type PostoDetailsRouteProps = RouteProp<RootStackParamList, "PostoDetails">;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

type ChargeType = "lenta" | "media" | "rapida";

export default function PostoDetailsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<PostoDetailsRouteProps>();
  const { id, nome, latitude, longitude } = route.params as any;

  const postoCompleto: Posto | undefined = postos.find((p) => p.id === id);

  const [selectedCharge, setSelectedCharge] = useState<ChargeType | null>(null);
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

  const chargeOptions: { id: ChargeType; label: string; helper: string; emoji: string }[] = [
    { id: "lenta", label: "Lenta", helper: "10–12h", emoji: "🔋" },
    { id: "media", label: "Média", helper: "4–6h", emoji: "⚡" },
    { id: "rapida", label: "Rápida", helper: "~30min", emoji: "🚀" },
  ];

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
    } as const;

    const temposRestantes = {
      lenta: 420,
      media: 180,
      rapida: 20,
    } as const;

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cabeçalho do posto */}
      <View style={styles.headerBox}>
        <Text style={styles.title}>{nome}</Text>
        {postoCompleto?.endereco && (
          <Text style={styles.subtitle}>{postoCompleto.endereco}</Text>
        )}
      </View>

      {/* CARD DE FILA */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fila de Espera</Text>
        <Text style={styles.cardSubtitle}>
          Veja o tempo estimado até sua vez em cada tipo de carregamento.
        </Text>

        {!postoCompleto?.fila ? (
          <Text style={styles.emptyText}>Nenhuma informação disponível.</Text>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Tipo de carregamento</Text>

            {/* Opções (pills) */}
            <View style={styles.chargeOptionsRow}>
              {chargeOptions.map((opt) => {
                const isActive = selectedCharge === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.chargeOption,
                      isActive && styles.chargeOptionActive,
                    ]}
                    onPress={() => setSelectedCharge(opt.id)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.chargeOptionEmoji,
                        isActive && styles.chargeOptionEmojiActive,
                      ]}
                    >
                      {opt.emoji}
                    </Text>
                    <View>
                      <Text
                        style={[
                          styles.chargeOptionLabel,
                          isActive && styles.chargeOptionLabelActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <Text style={styles.chargeOptionHelper}>{opt.helper}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

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

                  const tempoFormatado =
                    calculatedTime !== null
                      ? calculatedTime > 60
                        ? `${Math.ceil(calculatedTime / 60)} h`
                        : `${Math.ceil(calculatedTime)} min`
                      : "-";

                  return (
                    <>
                      <View style={styles.metricsRow}>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Vagas totais</Text>
                          <Text style={styles.metricValue}>{vagasTotais}</Text>
                        </View>

                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Carregando agora</Text>
                          <Text style={styles.metricValue}>{vagasOcupadas}</Text>
                        </View>

                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Na fila</Text>
                          <Text style={styles.metricValue}>{pessoasNaFila}</Text>
                        </View>
                      </View>

                      <View style={styles.metricsRow}>
                        <View style={styles.metricItemWide}>
                          <Text style={styles.metricLabel}>Disponíveis agora</Text>
                          <Text style={styles.metricValue}>
                            {vagasDisponiveis}
                          </Text>
                        </View>

                        <View style={styles.metricItemWide}>
                          <Text style={styles.metricLabel}>Sua vez em</Text>
                          <Text style={styles.metricHighlight}>
                            {tempoFormatado}
                          </Text>
                        </View>
                      </View>

                      {/* BOTÃO ROTAS */}
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
      <View style={styles.favoriteBox}>
        <FavoriteButton posto={{ id, nome, latitude, longitude }} />
      </View>
    </ScrollView>
  );
}

// ----------------------------------------------------
// STYLES
// ----------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1216",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
  },
  headerBox: {
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    color: "#9ca3af",
  },

  card: {
    backgroundColor: "#161b22",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  emptyText: {
    marginTop: 12,
    color: "#9ca3af",
    fontSize: 13,
  },
  sectionLabel: {
    marginTop: 14,
    marginBottom: 4,
    fontWeight: "500",
    fontSize: 12,
    color: "#e5e7eb",
  },

  // Opções de carga (pills)
  chargeOptionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  chargeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#0b1117",
  },
  chargeOptionActive: {
    borderColor: "#00eaff",
    backgroundColor: "rgba(0,234,255,0.12)",
  },
  chargeOptionEmoji: {
    fontSize: 16,
  },
  chargeOptionEmojiActive: {
    transform: [{ translateY: -0.5 }],
  },
  chargeOptionLabel: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
  },
  chargeOptionLabelActive: {
    color: "#ffffff",
  },
  chargeOptionHelper: {
    color: "#9ca3af",
    fontSize: 11,
  },

  infoBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "#0b1117",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  resultTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 10,
  },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },
  metricItem: {
    flex: 1,
  },
  metricItemWide: {
    flex: 1,
  },
  metricLabel: {
    color: "#9ca3af",
    fontSize: 11,
  },
  metricValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  metricHighlight: {
    color: "#00ff5f",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },

  button: {
    marginTop: 14,
    backgroundColor: "#00ff5f",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#02140a",
    fontWeight: "700",
    fontSize: 15,
  },

  favoriteBox: {
    alignItems: "flex-start",
  },
});
