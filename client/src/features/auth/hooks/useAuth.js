import { useContext } from "react";
import {
  registerUser,
  loginUser,
  logoutUser as logout,
  getMe,
} from "../services/auth.api.js";
import AuthContext from "../auth.context.jsx";

export const useAuth = () => {
  const { user, setUser, loading, setLoading, authReady } = useContext(AuthContext);
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (!data?.user) throw new Error("Login response did not include a user.");
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await registerUser({ username, email, password });
      const registeredUser = data.user ?? data.data;
      if (!registeredUser) throw new Error("Registration response did not include a user.");
      setUser(registeredUser);
      return registeredUser;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    setLoading(true);
    try {
      const data = await getMe();
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    authReady,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGetMe,
  };
};
