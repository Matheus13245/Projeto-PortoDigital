import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

export type CarInfo = {
  modelo: string;
  autonomiaKm: number;
  bateriaPercent: number;
  status: string;
};

export type User = {
  location?: any;
  id: string;
  name?: string;
  email: string;
  carro: CarInfo;
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// 🔥 Usuários mockados (advogado, estudante, motorista de app)
type InternalUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  carro: CarInfo;
};

const FIXED_USERS: InternalUser[] = [
  {
    id: "u1",
    name: "Dr. Rafael Andrade",
    email: "advogado@ax.com",
    password: "123456",
    carro: {
      modelo: "Tesla Model S Long Range",
      autonomiaKm: 420,
      bateriaPercent: 82,
      status: "Autonomia confortável para o dia de trabalho.",
    },
  },
  {
    id: "u2",
    name: "Marina Castro",
    email: "estudante@ax.com",
    password: "123456",
    carro: {
      modelo: "BYD Dolphin",
      autonomiaKm: 310,
      bateriaPercent: 64,
      status: "Modo economia ativado para rotinas campus–casa.",
    },
  },
  {
    id: "u3",
    name: "João Silva",
    email: "app@ax.com",
    password: "123456",
    carro: {
      modelo: "Nissan Leaf Pro",
      autonomiaKm: 190,
      bateriaPercent: 37,
      status: "Recomendado planejar recarga antes do próximo pico.",
    },
  },
// 🔥 Usuários mockados (advogado, estudante, motorista de app)
type InternalUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  carro: CarInfo;
};

const FIXED_USERS: InternalUser[] = [
  {
    id: "u1",
    name: "Dr. Rafael Andrade",
    email: "advogado@ax.com",
    password: "123456",
    carro: {
      modelo: "Tesla Model S Long Range",
      autonomiaKm: 420,
      bateriaPercent: 82,
      status: "Autonomia confortável para o dia de trabalho.",
    },
  },
  {
    id: "u2",
    name: "Marina Castro",
    email: "estudante@ax.com",
    password: "123456",
    carro: {
      modelo: "BYD Dolphin",
      autonomiaKm: 310,
      bateriaPercent: 64,
      status: "Modo economia ativado para rotinas campus–casa.",
    },
  },
  {
    id: "u3",
    name: "João Silva",
    email: "app@ax.com",
    password: "123456",
    carro: {
      modelo: "Nissan Leaf Pro",
      autonomiaKm: 190,
      bateriaPercent: 37,
      status: "Recomendado planejar recarga antes do próximo pico.",
    },
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    const found = FIXED_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!found) {
      throw new Error("Credenciais inválidas.");
    }

    const { password: _pw, ...userWithoutPassword } = found;
    setUser(userWithoutPassword);
    const found = FIXED_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!found) {
      throw new Error("Credenciais inválidas.");
    }

    const { password: _pw, ...userWithoutPassword } = found;
    setUser(userWithoutPassword);
  };

  // cadastro fake: cria um usuário genérico com um carro padrão
  const signUp = async (name: string, email: string, password: string) => {
    const newUser: InternalUser = {
      id: `u${FIXED_USERS.length + 1}`,
      name,
      email,
      password,
      carro: {
        modelo: "Compacto EV Padrão",
        autonomiaKm: 250,
        bateriaPercent: 100,
        status: "Perfil genérico cadastrado.",
      },
    };

    FIXED_USERS.push(newUser);
    const { password: _pw, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
  // cadastro fake: cria um usuário genérico com um carro padrão
  const signUp = async (name: string, email: string, password: string) => {
    const newUser: InternalUser = {
      id: `u${FIXED_USERS.length + 1}`,
      name,
      email,
      password,
      carro: {
        modelo: "Compacto EV Padrão",
        autonomiaKm: 250,
        bateriaPercent: 100,
        status: "Perfil genérico cadastrado.",
      },
    };

    FIXED_USERS.push(newUser);
    const { password: _pw, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
  };

  const signOut = async () => setUser(null);

  const value = useMemo(
    () => ({ user, signIn, signUp, signOut }),
    [user]
  );
  const value = useMemo(
    () => ({ user, signIn, signUp, signOut }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  }
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  }
  return ctx;
}