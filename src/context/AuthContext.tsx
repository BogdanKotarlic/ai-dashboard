import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

export type UserRole = "admin" | "viewer";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<UserRole, User> = {
  admin: {
    id: "1",
    name: "Admin User",
    role: "admin",
  },
  viewer: {
    id: "2",
    name: "Viewer User",
    role: "viewer",
  },
};

const AUTH_STORAGE_KEY = "ai_dashboard_auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAdmin,
    }),
    [user, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
