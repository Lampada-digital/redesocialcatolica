import { useState } from 'react';
import { prayerIntentions, formatTimeAgo } from '../data/mockData';
import { Cross, Heart, Plus, Globe, Users, Lock, Send } from 'lucide-react';

export default function PrayerPage() {
  const [intentions, setIntentions] = useState(prayerIntentions);
  const [newIntention, setNewIntention] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handlePray = (id: string) => {
    setIntentions(prev => prev.map(i =>
      i.id === id
        ? { ...i, isPraying: !i.isPraying, prayersCount: i.isPraying ? i.prayersCount - 1 : i.prayersCount + 1 }
        : i
    ));
  };

  const handleSubmit = () => {
    if (newIntention.trim()) {
      const newInt = {
        id: `prayer-${Date.now()}`,
        author: {
          id: 'user-1',
          name: 'Maria Silva',
          username: 'mariasilva',
          avatar: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#3b82f6" rx="50"/><text x="50" y="55" text-anchor="middle" dy=".1em" fill="white" font-size="36" font-family="Inter,sans-serif" font-weight="600">MS</text></svg>'),
          bio: '',
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          patronSaint: 'Nossa Senhora Aparecida',
          interests: [],
          joinedAt: '2024-01-15',
          friendsCount: 234,
          followersCount: 567,
          followingCount: 189,
        },
        content: newIntention,
        prayersCount: 1,
        isPraying: true,
        createdAt: new Date().toISOString(),
        visibility: 'PUBLIC' as const,
      };
      setIntentions(prev => [newInt, ...prev]);
      setNewIntention('');
      setShowForm(false);
    }
  };

  const totalPrayers = intentions.reduce((acc, i) => acc + i.prayersCount, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-200">
          <Cross size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Intenções de Oração</h1>
        <p className="text-sm text-slate-500 mt-1">Compartilhe suas intenções e reze pelos irmãos</p>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-gold-50 to-amber-50 rounded-2xl border border-gold-200 p-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gold-700">{intentions.length}</p>
            <p className="text-xs text-gold-600 font-medium">Intenções</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold-700">{totalPrayers}</p>
            <p className="text-xs text-gold-600 font-medium">Orações</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold-700">🙏</p>
            <p className="text-xs text-gold-600 font-medium">Comunidade</p>
          </div>
        </div>
      </div>

      {/* Scripture */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
        <p className="text-slate-600 italic text-sm leading-relaxed">
          "Confessai vossos pecados uns aos outros e orai uns pelos outros, para que sejais curados."
        </p>
        <p className="text-xs text-slate-400 mt-2">— Tiago 5,16</p>
      </div>

      {/* Create Intention */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-all"
          >
            <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
              <Plus size={20} className="text-gold-600" />
            </div>
            <span className="text-sm text-slate-500">Compartilhar uma intenção de oração...</span>
          </button>
        ) : (
          <div className="p-4 space-y-3">
            <textarea
              value={newIntention}
              onChange={e => setNewIntention(e.target.value)}
              placeholder="Compartilhe sua intenção de oração..."
              className="w-full resize-none border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-slate-700"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-gold-50 text-gold-700 font-medium">
                  <Globe size={12} /> Pública
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowForm(false); setNewIntention(''); }}
                  className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!newIntention.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-gold-500 text-white text-sm font-medium rounded-lg hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={14} />
                  Publicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Intentions List */}
      <div className="space-y-4">
        {intentions.map(intention => (
          <div
            key={intention.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-fade-in"
          >
            <div className="flex items-start gap-3">
              <img src={intention.author.avatar} alt="" className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-800">{intention.author.name}</span>
                  <span className="text-xs text-slate-400">{formatTimeAgo(intention.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{intention.content}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handlePray(intention.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  intention.isPraying
                    ? 'bg-gold-100 text-gold-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-gold-50 hover:text-gold-700'
                }`}
              >
                <Cross size={16} className={intention.isPraying ? 'text-gold-600' : ''} />
                {intention.isPraying ? 'Rezando' : 'Estou rezando por você'}
              </button>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Heart size={14} className="text-gold-500" />
                <span>{intention.prayersCount} orações</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
