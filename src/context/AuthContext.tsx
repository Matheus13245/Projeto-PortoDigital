import React, { createContext, useContext, useMemo, useState } from "react";

type User = { id: string; name?: string; email: string };

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Dois usuários fixos (mock)
const FIXED_USERS = [
  { id: "u1", name: "Alice", email: "alice@ev.com", password: "123456" },
  { id: "u2", name: "Bob",   email: "bob@ev.com",   password: "654321" },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    const found = FIXED_USERS.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Credenciais inválidas.");
    setUser({ id: found.id, name: found.name, email: found.email });
  };

  // Cadastro “fake”: não salva, apenas entra
  const signUp = async (name: string, email: string, _password: string) => {
    setUser({ id: "temp", name, email });
  };

  const signOut = async () => setUser(null);

  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  return ctx;
}
