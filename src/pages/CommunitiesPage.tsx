import { useState } from 'react';
import { communities } from '../data/mockData';
import { Users, Search, Plus, Globe, Lock, EyeOff, Filter, TrendingUp } from 'lucide-react';

export default function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'member' | 'not-member'>('all');
  const [category, setCategory] = useState('all');

  const categories = ['all', 'Juventude', 'Formação', 'Música', 'Pastoral', 'Espiritualidade'];

  const filtered = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'member' && c.isMember) || (filter === 'not-member' && !c.isMember);
    const matchesCategory = category === 'all' || c.category === category;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const typeIcon = (type: string) => {
    switch (type) {
      case 'PUBLIC': return <Globe size={14} className="text-green-500" />;
      case 'PRIVATE': return <Lock size={14} className="text-amber-500" />;
      case 'SECRET': return <EyeOff size={14} className="text-red-500" />;
      default: return <Globe size={14} />;
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case 'PUBLIC': return 'Pública';
      case 'PRIVATE': return 'Privada';
      case 'SECRET': return 'Secreta';
      default: return type;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Comunidades</h1>
          <p className="text-sm text-slate-500">Encontre e participe de comunidades de fé</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-all">
          <Plus size={18} />
          Criar comunidade
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar comunidades..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-700"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 mr-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Filtros:</span>
          </div>
          {[
            { value: 'all', label: 'Todas' },
            { value: 'member', label: 'Membro' },
            { value: 'not-member', label: 'Explorar' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat
                  ? 'bg-gold-100 text-gold-700'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'Todas categorias' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-2xl border border-primary-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={18} className="text-primary-600" />
          <span className="font-semibold text-slate-800 text-sm">Em alta</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {communities.slice(0, 3).map(c => (
            <div key={c.id} className="flex-shrink-0 flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-slate-100">
              <img src={c.avatar} alt="" className="w-8 h-8 rounded-lg" />
              <div>
                <p className="text-xs font-semibold text-slate-800">{c.name}</p>
                <p className="text-[10px] text-slate-500">{c.members.toLocaleString()} membros</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(community => (
          <div
            key={community.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="p-5">
              <div className="flex items-start gap-3">
                <img
                  src={community.avatar}
                  alt={community.name}
                  className="w-14 h-14 rounded-xl group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800 truncate">{community.name}</h3>
                    <span className="flex items-center gap-0.5" title={typeLabel(community.type)}>
                      {typeIcon(community.type)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {community.members.toLocaleString()} membros · {community.category}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-3 line-clamp-2">{community.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">{typeLabel(community.type)}</span>
                {community.isMember ? (
                  <button className="px-4 py-1.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg hover:bg-primary-100 transition-all">
                    Membro ✓
                  </button>
                ) : (
                  <button className="px-4 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-all">
                    Participar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">Nenhuma comunidade encontrada</p>
          <p className="text-sm text-slate-400 mt-1">Tente alterar os filtros de busca</p>
        </div>
      )}
    </div>
  );
}
