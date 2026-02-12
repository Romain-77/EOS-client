import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import authService from "../services/auth.service";

interface LoginCredentials {
    email: string;
    password?: string;
}

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (_err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    checkUser();
}, []);

    const login = async (credentials: LoginCredentials) => {
        try {
        const userData = await authService.login(credentials);
        setUser(userData);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error("Erreur lors de la déconnexion", err);
        } finally {
            setUser(null);
        }
    };

    return (
    <AuthContext.Provider value= {{ user, login, logout, loading}}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé dans un AuthProvider");
    }
    return context;
};