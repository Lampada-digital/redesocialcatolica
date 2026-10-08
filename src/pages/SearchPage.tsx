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

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.username.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredParishes = parishes.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.city.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar pessoas, comunidades, paróquias, eventos..."
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-700"
            autoFocus
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {query ? (
        <div className="space-y-6">
          {/* People */}
          {(activeTab === 'all' || activeTab === 'people') && filteredUsers.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <Users size={16} className="text-primary-600" />
                <h3 className="font-semibold text-sm text-slate-800">Pessoas</h3>
                <span className="text-xs text-slate-400 ml-auto">{filteredUsers.length} resultado(s)</span>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                        {user.isVerified && (
                          <span className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">@{user.username} · {user.city}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg hover:bg-primary-100">
                      Ver perfil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communities */}
          {(activeTab === 'all' || activeTab === 'communities') && filteredCommunities.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <BookOpen size={16} className="text-green-600" />
                <h3 className="font-semibold text-sm text-slate-800">Comunidades</h3>
                <span className="text-xs text-slate-400 ml-auto">{filteredCommunities.length} resultado(s)</span>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredCommunities.map(comm => (
                  <div key={comm.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                    <img src={comm.avatar} alt="" className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800">{comm.name}</p>
                      <p className="text-xs text-slate-500">{comm.members.toLocaleString()} membros · {comm.category}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100">
                      {comm.isMember ? 'Membro' : 'Participar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parishes */}
          {(activeTab === 'all' || activeTab === 'parishes') && filteredParishes.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <Church size={16} className="text-amber-600" />
                <h3 className="font-semibold text-sm text-slate-800">Paróquias</h3>
                <span className="text-xs text-slate-400 ml-auto">{filteredParishes.length} resultado(s)</span>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredParishes.map(parish => (
                  <div key={parish.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Church size={18} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800">{parish.name}</p>
                      <p className="text-xs text-slate-500">{parish.city}/{parish.state} · {parish.diocese}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {activeTab === 'all' && filteredUsers.length === 0 && filteredCommunities.length === 0 && filteredParishes.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">Nenhum resultado encontrado</p>
              <p className="text-sm text-slate-400 mt-1">Tente buscar com outros termos</p>
            </div>
          )}
        </div>
      ) : (
        /* Trending / Suggestions */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-primary-600" />
              <h3 className="font-semibold text-slate-800">Em alta</h3>
            </div>
            <div className="space-y-3">
              {['#Advento', '#Natal', '#MissaDoGalo', '#Oração', '#Comunidade'].map(tag => (
                <div key={tag} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-primary-600">{tag}</span>
                  <span className="text-xs text-slate-400">{Math.floor(Math.random() * 500 + 100)} publicações</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Pessoas sugeridas</h3>
            <div className="space-y-3">
              {users.slice(1, 4).map(user => (
                <div key={user.id} className="flex items-center gap-3">
                  <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.city}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700">
                    Seguir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
