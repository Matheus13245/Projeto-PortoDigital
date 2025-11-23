import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

interface Props {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function FloatingButton({ onPress, style }: Props) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    // Tenta navegar na rota atual; se não existir, sobe para parent (root)
    try {
      // tenta navegar direto
      navigation.navigate("FavoritePosts");
    } catch (e) {
      // fallback: tenta no parent
      navigation.getParent()?.navigate?.("FavoritePosts");
    }

    // garantia extra (algumas versões/trees requerem chamar getParent)
    if (!navigation.getState().routeNames.includes("FavoritePosts")) {
      navigation.getParent()?.navigate?.("FavoritePosts");
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { bottom: 20 + insets.bottom },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <Feather name="star" size={26} color="#FFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    backgroundColor: "#1e90ff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
});