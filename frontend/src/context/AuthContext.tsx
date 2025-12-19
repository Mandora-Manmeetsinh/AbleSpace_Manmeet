import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, LoginDto, RegisterDto } from '../types';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginDto) => Promise<void>;
    register: (data: RegisterDto) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user] = useState<User | null>({
        id: 'guest-user-id',
        email: 'guest@taskflow.com',
        name: 'Guest User'
    });
    const [isLoading] = useState(false);

    // Bypass auth check
    useEffect(() => {
        // No-op
    }, []);

    const login = async (_data: LoginDto) => {
        toast.success('Welcome back! (Guest Mode)');
    };

    const register = async (_data: RegisterDto) => {
        toast.success('Account created! (Guest Mode)');
    };

    const logout = async () => {
        toast.success('Logout disabled in Guest Mode');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
