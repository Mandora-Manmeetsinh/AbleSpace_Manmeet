import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout } from 'lucide-react';

export const Navbar: React.FC = () => {
    const { user } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/50 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 flex items-center justify-between">
            <div className="flex items-center gap-2.5 group cursor-pointer">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                    <Layout className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-sm tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">TaskFlow</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-3 pr-1.5 py-1 rounded-full bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <span className="text-xs font-medium text-muted-foreground hidden md:block">
                        {user?.name}
                    </span>
                    <div className="w-6 h-6 bg-gradient-to-tr from-zinc-700 to-zinc-600 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </nav>
    );
};
