import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/20 selection:text-primary">
            {/* Noise Texture */}
            <div className="noise" />

            {/* Subtle Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/5 rounded-full blur-[100px] opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-30" />
            </div>

            <Navbar />

            <main className="pt-24 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10 animate-in fade-in slide-up duration-500">
                {children}
            </main>
        </div>
    );
};
