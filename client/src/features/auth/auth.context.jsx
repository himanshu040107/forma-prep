import { createContext, useState,useEffect } from "react";
import { getMe } from "./services/auth.api.js";
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data?.user ?? null);
      } catch (error) {
        setUser(null);
        console.error("Failed to fetch user:", error);
      } finally {
        setAuthReady(true);
      }
    };

    fetchUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, authReady }}>
      {children}
    </AuthContext.Provider>
  );
};
