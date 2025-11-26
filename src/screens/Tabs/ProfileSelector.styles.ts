// src/screens/Tabs/ProfileSelector.styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/theme";

econst styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.solidBackground,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.solidBackground,
  },
  contentContainer: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 32, // evita colar na tab bar
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.solidBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  // o resto pode ficar como está, só troque "#0f1216" por COLORS.solidBackground
});

