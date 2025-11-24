import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Avatar,
  Text,
  Divider,
  List,
  Button,
  Switch,
  useTheme,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface UserData {
  nome: string;
  email: string;
  modeloCarro: string;
}

// Se você tiver o RootStackParams, use ele aqui.
type RootStackParams = {
  Start: undefined;
  Profile: undefined;
  CarInfo: undefined;
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParams, 'Profile'>;
};

const USER_DATA: UserData = {
  nome: 'Usuário Qualquerr',
  email: 'usuario@email.com',
  modeloCarro: 'Tesla Model X',
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Start' }],
    });

    console.log('Usuário deslogado.');
  };

  const handleChangeCar = () => {
        navigation.reset({
      index: 0,
      routes: [{ name: 'CarInfo' }],
    });

    console.log('Navegando para seleção de carro...');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.userName}>{USER_DATA.nome}</Text>
        <Text style={styles.userEmail}>{USER_DATA.email}</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Veículo */}
      <List.Section title="Veículo">
        <List.Item
          title="Modelo Atual"
          description={USER_DATA.modeloCarro}
          left={(props) => <List.Icon {...props} icon="car" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleChangeCar}
        />
      </List.Section>

      <Divider style={styles.divider} />

      {/* Preferências */}
      <List.Section title="Preferências">
        <List.Item
          title="Idioma"
          description="Português (Brasil)"
          left={(props) => <List.Icon {...props} icon="web" />}
        />

        <List.Item
          title="Notificações"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={isNotificationsEnabled}
              onValueChange={setIsNotificationsEnabled}
            />
          )}
        />

        <List.Item
          title="Acessibilidade"
          left={(props) => <List.Icon {...props} icon="accessibility" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
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

      <Text style={styles.versionText}>Versão 1.0.0 - Squad 24 BB</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#333333',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#E53935',
  },
  logoutButtonLabel: {
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: '#666666',
  },
});

export default ProfileScreen;