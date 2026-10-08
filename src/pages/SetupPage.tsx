import { useState } from 'react';
import { Database, Key, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { resetSupabaseClient } from '../lib/supabase';

export default function SetupPage() {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validar URL
    try {
      new URL(supabaseUrl);
    } catch {
      setError('URL do Supabase inválida');
      setLoading(false);
      return;
    }

    // Validar chave (deve ter pelo menos 20 caracteres)
    if (supabaseKey.length < 20) {
      setError('Chave anon inválida');
      setLoading(false);
      return;
    }

    // Salvar no localStorage
    localStorage.setItem('supabase_url', supabaseUrl);
    localStorage.setItem('supabase_anon_key', supabaseKey);

    // Resetar o cliente Supabase para que seja recriado com as novas credenciais
    resetSupabaseClient();

    // Recarregar a página para aplicar as configurações
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-gold-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-warm-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Database size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-navy-900">Configurar Supabase</h1>
            <p className="text-warm-600 mt-2 text-sm">
              Para usar a Communio, você precisa configurar o Supabase
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-warm-700 mb-2">
                <div className="flex items-center gap-2">
                  <Database size={16} />
                  URL do Projeto Supabase
                </div>
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://seu-projeto.supabase.co"
                className="w-full px-4 py-3 border border-warm-200 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all text-sm"
                required
              />
              <p className="text-xs text-warm-500 mt-1">
                Encontre em: Project Settings → API → Project URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-warm-700 mb-2">
                <div className="flex items-center gap-2">
                  <Key size={16} />
                  Chave Anon (pública)
                </div>
              </label>
              <input
                type="text"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-3 border border-warm-200 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all text-sm font-mono"
                required
              />
              <p className="text-xs text-warm-500 mt-1">
                Encontre em: Project Settings → API → anon public key
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-navy-700 to-navy-800 text-white font-semibold rounded-xl hover:from-navy-800 hover:to-navy-900 transition-all shadow-lg shadow-navy-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Salvar e Continuar
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-1">Não tem um projeto Supabase?</p>
                <p>
                  Crie um gratuitamente em{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-900"
                  >
                    supabase.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800">
                <p className="font-semibold mb-1">Importante:</p>
                <p>
                  Após criar o projeto no Supabase, execute as migrations SQL disponíveis em{' '}
                  <code className="bg-amber-100 px-1 rounded">supabase/migrations/</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
