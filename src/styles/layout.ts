import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export const LAYOUT = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.solidBackground, // 22252D
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
});
