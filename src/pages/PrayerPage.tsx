import { useState } from 'react';
import { prayerIntentions, formatTimeAgo } from '../data/mockData';
import { Cross, Heart, Plus, Send } from 'lucide-react';

export default function PrayerPage() {
  const [intentions, setIntentions] = useState(prayerIntentions);
  const [newIntention, setNewIntention] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handlePray = (id: string) => {
    setIntentions(prev => prev.map(i =>
      i.id === id ? { ...i, isPraying: !i.isPraying, prayersCount: i.isPraying ? i.prayersCount - 1 : i.prayersCount + 1 } : i
    ));
  };

  const totalPrayers = intentions.reduce((acc, i) => acc + i.prayersCount, 0);

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-200/50">
          <Cross size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">Intenções de Oração</h1>
        <p className="text-sm text-warm-500 mt-1">Compartilhe suas intenções e reze pelos irmãos</p>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-gold-50 to-ivory-100 rounded-2xl border border-gold-200 p-5">
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
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-5 text-center">
        <p className="text-warm-600 italic font-serif text-sm leading-relaxed">
          "Confessai vossos pecados uns aos outros e orai uns pelos outros, para que sejais curados."
        </p>
        <p className="text-xs text-warm-400 mt-2 font-medium">— Tiago 5,16</p>
      </div>

      {/* Create */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="w-full flex items-center gap-3 p-4 hover:bg-warm-50 transition-all">
            <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
              <Plus size={20} className="text-gold-600" />
            </div>
            <span className="text-sm text-warm-500">Compartilhar uma intenção de oração...</span>
          </button>
        ) : (
          <div className="p-4 space-y-3">
            <textarea value={newIntention} onChange={e => setNewIntention(e.target.value)}
              placeholder="Compartilhe sua intenção de oração..."
              className="w-full resize-none border border-warm-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-warm-700 placeholder:text-warm-400"
              rows={3} />
            <div className="flex items-center justify-between">
              <button onClick={() => { setShowForm(false); setNewIntention(''); }} className="px-3 py-1.5 text-sm text-warm-500 hover:text-warm-700">Cancelar</button>
              <button onClick={() => {
                if (newIntention.trim()) {
                  const newInt = { ...intentions[0], id: `prayer-${Date.now()}`, content: newIntention, prayersCount: 1, isPraying: true, createdAt: new Date().toISOString() };
                  setIntentions(prev => [newInt, ...prev]);
                  setNewIntention('');
                  setShowForm(false);
                }
              }} disabled={!newIntention.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-gold-500 text-white text-sm font-semibold rounded-lg hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <Send size={14} /> Publicar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Intentions */}
      <div className="space-y-4">
        {intentions.map(intention => (
          <div key={intention.id} className="bg-white rounded-2xl border border-warm-100 shadow-sm p-5 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {intention.author.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-warm-800">{intention.author.name}</span>
                  <span className="text-xs text-warm-400">{formatTimeAgo(intention.createdAt)}</span>
                </div>
                <p className="text-sm text-warm-600 mt-2 leading-relaxed">{intention.content}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-warm-100 flex items-center justify-between">
              <button onClick={() => handlePray(intention.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  intention.isPraying ? 'bg-gold-100 text-gold-700' : 'bg-warm-100 text-warm-600 hover:bg-gold-50 hover:text-gold-700'
                }`}>
                <Cross size={16} />
                {intention.isPraying ? 'Rezando' : 'Estou rezando por você'}
              </button>
              <div className="flex items-center gap-1.5 text-sm text-warm-500">
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
