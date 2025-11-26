// src/screens/Tabs/MapScreen.styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.solidBackground, // #22252D
  },

  map: {
    flex: 1,
  },

  center: {
    flex: 1,
    backgroundColor: COLORS.solidBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Botão "Posto mais próximo" – verde AX, acima da estrela
  nearestButton: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 96, // sobe para não ficar em cima da estrela/floating
    backgroundColor: COLORS.primaryButton,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    elevation: 4,
  },
  nearestButtonText: {
    color: COLORS.primaryButtonLabel,
    fontWeight: "700",
    fontSize: 15,
  },
});
