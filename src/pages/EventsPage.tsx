import { events } from '../data/mockData';
import { Calendar, MapPin, Clock, Users, Plus, Church, Heart, Star, BookOpen, PartyPopper } from 'lucide-react';

export default function EventsPage() {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'MISSA': return <Church size={18} className="text-navy-600" />;
      case 'TERCO': return <Heart size={18} className="text-wine-500" />;
      case 'ADORACAO': return <Star size={18} className="text-gold-600" />;
      case 'RETIRIO': return <BookOpen size={18} className="text-purple-600" />;
      case 'CATEQUESE': return <BookOpen size={18} className="text-blue-600" />;
      case 'ENCONTRO': return <Users size={18} className="text-emerald-600" />;
      case 'FORMACAO': return <BookOpen size={18} className="text-indigo-600" />;
      case 'FESTA': return <PartyPopper size={18} className="text-orange-600" />;
      default: return <Calendar size={18} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'MISSA': return 'from-navy-500 to-navy-700';
      case 'TERCO': return 'from-wine-500 to-wine-700';
      case 'ADORACAO': return 'from-gold-500 to-gold-700';
      case 'RETIRIO': return 'from-purple-500 to-purple-700';
      case 'CATEQUESE': return 'from-blue-500 to-blue-700';
      case 'ENCONTRO': return 'from-emerald-500 to-emerald-700';
      case 'FORMACAO': return 'from-indigo-500 to-indigo-700';
      case 'FESTA': return 'from-orange-500 to-orange-700';
      default: return 'from-warm-500 to-warm-700';
    }
  };

  const getEventLabel = (type: string) => {
    const labels: Record<string, string> = {
      MISSA: 'Missa', TERCO: 'Terço', ADORACAO: 'Adoração', RETIRIO: 'Retiro',
      CATEQUESE: 'Catequese', ENCONTRO: 'Encontro', FORMACAO: 'Formação', FESTA: 'Festa',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy-900">Eventos</h1>
          <p className="text-sm text-warm-500 mt-0.5">Missas, retiros, adorações e encontros</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-navy-700 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-all shadow-sm">
          <Plus size={16} /> Criar evento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Próximos', value: events.length, color: 'bg-navy-50 text-navy-700 border-navy-100' },
          { label: 'Esta semana', value: 3, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
          { label: 'Participando', value: 2, color: 'bg-gold-50 text-gold-700 border-gold-100' },
          { label: 'Organizados', value: 1, color: 'bg-purple-50 text-purple-700 border-purple-100' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} border rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden hover:shadow-md hover:border-navy-200 transition-all">
            <div className="flex flex-col sm:flex-row">
              {/* Date Badge */}
              <div className={`sm:w-24 bg-gradient-to-br ${getEventColor(event.type)} p-4 sm:p-0 flex sm:flex-col items-center justify-center text-white`}>
                <div className="text-center">
                  <p className="text-2xl font-bold">{new Date(event.startAt).getDate()}</p>
                  <p className="text-xs uppercase opacity-80 font-medium">
                    {new Date(event.startAt).toLocaleDateString('pt-BR', { month: 'short' })}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      {getEventIcon(event.type)}
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">{getEventLabel(event.type)}</span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-navy-900">{event.title}</h3>
                    <p className="text-sm text-warm-600 mt-1 line-clamp-2 leading-relaxed">{event.description}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-warm-500">
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(event.startAt).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-1.5"><Users size={14} /> {event.attendees}{event.capacity ? `/${event.capacity}` : ''}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    event.status === 'UPCOMING' ? 'bg-emerald-100 text-emerald-700' :
                    event.status === 'ONGOING' ? 'bg-blue-100 text-blue-700' : 'bg-warm-100 text-warm-600'
                  }`}>
                    {event.status === 'UPCOMING' ? 'Em breve' : event.status === 'ONGOING' ? 'Agora' : 'Encerrado'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-warm-100">
                  <button className="flex-1 py-2.5 bg-navy-700 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-all">
                    Participar
                  </button>
                  <button className="px-4 py-2.5 border border-warm-200 text-warm-600 text-sm font-semibold rounded-xl hover:bg-warm-50 transition-all">
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
