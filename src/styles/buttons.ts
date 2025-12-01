import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export const BUTTONS = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primaryButton,
    borderRadius: 999,
    paddingVertical: 12,
  },

  primaryLabel: {
    color: COLORS.primaryButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
});
