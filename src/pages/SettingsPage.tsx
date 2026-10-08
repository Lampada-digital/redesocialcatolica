import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User, Shield, Bell, Eye, Palette, Globe, Lock,
  HelpCircle, LogOut, ChevronRight, Moon, Sun
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useApp();
  const [activeSection, setActiveSection] = useState('account');

  const sections = [
    { id: 'account', label: 'Conta', icon: User, description: 'Informações pessoais e login' },
    { id: 'privacy', label: 'Privacidade', icon: Eye, description: 'Controle quem vê seu perfil' },
    { id: 'notifications', label: 'Notificações', icon: Bell, description: 'Gerenciar alertas' },
    { id: 'security', label: 'Segurança', icon: Shield, description: 'Senha e autenticação' },
    { id: 'appearance', label: 'Aparência', icon: Palette, description: 'Tema e visual' },
    { id: 'language', label: 'Idioma', icon: Globe, description: 'Idioma da interface' },
    { id: 'help', label: 'Ajuda', icon: HelpCircle, description: 'Suporte e FAQ' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
        <p className="text-sm text-slate-500">Gerencie sua conta e preferências</p>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-all text-left ${
                activeSection === section.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activeSection === section.id ? 'bg-primary-100' : 'bg-slate-100'
              }`}>
                <section.icon size={20} className={activeSection === section.id ? 'text-primary-600' : 'text-slate-500'} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-800">{section.label}</p>
                <p className="text-xs text-slate-500">{section.description}</p>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Active Section Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {activeSection === 'account' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-slate-800 text-lg">Informações da Conta</h3>
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <img src={user?.avatar} alt="" className="w-20 h-20 rounded-full" />
              <div>
                <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700">
                  Alterar foto
                </button>
                <p className="text-xs text-slate-400 mt-2">JPG ou PNG. Máximo 5MB.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                  <input
                    type="text"
                    defaultValue={user?.username}
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                <input
                  type="email"
                  defaultValue="maria@email.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Biografia</label>
                <textarea
                  defaultValue={user?.bio}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none text-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Santo de devoção</label>
                <input
                  type="text"
                  defaultValue={user?.patronSaint}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-all">
                Salvar alterações
              </button>
            </div>
          </div>
        )}

        {activeSection === 'privacy' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-slate-800 text-lg">Privacidade</h3>
            <div className="space-y-4">
              {[
                { label: 'Perfil público', description: 'Qualquer pessoa pode ver seu perfil', enabled: true },
                { label: 'Mostrar lista de amigos', description: 'Outros podem ver seus amigos', enabled: true },
                { label: 'Mostrar paróquia', description: 'Exibir paróquia no perfil', enabled: true },
                { label: 'Mostrar cidade', description: 'Exibir cidade no perfil', enabled: false },
                { label: 'Permitir mensagens de desconhecidos', description: 'Receber mensagens de quem não é amigo', enabled: false },
                { label: 'Intenções de oração visíveis', description: 'Outros podem ver suas intenções', enabled: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                  <div className={`w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-all ${
                    item.enabled ? 'bg-primary-600 justify-end' : 'bg-slate-200 justify-start'
                  }`}>
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-slate-800 text-lg">Segurança</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Senha</p>
                    <p className="text-xs text-slate-500">Última alteração: há 30 dias</p>
                  </div>
                  <button className="ml-auto px-3 py-1.5 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg">
                    Alterar
                  </button>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Autenticação em dois fatores</p>
                    <p className="text-xs text-slate-500">Adicione uma camada extra de segurança</p>
                  </div>
                  <button className="ml-auto px-3 py-1.5 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg">
                    Ativar
                  </button>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Sessões ativas</p>
                    <p className="text-xs text-slate-500">2 dispositivos conectados</p>
                  </div>
                  <button className="ml-auto px-3 py-1.5 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg">
                    Encerrar todas
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-slate-800 text-lg">Aparência</h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Tema</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Claro', icon: Sun, active: true },
                  { label: 'Escuro', icon: Moon, active: false },
                  { label: 'Sistema', icon: Palette, active: false },
                ].map(theme => (
                  <button
                    key={theme.label}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme.active ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <theme.icon size={24} className={theme.active ? 'text-primary-600' : 'text-slate-400'} />
                    <span className={`text-sm font-medium ${theme.active ? 'text-primary-700' : 'text-slate-600'}`}>
                      {theme.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeSection === 'notifications' || activeSection === 'language' || activeSection === 'help') && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeSection === 'notifications' && <Bell size={24} className="text-slate-400" />}
              {activeSection === 'language' && <Globe size={24} className="text-slate-400" />}
              {activeSection === 'help' && <HelpCircle size={24} className="text-slate-400" />}
            </div>
            <p className="text-slate-600 font-medium">
              {activeSection === 'notifications' && 'Configurações de notificação'}
              {activeSection === 'language' && 'Idioma: Português (Brasil)'}
              {activeSection === 'help' && 'Central de ajuda'}
            </p>
            <p className="text-sm text-slate-400 mt-1">Em breve mais opções estarão disponíveis</p>
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-medium rounded-2xl hover:bg-red-100 transition-all"
      >
        <LogOut size={18} />
        Sair da conta
      </button>
    </div>
  );
}
