import React, { useState } from 'react';
import { SignJWT } from 'jose';
import { Logo } from './Logo';
import { Lock } from 'lucide-react';

export default function Login({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const secret = import.meta.env.VITE_PGRST_JWT_SECRET;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!secret) {
            setError('Error de configuración: VITE_PGRST_JWT_SECRET no definido.');
            setIsLoading(false);
            return;
        }

        const cleanUser = username.trim().toLowerCase();
        // Simple hardcoded auth as requested
        const isValid = (cleanUser === 'lillo' || cleanUser === 'coki') && password === '1234';

        if (isValid) {
            try {
                const secretKey = new TextEncoder().encode(secret);
                const jwt = await new SignJWT({ role: 'authenticator', username: cleanUser })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('30d')
                    .sign(secretKey);

                localStorage.setItem('auth_token', jwt);
                localStorage.setItem('username', cleanUser);
                onLoginSuccess();
            } catch (err) {
                console.error(err);
                setError('Error al generar token de sesión.');
            }
        } else {
            setError('Usuario o contraseña incorrectos.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center flex-col items-center">
                    <Logo className="w-16 h-16" showText={false} />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-900 tracking-tight">
                        Intux Finanzas
                    </h2>
                    <p className="mt-2 text-center text-sm text-zinc-600">
                        Ingresa tus credenciales para continuar
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-zinc-200/50 sm:rounded-2xl sm:px-10 border border-zinc-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-zinc-700">
                                Usuario
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                                    placeholder="lillo o coki"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                                    placeholder="••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-500 border-t-white" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Lock size={16} /> Entrar
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
