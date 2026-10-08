import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cross, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, register, authError, authLoading } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    if (isRegister) {
      if (!name || !username) {
        setError('Preencha todos os campos');
        setLoading(false);
        return;
      }
      const success = await register(email, password, name, username);
      if (!success) setError(authError || 'Erro ao criar conta');
    } else {
      const success = await login(email, password);
      if (!success) setError(authError || 'Credenciais inválidas');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-navy-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold-500/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold-500/10" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <Cross size={22} className="text-gold-300" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold">Communio</h1>
                <p className="text-xs text-navy-300 tracking-wider uppercase">Rede Social Católica</p>
              </div>
            </div>

            <h2 className="text-4xl font-serif font-light leading-tight mb-6 text-balance">
              Viva sua fé em <span className="text-gold-300 font-normal italic">comunidade</span>.
            </h2>
            <p className="text-navy-200 text-lg leading-relaxed max-w-md">
              Conecte-se com sua paróquia, comunidades e irmãos de fé. Uma rede feita para a vida comunitária católica.
            </p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: 'Comunidade', desc: 'Conecte-se com fiéis de todo o Brasil' },
                { title: 'Oração', desc: 'Compartilhe intenções e reze juntos' },
                { title: 'Paróquias', desc: 'Encontre sua comunidade local' },
                { title: 'Formação', desc: 'Cresça na fé com conteúdo de qualidade' },
              ].map(item => (
                <div key={item.title}>
                  <p className="font-semibold text-sm text-gold-300 mb-1">{item.title}</p>
                  <p className="text-xs text-navy-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-navy-300 italic font-serif">
                "Onde dois ou três estiverem reunidos em meu nome, ali estou eu no meio deles."
              </p>
              <p className="text-xs text-navy-400 mt-2">— Mt 18,20</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-11 h-11 bg-gradient-to-br from-navy-700 to-navy-900 rounded-xl flex items-center justify-center shadow-md">
              <Cross size={20} className="text-gold-300" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-navy-900">Communio</h1>
              <p className="text-[10px] text-warm-500 tracking-wider uppercase">Rede Católica</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-warm-200/50 border border-warm-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-navy-900">
                {isRegister ? 'Crie sua conta' : 'Bem-vindo de volta'}
              </h2>
              <p className="text-warm-500 mt-2 text-sm">
                {isRegister ? 'Junte-se à comunidade católica' : 'Entre na sua conta para continuar'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-warm-700 mb-1.5 uppercase tracking-wider">Nome completo</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome"
                        className="w-full pl-10 pr-4 py-3 border border-warm-200 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all text-sm text-warm-800 placeholder:text-warm-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-warm-700 mb-1.5 uppercase tracking-wider">Username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 text-sm">@</span>
                      <input type="text" value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} placeholder="seu_username"
                        className="w-full pl-10 pr-4 py-3 border border-warm-200 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all text-sm text-warm-800 placeholder:text-warm-400" />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-warm-700 mb-1.5 uppercase tracking-wider">E-mail</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-warm-200 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all text-sm text-warm-800 placeholder:text-warm-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-warm-700 mb-1.5 uppercase tracking-wider">Senha</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-warm-200 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all text-sm text-warm-800 placeholder:text-warm-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-wine-50 border border-wine-200 text-wine-700 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              {!isRegister && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-navy-600 hover:text-navy-800 font-medium">Esqueci minha senha</button>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-navy-700 to-navy-800 text-white font-semibold rounded-xl hover:from-navy-800 hover:to-navy-900 transition-all shadow-lg shadow-navy-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isRegister ? 'Criar conta' : 'Entrar'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-warm-500 text-sm">
                {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
                <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-navy-700 font-semibold hover:text-navy-900">
                  {isRegister ? 'Entrar' : 'Criar conta'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-warm-400 mt-6">
            Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
