import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cross, Eye, EyeOff, Mail, Lock, User, BookOpen, Heart, Users } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    if (isRegister && !name) {
      setError('Preencha seu nome');
      return;
    }
    const success = login(email, password);
    if (!success) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-gold-400/20 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Cross size={28} className="text-gold-300" />
            </div>
            <h1 className="text-4xl font-bold">Communio</h1>
          </div>
          <p className="text-2xl font-light mb-4 leading-relaxed">
            A rede social da comunidade católica.
          </p>
          <p className="text-primary-200 text-lg mb-12 leading-relaxed">
            Conecte-se com sua paróquia, comunidades de fé, e viva sua fé em comunidade no mundo digital.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Users size={22} className="text-gold-300" />
              </div>
              <div>
                <p className="font-semibold">Comunidade</p>
                <p className="text-sm text-primary-200">Conecte-se com fiéis de todo o Brasil</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Heart size={22} className="text-gold-300" />
              </div>
              <div>
                <p className="font-semibold">Oração</p>
                <p className="text-sm text-primary-200">Compartilhe intenções e reze juntos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <BookOpen size={22} className="text-gold-300" />
              </div>
              <div>
                <p className="font-semibold">Formação</p>
                <p className="text-sm text-primary-200">Cresça na fé com conteúdo de qualidade</p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-sm text-primary-300 italic">
              "Onde dois ou três estiverem reunidos em meu nome, ali estou eu no meio deles."
            </p>
            <p className="text-sm text-primary-400 mt-1">— Mt 18,20</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center">
              <Cross size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Communio</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">
                {isRegister ? 'Criar conta' : 'Bem-vindo de volta!'}
              </h2>
              <p className="text-slate-500 mt-2">
                {isRegister
                  ? 'Junte-se à comunidade católica'
                  : 'Entre na sua conta para continuar'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              {!isRegister && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Esqueci minha senha
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-200 active:scale-[0.98]"
              >
                {isRegister ? 'Criar conta' : 'Entrar'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
                <button
                  onClick={() => { setIsRegister(!isRegister); setError(''); }}
                  className="text-primary-600 font-semibold hover:text-primary-700"
                >
                  {isRegister ? 'Entrar' : 'Criar conta'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            © 2024 Communio — Rede Social Católica. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
