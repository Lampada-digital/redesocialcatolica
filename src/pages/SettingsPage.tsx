import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Shield, Bell, Eye, Palette, Globe, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

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
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">Configurações</h1>
        <p className="text-sm text-warm-500 mt-0.5">Gerencie sua conta e preferências</p>
      </div>

      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-warm-50">
          {sections.map(section => (
            <button key={section.id} onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-warm-50 transition-all text-left ${activeSection === section.id ? 'bg-navy-50' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeSection === section.id ? 'bg-navy-100' : 'bg-warm-100'}`}>
                <section.icon size={18} className={activeSection === section.id ? 'text-navy-600' : 'text-warm-500'} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-warm-800">{section.label}</p>
                <p className="text-xs text-warm-500">{section.description}</p>
              </div>
              <ChevronRight size={16} className="text-warm-400" />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
        {activeSection === 'account' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-navy-800 text-sm uppercase tracking-wider">Informações da Conta</h3>
            <div className="flex items-center gap-4 pb-6 border-b border-warm-100">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-2xl font-serif font-bold">{user?.name?.charAt(0)}</div>
              <div>
                <button className="px-4 py-2 bg-navy-700 text-white text-sm font-semibold rounded-xl hover:bg-navy-800">Alterar foto</button>
                <p className="text-xs text-warm-400 mt-2">JPG ou PNG. Máximo 5MB.</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Nome', value: user?.name },
                { label: 'Username', value: `@${user?.username}` },
                { label: 'E-mail', value: 'maria@email.com' },
                { label: 'Santo de devoção', value: user?.patronSaint },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-xs font-semibold text-warm-700 mb-1.5 uppercase tracking-wider">{field.label}</label>
                  <input type="text" defaultValue={field.value} className="w-full px-4 py-2.5 border border-warm-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 text-warm-700" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-warm-700 mb-1.5 uppercase tracking-wider">Biografia</label>
                <textarea defaultValue={user?.bio} rows={3} className="w-full px-4 py-2.5 border border-warm-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy-500 resize-none text-warm-700" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button className="px-6 py-2.5 bg-navy-700 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-all">Salvar alterações</button>
            </div>
          </div>
        )}

        {activeSection === 'privacy' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-navy-800 text-sm uppercase tracking-wider">Privacidade</h3>
            <div className="space-y-4">
              {[
                { label: 'Perfil público', description: 'Qualquer pessoa pode ver seu perfil', enabled: true },
                { label: 'Mostrar lista de amigos', description: 'Outros podem ver seus amigos', enabled: true },
                { label: 'Mostrar paróquia', description: 'Exibir paróquia no perfil', enabled: true },
                { label: 'Mostrar cidade', description: 'Exibir cidade no perfil', enabled: false },
                { label: 'Permitir mensagens de desconhecidos', description: 'Receber mensagens de quem não é amigo', enabled: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-warm-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-warm-700">{item.label}</p>
                    <p className="text-xs text-warm-500 mt-0.5">{item.description}</p>
                  </div>
                  <div className={`w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-all ${item.enabled ? 'bg-navy-600 justify-end' : 'bg-warm-200 justify-start'}`}>
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeSection === 'notifications' || activeSection === 'security' || activeSection === 'appearance' || activeSection === 'language' || activeSection === 'help') && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {sections.find(s => s.id === activeSection)?.icon && (() => { const Icon = sections.find(s => s.id === activeSection)!.icon; return <Icon size={24} className="text-warm-400" />; })()}
            </div>
            <p className="text-warm-600 font-medium">{sections.find(s => s.id === activeSection)?.label}</p>
            <p className="text-sm text-warm-400 mt-1">Em breve mais opções estarão disponíveis</p>
          </div>
        )}
      </div>

      <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 bg-wine-50 text-wine-700 font-semibold rounded-2xl hover:bg-wine-100 transition-all border border-wine-100">
        <LogOut size={16} /> Sair da conta
      </button>
    </div>
  );
}
