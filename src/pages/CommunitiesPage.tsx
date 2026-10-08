import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useCommunities, useJoinCommunity, useLeaveCommunity, useUserCommunities } from '../hooks/useCommunities';
import { Users, Search, Plus, Globe, Lock, EyeOff, TrendingUp } from 'lucide-react';

export default function CommunitiesPage() {
  const { user } = useApp();
  const { data: communitiesData, isLoading } = useCommunities();
  const { data: userCommunitiesData } = useUserCommunities();
  const joinMutation = useJoinCommunity();
  const leaveMutation = useLeaveCommunity();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'member' | 'explore'>('all');

  const communities = communitiesData?.communities || [];
  const userCommunityIds = new Set(userCommunitiesData?.communities?.map((c: any) => c.id) || []);

  const filtered = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isMember = userCommunityIds.has(c.id);
    const matchesFilter = filter === 'all' || (filter === 'member' && isMember) || (filter === 'explore' && !isMember);
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

  const handleJoin = async (communityId: string) => {
    try {
      await joinMutation.mutateAsync(communityId);
    } catch (error) {
      console.error('Erro ao entrar na comunidade:', error);
    }
  };

  const handleLeave = async (communityId: string) => {
    try {
      await leaveMutation.mutateAsync(communityId);
    } catch (error) {
      console.error('Erro ao sair da comunidade:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-warm-200 rounded animate-pulse" />
        <div className="h-32 bg-warm-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-warm-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

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

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-warm-100">
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-warm-400" />
          </div>
          <p className="text-warm-600 font-medium">Nenhuma comunidade encontrada</p>
          <p className="text-sm text-warm-400 mt-1">Tente alterar os filtros de busca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(community => {
            const isMember = userCommunityIds.has(community.id);
            return (
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
                      <p className="text-xs text-warm-500 mt-0.5">{community.members_count?.toLocaleString() || 0} membros · {community.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-warm-600 mt-3 line-clamp-2 leading-relaxed">{community.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    {isMember ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleLeave(community.id); }}
                        disabled={leaveMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-100 text-warm-700 text-xs font-semibold rounded-lg hover:bg-warm-200 transition-all disabled:opacity-50"
                      >
                        {leaveMutation.isPending ? 'Saindo...' : '✓ Membro'}
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleJoin(community.id); }}
                        disabled={joinMutation.isPending}
                        className="px-4 py-1.5 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-all disabled:opacity-50"
                      >
                        {joinMutation.isPending ? 'Entrando...' : 'Participar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
