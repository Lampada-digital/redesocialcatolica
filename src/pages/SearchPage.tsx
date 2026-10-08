import { useState } from 'react';
import { users, communities, parishes, events } from '../data/mockData';
import { Search, Users, BookOpen, Church, Calendar, TrendingUp } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'communities' | 'parishes' | 'events'>('all');

  const tabs = [
    { id: 'all' as const, label: 'Tudo', icon: Search },
    { id: 'people' as const, label: 'Pessoas', icon: Users },
    { id: 'communities' as const, label: 'Comunidades', icon: BookOpen },
    { id: 'parishes' as const, label: 'Paróquias', icon: Church },
    { id: 'events' as const, label: 'Eventos', icon: Calendar },
  ];

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.username.toLowerCase().includes(query.toLowerCase()));
  const filteredCommunities = communities.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  const filteredParishes = parishes.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.city.toLowerCase().includes(query.toLowerCase()));
  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} autoFocus
            placeholder="Buscar pessoas, comunidades, paróquias, eventos..."
            className="w-full pl-12 pr-4 py-3 border border-warm-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 text-warm-700 placeholder:text-warm-400" />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-navy-100 text-navy-700' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
              }`}>
              <tab.icon size={12} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {query ? (
        <div className="space-y-6">
          {(activeTab === 'all' || activeTab === 'people') && filteredUsers.length > 0 && (
            <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-warm-100 flex items-center gap-2">
                <Users size={14} className="text-navy-600" />
                <h3 className="font-semibold text-sm text-navy-800">Pessoas</h3>
                <span className="text-xs text-warm-400 ml-auto">{filteredUsers.length}</span>
              </div>
              <div className="divide-y divide-warm-50">
                {filteredUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-warm-50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-sm font-semibold">{user.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm text-warm-800">{user.name}</p>
                        {user.isVerified && <span className="w-3.5 h-3.5 bg-navy-600 rounded-full flex items-center justify-center"><svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></span>}
                      </div>
                      <p className="text-xs text-warm-500 truncate">@{user.username} · {user.city}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-navy-50 text-navy-700 text-xs font-semibold rounded-lg hover:bg-navy-100">Ver perfil</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'communities') && filteredCommunities.length > 0 && (
            <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-warm-100 flex items-center gap-2">
                <BookOpen size={14} className="text-emerald-600" />
                <h3 className="font-semibold text-sm text-navy-800">Comunidades</h3>
              </div>
              <div className="divide-y divide-warm-50">
                {filteredCommunities.map(comm => (
                  <div key={comm.id} className="flex items-center gap-3 px-5 py-3 hover:bg-warm-50">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center"><Users size={16} className="text-navy-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-warm-800">{comm.name}</p>
                      <p className="text-xs text-warm-500">{comm.members.toLocaleString()} membros · {comm.category}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-100">{comm.isMember ? 'Membro' : 'Participar'}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'parishes') && filteredParishes.length > 0 && (
            <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-warm-100 flex items-center gap-2">
                <Church size={14} className="text-gold-600" />
                <h3 className="font-semibold text-sm text-navy-800">Paróquias</h3>
              </div>
              <div className="divide-y divide-warm-50">
                {filteredParishes.map(parish => (
                  <div key={parish.id} className="flex items-center gap-3 px-5 py-3 hover:bg-warm-50">
                    <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center"><Church size={16} className="text-navy-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-warm-800">{parish.name}</p>
                      <p className="text-xs text-warm-500">{parish.city}/{parish.state}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'all' && filteredUsers.length === 0 && filteredCommunities.length === 0 && filteredParishes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-warm-100">
              <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-warm-400" />
              </div>
              <p className="text-warm-600 font-medium">Nenhum resultado encontrado</p>
              <p className="text-sm text-warm-400 mt-1">Tente buscar com outros termos</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-navy-600" />
              <h3 className="font-semibold text-navy-800 text-sm">Em alta</h3>
            </div>
            <div className="space-y-3">
              {['#Advento', '#Natal', '#MissaDoGalo', '#Oração', '#Comunidade'].map(tag => (
                <div key={tag} className="flex items-center justify-between py-1.5">
                  <span className="text-sm font-medium text-navy-600">{tag}</span>
                  <span className="text-xs text-warm-400">{Math.floor(Math.random() * 500 + 100)} publicações</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-5">
            <h3 className="font-semibold text-navy-800 text-sm mb-4">Pessoas sugeridas</h3>
            <div className="space-y-3">
              {users.slice(1, 4).map(user => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-sm font-semibold">{user.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-warm-800">{user.name}</p>
                    <p className="text-xs text-warm-500">{user.city}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800">Seguir</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
