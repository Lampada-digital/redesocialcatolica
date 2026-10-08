import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home, Users, MessageCircle, Bell, Search, Calendar, Cross,
  Church, Settings, LogOut, Menu, X, BookOpen, Heart,
  User, ChevronDown, Plus
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, currentPage, setCurrentPage, logout, unreadNotifications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'feed', label: 'Início', icon: Home },
    { id: 'communities', label: 'Comunidades', icon: Users },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'prayer', label: 'Oração', icon: Cross },
    { id: 'parishes', label: 'Paróquias', icon: Church },
    { id: 'messages', label: 'Mensagens', icon: MessageCircle },
  ];

  const sideItems = [
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell, badge: unreadNotifications },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button
              onClick={() => setCurrentPage('feed')}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <Cross size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 hidden sm:block">Communio</span>
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Search & User */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('search')}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 lg:hidden"
            >
              <Search size={20} />
            </button>

            <button
              onClick={() => setCurrentPage('notifications')}
              className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600"
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100"
              >
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                  {user?.name.split(' ')[0]}
                </span>
                <ChevronDown size={16} className="hidden md:block text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-medium text-slate-800">{user?.name}</p>
                    <p className="text-sm text-slate-500">@{user?.username}</p>
                  </div>
                  <button
                    onClick={() => { setCurrentPage('profile'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <User size={18} /> Meu Perfil
                  </button>
                  <button
                    onClick={() => { setCurrentPage('settings'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Settings size={18} /> Configurações
                  </button>
                  <hr className="my-2 border-slate-100" />
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} /> Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative bg-white w-72 h-full shadow-xl overflow-y-auto animate-slide-in">
            <div className="p-4 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
              <hr className="my-3 border-slate-100" />
              {sideItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                  {item.badge ? (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16 lg:pl-64">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 flex-col">
          <div className="p-4 space-y-1 flex-1 overflow-y-auto">
            <button
              onClick={() => setCurrentPage('profile')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 mb-4"
            >
              <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full" />
              <div className="text-left">
                <p className="font-semibold text-slate-800">{user?.name.split(' ')[0]}</p>
                <p className="text-xs text-slate-500">@{user?.username}</p>
              </div>
            </button>

            <hr className="border-slate-100 mb-3" />

            {sideItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon size={20} />
                {item.label}
                {item.badge ? (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}

            <hr className="border-slate-100 my-3" />

            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Minhas Comunidades
              </p>
              {['Jovens Católicos', 'Estudos Teológicos', 'Pastoral da Família'].map(name => (
                <button
                  key={name}
                  onClick={() => setCurrentPage('communities')}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
                >
                  <div className="w-6 h-6 bg-primary-100 rounded-md flex items-center justify-center">
                    <Users size={12} className="text-primary-600" />
                  </div>
                  <span className="truncate">{name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentPage('settings')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100"
            >
              <Settings size={16} />
              Configurações
            </button>
          </div>
        </aside>

        {/* Page Content */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-50">
        <div className="flex items-center justify-around h-16">
          {[
            { id: 'feed', icon: Home, label: 'Início' },
            { id: 'communities', icon: Users, label: 'Comunidades' },
            { id: 'search', icon: Search, label: 'Buscar' },
            { id: 'messages', icon: MessageCircle, label: 'Chat' },
            { id: 'profile', icon: User, label: 'Perfil' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl ${
                currentPage === item.id ? 'text-primary-600' : 'text-slate-400'
              }`}
            >
              <item.icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </div>
  );
}
