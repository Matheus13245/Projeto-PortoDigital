// src/styles/theme.ts
export const COLORS = {
  // fundos
  solidBackground: "#22252D",

  gradientDark1: "#00131D",
  gradientDark2: "#00313A",
  gradientMid: "#00E1A9",
  gradientLight: "#00FFC6",

  // botões
  primaryButton: "#00F5A0",
  primaryButtonText: "#00313A",

  // textos
  textPrimary: "#FFFFFF",
  textSecondary: "#E5E7EB",
  textMuted: "#9CA3AF",

  // cards / inputs
  cardBackground: "#141820",
  inputBackground: "#262C35",
  placeholder: "#8E9AAB",
};

export const MAIN_GRADIENT = {
  colors: [
    COLORS.gradientDark1,
    COLORS.gradientDark2,
    COLORS.gradientMid,
    COLORS.gradientLight,
  ],
  start: { x: 0.5, y: 0 },
  end: { x: 1, y: 1 },
};

// tema padrão pros TextInput do react-native-paper
export const INPUT_THEME = {
  colors: {
    primary: COLORS.primaryButton,
    onSurface: COLORS.textPrimary,
    placeholder: COLORS.placeholder,
    background: COLORS.inputBackground,
  },
};
