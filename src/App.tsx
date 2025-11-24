// App.tsx
import "react-native-gesture-handler";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import RootNavigator from "./navigation/RootNavigator";
import { AuthProvider } from "./context/AuthContext";
import { VehicleProvider } from "./context/VehicleContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <VehicleProvider>
            <RootNavigator />
          </VehicleProvider>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}







