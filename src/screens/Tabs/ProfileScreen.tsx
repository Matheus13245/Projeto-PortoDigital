import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
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

// IMPORTA OS AVATARES DAS PERSONAS
import avatarAdvogado from "../../../assets/avatar-advogado.png";
import avatarEstudante from "../../../assets/avatar-estudante.png";
import avatarMotorista from "../../../assets/avatar-motorista.png";

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
        <Text style={{ color: "#fff" }}>Carregando perfil...</Text>
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        {avatarSource ? (
          <Avatar.Image source={avatarSource} size={90} style={styles.avatar} />
        ) : (
          <Avatar.Text label={avatarLabel} size={90} style={styles.avatar} />
        )}

        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* DIVIDER */}
      <Divider style={styles.divider} />

      {/* Veículo */}
      <List.Section title="Veículo" titleStyle={styles.sectionTitle}>
        <List.Item
          title="Modelo Atual"
          description={user.carro.modelo}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          left={(props) => <List.Icon {...props} icon="car" color="#9ca3af" />}
          right={(props) => (
            <List.Icon {...props} icon="chevron-right" color="#fff" />
          )}
          style={styles.listItem}
          onPress={handleChangeCar}
        />
      </List.Section>

      <Divider style={styles.divider} />

      {/* Preferências */}
      <List.Section title="Preferências" titleStyle={styles.sectionTitle}>
        <List.Item
          title="Idioma"
          description="Português (Brasil)"
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          left={(props) => <List.Icon {...props} icon="web" color="#9ca3af" />}
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

      {/* Logout */}
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
  );
};

/* ---------------------------- ESTILOS ---------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1216",
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  center: {
    flex: 1,
    backgroundColor: "#0f1216",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#00eaff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 12,
    color: "#ffffff",
  },
  userEmail: {
    fontSize: 15,
    marginTop: 4,
    color: "#9ca3af",
  },
  divider: {
    backgroundColor: "#23272f",
    height: 1,
    marginVertical: 12,
  },
  sectionTitle: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 6,
  },
  listItem: {
    backgroundColor: "#161b22",
    borderRadius: 12,
    marginBottom: 10,
  },
  listTitle: {
    color: "#ffffff",
  },
  listDescription: {
    color: "#9ca3af",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#d62828",
    borderRadius: 12,
  },
  logoutButtonLabel: {
    fontWeight: "bold",
    color: "#fff",
  },
  versionText: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 10,
    color: "#6b7280",
    fontSize: 12,
  },
});

export default ProfileScreen;
