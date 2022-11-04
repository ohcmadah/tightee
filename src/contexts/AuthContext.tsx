import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config";

type AuthState = {
  isLoading: boolean;
  user: User | null;
  error: Error | null;
};

const AuthStateContext = createContext<AuthState | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthState["user"]>(null);
  const [error, setError] = useState<AuthState["error"]>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (isLoading) setIsLoading(false);
        setUser(user);
      },
      setError
    );
    return () => unsubscribe();
  }, []);

  return (
    <AuthStateContext.Provider value={{ isLoading, user, error }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const state = useContext(AuthStateContext);
  if (!state) throw new Error("AuthProvider not found");
  return { ...state, isAuthenticated: state.user != null };
};
