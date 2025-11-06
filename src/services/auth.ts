// src/services/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  guest?: boolean;
};

type NewUser = { name: string; email: string; password: string };

const USERS_KEY = '@carroeletrico/users';
const SESSION_KEY = '@carroeletrico/session';

async function loadUsers(): Promise<Array<NewUser & { id: string }>> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveUsers(users: Array<NewUser & { id: string }>) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function signUp(newUser: NewUser): Promise<AuthUser> {
  const users = await loadUsers();
  const exists = users.some(u => u.email === newUser.email.toLowerCase().trim());
  if (exists) {
    throw new Error('E-mail já cadastrado.');
  }
  const user = {
    id: String(Date.now()),
    name: newUser.name.trim(),
    email: newUser.email.toLowerCase().trim(),
    password: newUser.password, // (demo) — nunca salve assim em produção
  };
  users.push(user);
  await saveUsers(users);
  const session: AuthUser = { id: user.id, name: user.name, email: user.email };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const users = await loadUsers();
  const found = users.find(
    u => u.email === email.toLowerCase().trim() && u.password === password
  );
  if (!found) throw new Error('Credenciais inválidas.');
  const session: AuthUser = { id: found.id, name: found.name, email: found.email };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signInAsGuest(): Promise<AuthUser> {
  const guest: AuthUser = {
    id: `guest-${Date.now()}`,
    name: 'Convidado',
    email: 'guest@local',
    guest: true,
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(guest));
  return guest;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export async function signOut(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}


