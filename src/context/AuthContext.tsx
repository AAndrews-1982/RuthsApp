import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type User = { id: string; email: string } | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const signIn = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 200)); // fake API
    setUser({ id: 'demo', email });
  };

  const signOut = () => setUser(null);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, signIn, signOut }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
