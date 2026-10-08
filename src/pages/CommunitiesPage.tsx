import { useState } from 'react';
import { communities } from '../data/mockData';
import { Users, Search, Plus, Globe, Lock, EyeOff, TrendingUp } from 'lucide-react';

export default function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'member' | 'explore'>('all');

  const filtered = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'member' && c.isMember) || (filter === 'explore' && !c.isMember);
    return matchesSearch && matchesFilter;
  });

  const typeIcon = (type: string) => {
    switch (type) {
      case 'PUBLIC': return <Globe size={12} className="text-emerald-500" />;
      case 'PRIVATE': return <Lock size={12} className="text-gold-600" />;
      case 'SECRET': return <EyeOff size={12} className="text-wine-500" />;
      default: return <Globe size={12} />;
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy-900">Comunidades</h1>
          <p className="text-sm text-warm-500 mt-0.5">Encontre e participe de comunidades de fé</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-navy-700 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-all shadow-sm">
          <Plus size={16} /> Criar comunidade
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar comunidades..."
            className="w-full pl-10 pr-4 py-2.5 border border-warm-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 text-warm-700 placeholder:text-warm-400" />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'member', label: 'Membro' },
            { value: 'explore', label: 'Explorar' },
          ].map(f => (
            <button key={f.value} onClick={() => setFilter(f.value as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f.value ? 'bg-navy-100 text-navy-700' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="bg-gradient-to-r from-navy-50 to-ivory-100 rounded-2xl border border-navy-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-navy-600" />
          <span className="font-semibold text-navy-800 text-sm">Em alta</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {communities.slice(0, 3).map(c => (
            <div key={c.id} className="flex-shrink-0 flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 border border-warm-100 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center">
                <Users size={16} className="text-navy-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-warm-800">{c.name}</p>
                <p className="text-[10px] text-warm-500">{c.members.toLocaleString()} membros</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(community => (
          <div key={community.id} className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden hover:shadow-md hover:border-navy-200 transition-all cursor-pointer group">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users size={20} className="text-navy-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-warm-800 text-sm truncate">{community.name}</h3>
                    {typeIcon(community.type)}
                  </div>
                  <p className="text-xs text-warm-500 mt-0.5">{community.members.toLocaleString()} membros · {community.category}</p>
                </div>
              </div>
              <p className="text-sm text-warm-600 mt-3 line-clamp-2 leading-relaxed">{community.description}</p>
              <div className="mt-4 flex items-center justify-between">
                {community.isMember ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-50 text-navy-700 text-xs font-semibold rounded-lg">
                    ✓ Membro
                  </span>
                ) : (
                  <button className="px-4 py-1.5 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-all">
                    Participar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-warm-100">
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-warm-400" />
          </div>
          <p className="text-warm-600 font-medium">Nenhuma comunidade encontrada</p>
          <p className="text-sm text-warm-400 mt-1">Tente alterar os filtros de busca</p>
        </div>
      )}
    </div>
  );
}
