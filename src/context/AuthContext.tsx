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
  autonomiaMaxima?: number; // opcional, pra melhorar o cálculo se você quiser depois
};

export type User = {
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
  updateBattery: (level: number) => void; // << NOVO
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
      autonomiaMaxima: 650, // opcional, só pra deixar mais realista
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
      autonomiaMaxima: 400,
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
      autonomiaMaxima: 320,
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
        autonomiaMaxima: 250,
      },
    };

    FIXED_USERS.push(newUser);
    const { password: _pw, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
  };

  const signOut = async () => setUser(null);

  // 🔋 atualizar nível de bateria (25, 45, 60, 85...)
  const updateBattery = (level: number) => {
    setUser((prev) => {
      if (!prev) return prev;

      const { carro } = prev;

      // tenta descobrir uma autonomia máxima razoável
      const autonomiaBase =
        carro.autonomiaMaxima ??
        (carro.bateriaPercent > 0
          ? carro.autonomiaKm / (carro.bateriaPercent / 100)
          : carro.autonomiaKm);

      const novaAutonomiaKm = Math.round(autonomiaBase * (level / 100));

      return {
        ...prev,
        carro: {
          ...carro,
          bateriaPercent: level,
          autonomiaKm: novaAutonomiaKm,
        },
      };
    });
  };

  const value = useMemo(
    () => ({
      user,
      signIn,
      signUp,
      signOut,
      updateBattery, // << incluído no provider
    }),
    [user]
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
  return ctx;
}
