import "react-native-gesture-handler";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import RootNavigator from "./navigation/RootNavigator";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  // Minimal: sem fonts, sem splash manual, sem persistência
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}







