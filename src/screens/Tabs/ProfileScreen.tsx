// src/screens/Tabs/ProfileScreen.tsx
import React, { useState } from "react";
import { View, ScrollView, ImageSourcePropType, SafeAreaView } from "react-native";
import {
  Avatar,
  Text,
  Divider,
  List,
  Button,
  Switch,
} from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";

import avatarAdvogado from "../../../assets/avatar-advogado.png";
import avatarEstudante from "../../../assets/avatar-estudante.png";
import avatarMotorista from "../../../assets/avatar-motorista.png";

import { styles } from "./ProfileScreen.styles";

type RootStackParams = {
  Start: undefined;
  Profile: undefined;
  CarInfo: undefined;
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParams, "Profile">;
};

// Mapeia o avatar de acordo com o e-mail do usuário
function getAvatarSource(email: string): ImageSourcePropType | null {
  const normalized = email.toLowerCase();
  if (normalized === "advogado@ax.com") return avatarAdvogado;
  if (normalized === "estudante@ax.com") return avatarEstudante;
  if (normalized === "app@ax.com") return avatarMotorista;
  return null;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  const avatarLabel = user.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleLogout = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "Start" }],
    });
  };

  const handleChangeCar = () => {
    navigation.navigate("CarInfo");
  };

  const avatarSource = getAvatarSource(user.email);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* HEADER */}
        <View style={styles.header}>
          {avatarSource ? (
            <Avatar.Image source={avatarSource} size={90} style={styles.avatar} />
          ) : (
            <Avatar.Text label={avatarLabel} size={90} style={styles.avatar} />
          )}

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <Divider style={styles.divider} />

        {/* VEÍCULO */}
        <List.Section title="Veículo" titleStyle={styles.sectionTitle}>
          <List.Item
            title="Modelo Atual"
            description={user.carro.modelo}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            left={(props) => (
              <List.Icon {...props} icon="car" color="#9ca3af" />
            )}
            right={(props) => (
              <List.Icon {...props} icon="chevron-right" color="#fff" />
            )}
            style={styles.listItem}
            onPress={handleChangeCar}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* PREFERÊNCIAS */}
        <List.Section title="Preferências" titleStyle={styles.sectionTitle}>
          <List.Item
            title="Idioma"
            description="Português (Brasil)"
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            left={(props) => (
              <List.Icon {...props} icon="web" color="#9ca3af" />
            )}
            style={styles.listItem}
          />

          <List.Item
            title="Notificações"
            titleStyle={styles.listTitle}
            left={(props) => (
              <List.Icon {...props} icon="bell" color="#9ca3af" />
            )}
            right={() => (
              <Switch
                value={isNotificationsEnabled}
                onValueChange={setIsNotificationsEnabled}
              />
            )}
            style={styles.listItem}
          />

          <List.Item
            title="Acessibilidade"
            titleStyle={styles.listTitle}
            left={(props) => (
              <List.Icon {...props} icon="account" color="#9ca3af" />
            )}
            right={(props) => (
              <List.Icon {...props} icon="chevron-right" color="#fff" />
            )}
            style={styles.listItem}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* LOGOUT */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonLabel}
          icon="logout"
        >
          Sair
        </Button>

        <Text style={styles.versionText}>Versão 1.0.0 • Squad 24 BB</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
