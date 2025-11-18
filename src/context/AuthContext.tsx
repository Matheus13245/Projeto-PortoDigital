import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

export type CarTelemetry = {
  model: string;
  warning: string; // ex.: "200 km - recarregue"
  batteryKm: number;
  batteryPercent: number;
  batteryPowerKw: number;
  lastChargeInfo: string; // ex.: "Última recarga há 4 dias"
  interiorTemp: number; // em °C
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "Advogado" | "Motorista de aplicativo" | "Estudante de Computação";
  car: CarTelemetry;
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// -------------- PERSONAS MOCKADAS --------------

// 1. Advogado – Dr. Rafael Andrade
// Vida real da persona:
// - Usa muito o carro entre Boa Viagem, Centro, Olinda, Jaboatão e interior.
// - Muito trânsito + ar-condicionado → autonomia real menor.
// - Valoriza status -> aqui usamos um carro "de vitrine" (tipo um Tesla Model X).
const rafael: User & { password: string } = {
  id: "rafael",
  name: "Dr. Rafael Andrade",
  email: "rafael.andrade@evapp.com",
  role: "Advogado",
  password: "rafa123", // senha mock
  car: {
    model: "Tesla Model X",
    warning: "200 km - recarregue",
    // Considerando que ele faz deslocamentos médios/longos e pega trânsito:
    batteryKm: 200,
    batteryPercent: 45, // autonomia já abaixo do ideal para viagens longas
    batteryPowerKw: 120, // potência aproximada do pack / instantâneo
    lastChargeInfo: "Última recarga há 4 dias",
    interiorTemp: 21, // ar sempre ligado nos trajetos
  },
};

// 2. Motorista de aplicativo – João Silva
// Vida real da persona:
// - Roda 200–250 km/dia, muitas horas em trânsito pesado.
// - Vive "esprimido" na autonomia, muitas paradas para recarga.
// - Perde corrida quando precisa parar para carregar.
const joao: User & { password: string } = {
  id: "joao",
  name: "João Silva",
  email: "joao.silva@evapp.com",
  role: "Motorista de aplicativo",
  password: "joao123",
  car: {
    model: "Renault Kwid E-Tech",
    warning: "Autonomia baixa - recarregue logo",
    // Depois de um turno longo de corridas:
    batteryKm: 60,
    batteryPercent: 18, // bem no limite pra continuar rodando
    batteryPowerKw: 48,
    lastChargeInfo: "Última recarga há 3 horas",
    interiorTemp: 23, // entra e sai de passageiro o tempo todo
  },
};

// 3. Estudante – Mariana Silva
// Vida real da persona:
// - BYD Dolphin, uso urbano moderado (30–50 km/dia).
// - Carrega em casa à noite; normalmente está com bateria alta.
// - Preocupação com custo em horário de pico e falta de eletroposto na UFPE.
const mariana: User & { password: string } = {
  id: "mariana",
  name: "Mariana Silva",
  email: "mariana.silva@evapp.com",
  role: "Estudante de Computação",
  password: "mari123",
  car: {
    model: "BYD Dolphin",
    warning: "Autonomia confortável para o dia",
    batteryKm: 280,
    batteryPercent: 82, // quase cheia depois de carga noturna
    batteryPowerKw: 44,
    lastChargeInfo: "Última recarga ontem à noite",
    interiorTemp: 24, // uso urbano, às vezes janela aberta
  },
};

const FIXED_USERS: Array<User & { password: string }> = [rafael, joao, mariana];

// -------------- CONTEXTO --------------

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
      throw new Error("Credenciais inválidas. Use um dos logins mockados.");
    }

    // não expomos a senha no estado:
    const { password: _p, ...userWithoutPassword } = found;
    setUser(userWithoutPassword);
  };

  // aqui deixamos o signUp só como um mock "genérico"
  const signUp = async (name: string, email: string, _password: string) => {
    const genericUser: User = {
      id: "novo",
      name,
      email,
      role: "Estudante de Computação",
      car: {
        model: "EV Genérico",
        warning: "Dados de telemetria básicos",
        batteryKm: 180,
        batteryPercent: 60,
        batteryPowerKw: 60,
        lastChargeInfo: "Última recarga hoje",
        interiorTemp: 25,
      },
    };
    setUser(genericUser);
  };

  const signOut = async () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      signIn,
      signUp,
      signOut,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}

