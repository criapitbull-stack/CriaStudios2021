import { useState } from 'react';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError('E-mail ou senha incorretos.');
      return;
    }

    onSuccess();
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-ink-300 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </button>
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-gold-400 flex items-center justify-center font-display font-bold text-white text-2xl mx-auto mb-4 shadow-glow">
            C
          </div>
          <h1 className="text-2xl font-bold text-white">Painel do Admin</h1>
          <p className="text-ink-400 text-sm mt-2">Cria Studios — acesso restrito</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-ink-900 rounded-3xl p-8 border border-ink-800 space-y-5"
        >
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-ink-300 mb-1.5">
              <Mail className="w-4 h-4" /> E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-ink-800 border border-ink-700 text-white text-sm focus:outline-none focus:border-rose-400"
              placeholder="admin@criastudios.com"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-ink-300 mb-1.5">
              <Lock className="w-4 h-4" /> Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-ink-800 border border-ink-700 text-white text-sm focus:outline-none focus:border-rose-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold disabled:opacity-50 hover:from-rose-600 hover:to-rose-700 transition-all"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
