import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home, Users, Church, Calendar, Cross, MessageCircle,
  Search, Bell, Settings, LogOut, Menu, X,
  Compass, User, ChevronDown, Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, currentPage, setCurrentPage, logout, unreadNotifications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNav = [
    { id: 'feed', label: 'Início', icon: Home },
    { id: 'communities', label: 'Comunidades', icon: Users },
    { id: 'parishes', label: 'Paróquias', icon: Church },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'prayer', label: 'Oração', icon: Cross },
    { id: 'messages', label: 'Mensagens', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-warm-100' : 'bg-white border-b border-warm-100'
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-warm-100 text-warm-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <button onClick={() => setCurrentPage('feed')} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-navy-700 to-navy-900 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Cross size={16} className="text-gold-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-serif font-bold text-navy-900 leading-none tracking-tight">Communio</h1>
                <p className="text-[10px] text-warm-500 font-medium tracking-wider uppercase">Rede Católica</p>
              </div>
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.slice(0, 5).map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.id ? 'text-navy-800 bg-navy-50' : 'text-warm-600 hover:text-navy-700 hover:bg-warm-100'
                }`}
              >
                <item.icon size={18} strokeWidth={currentPage === item.id ? 2.5 : 2} />
                <span>{item.label}</span>
                {currentPage === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gold-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage('search')} className="p-2.5 rounded-xl hover:bg-warm-100 text-warm-600 hover:text-navy-700 transition-colors" aria-label="Buscar">
              <Search size={20} />
            </button>
            <button onClick={() => setCurrentPage('notifications')} className="relative p-2.5 rounded-xl hover:bg-warm-100 text-warm-600 hover:text-navy-700 transition-colors" aria-label="Notificações">
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-wine-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-warm-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium text-warm-700 max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className="hidden md:block text-warm-400" />
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-warm-100 py-2 z-50 animate-scale-in">
                    <div className="px-4 py-3 border-b border-warm-100">
                      <p className="font-semibold text-warm-800 text-sm">{user?.name}</p>
                      <p className="text-xs text-warm-500">@{user?.username}</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setCurrentPage('profile'); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-warm-700 hover:bg-warm-50 transition-colors">
                        <User size={16} className="text-warm-500" /> Meu Perfil
                      </button>
                      <button onClick={() => { setCurrentPage('settings'); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-warm-700 hover:bg-warm-50 transition-colors">
                        <Settings size={16} className="text-warm-500" /> Configurações
                      </button>
                    </div>
                    <div className="border-t border-warm-100 pt-1">
                      <button onClick={() => { logout(); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-wine-700 hover:bg-wine-50 transition-colors">
                        <LogOut size={16} /> Sair
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative bg-white w-72 h-full shadow-2xl overflow-y-auto animate-slide-in-left">
            <div className="p-4">
              <div className="flex items-center gap-3 p-3 mb-4 bg-warm-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-warm-800 text-sm">{user?.name}</p>
                  <p className="text-xs text-warm-500">@{user?.username}</p>
                </div>
              </div>
              <div className="space-y-0.5">
                {mainNav.map(item => (
                  <button key={item.id} onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      currentPage === item.id ? 'bg-navy-50 text-navy-800' : 'text-warm-600 hover:bg-warm-50 hover:text-warm-800'
                    }`}>
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="my-3 border-t border-warm-100" />
              <div className="space-y-0.5">
                <button onClick={() => { setCurrentPage('search'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-warm-600 hover:bg-warm-50 transition-all">
                  <Compass size={20} /> Explorar
                </button>
                <button onClick={() => { setCurrentPage('notifications'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-warm-600 hover:bg-warm-50 transition-all">
                  <Bell size={20} /> Notificações
                  {unreadNotifications > 0 && (
                    <span className="ml-auto bg-wine-100 text-wine-700 text-xs font-semibold px-2 py-0.5 rounded-full">{unreadNotifications}</span>
                  )}
                </button>
                <button onClick={() => { setCurrentPage('settings'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-warm-600 hover:bg-warm-50 transition-all">
                  <Settings size={20} /> Configurações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="pt-16">
        <div className="max-w-[1440px] mx-auto flex">
          {/* Desktop Sidebar Left */}
          <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 border-r border-warm-100 bg-white">
            <div className="flex-1 overflow-y-auto p-4">
              <button onClick={() => setCurrentPage('profile')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-warm-50 transition-colors mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white font-semibold shadow-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="text-left min-w-0">
                  <p className="font-semibold text-warm-800 text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-warm-500 truncate">@{user?.username}</p>
                </div>
              </button>
              <nav className="space-y-0.5">
                {mainNav.map(item => (
                  <button key={item.id} onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      currentPage === item.id ? 'bg-navy-50 text-navy-800' : 'text-warm-600 hover:bg-warm-50 hover:text-warm-800'
                    }`}>
                    <item.icon size={20} strokeWidth={currentPage === item.id ? 2.5 : 2} />
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="my-4 border-t border-warm-100" />
              <nav className="space-y-0.5">
                <button onClick={() => setCurrentPage('search')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-warm-600 hover:bg-warm-50 hover:text-warm-800 transition-all">
                  <Compass size={20} /> Explorar
                </button>
              </nav>
              <div className="my-4 border-t border-warm-100" />
              <div>
                <p className="px-3 text-xs font-semibold text-warm-400 uppercase tracking-wider mb-2">Minhas Comunidades</p>
                {['Jovens Católicos', 'Estudos Teológicos', 'Pastoral da Família'].map(name => (
                  <button key={name} onClick={() => setCurrentPage('communities')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-warm-600 hover:bg-warm-50 transition-colors">
                    <div className="w-6 h-6 bg-navy-100 rounded-md flex items-center justify-center">
                      <Users size={12} className="text-navy-600" />
                    </div>
                    <span className="truncate">{name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-warm-100">
              <p className="text-[10px] text-warm-400 text-center">© 2024 Communio</p>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0 lg:ml-64 lg:pr-72">
            <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto pb-24 lg:pb-6">
              {children}
            </div>
          </div>

          {/* Desktop Sidebar Right */}
          <aside className="hidden lg:block fixed right-0 top-16 bottom-0 w-72 border-l border-warm-100 bg-white overflow-y-auto">
            <div className="p-5 space-y-5">
              <div className="bg-gradient-to-br from-navy-50 to-ivory-100 rounded-2xl p-5 border border-navy-100">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-gold-600" />
                  <h3 className="text-xs font-semibold text-navy-700 uppercase tracking-wider">Evangelho do Dia</h3>
                </div>
                <p className="text-xs text-navy-600 font-medium mb-2">Mateus 11, 28-30</p>
                <p className="text-sm text-warm-700 font-serif italic leading-relaxed">"Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos darei descanso."</p>
                <button className="mt-3 text-xs font-semibold text-navy-700 hover:text-navy-900 transition-colors">Ler reflexão →</button>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-warm-100 shadow-sm">
                <h3 className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-3">Santo do Dia</h3>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✝️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-warm-800 text-sm">São João Damasceno</p>
                    <p className="text-xs text-warm-500 mt-0.5">Doutor da Igreja · séc. VII</p>
                    <p className="text-xs text-warm-600 mt-1.5 line-clamp-2">Defensor das imagens sagradas e da tradição.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-warm-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-warm-500 uppercase tracking-wider">Próximos Eventos</h3>
                  <button onClick={() => setCurrentPage('events')} className="text-xs text-navy-600 hover:text-navy-800 font-medium">Ver todos</button>
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'Missa do Galo', date: '24', month: 'Dez', time: '23h' },
                    { title: 'Retiro de Advento', date: '20', month: 'Dez', time: '18h' },
                    { title: 'Adoração Eucarística', date: '21', month: 'Dez', time: '22h' },
                  ].map((evt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-navy-50 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy-800 leading-none">{evt.date}</span>
                        <span className="text-[9px] text-navy-500 font-medium">{evt.month}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-warm-800 truncate">{evt.title}</p>
                        <p className="text-xs text-warm-500">{evt.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-wine-50 to-ivory-100 rounded-2xl p-5 border border-wine-100">
                <div className="flex items-center gap-2 mb-3">
                  <Cross size={14} className="text-wine-600" />
                  <h3 className="text-xs font-semibold text-wine-700 uppercase tracking-wider">Intenção em Destaque</h3>
                </div>
                <p className="text-sm text-warm-700 font-serif italic leading-relaxed">"Peço orações pela paz em nossas famílias."</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-warm-500">89 rezando</span>
                  <button onClick={() => setCurrentPage('prayer')} className="text-xs font-semibold text-wine-700 hover:text-wine-900">Rezar agora</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-warm-100 lg:hidden z-50">
        <div className="flex items-center justify-around h-16 px-2">
          {[
            { id: 'feed', icon: Home, label: 'Início' },
            { id: 'communities', icon: Users, label: 'Comunidades' },
            { id: 'prayer', icon: Cross, label: 'Oração' },
            { id: 'search', icon: Compass, label: 'Explorar' },
            { id: 'profile', icon: User, label: 'Perfil' },
          ].map(item => (
            <button key={item.id} onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                currentPage === item.id ? 'text-navy-700' : 'text-warm-400'
              }`}>
              <item.icon size={22} strokeWidth={currentPage === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
