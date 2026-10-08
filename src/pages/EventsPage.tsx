import { useEvents, useAttendEvent, useCancelAttendance } from '../hooks/useEvents';
import { Calendar, MapPin, Clock, Users, Plus, Church, Heart, Star, BookOpen, PartyPopper } from 'lucide-react';

export default function EventsPage() {
  const { data: eventsData, isLoading } = useEvents();
  const attendMutation = useAttendEvent();
  const cancelMutation = useCancelAttendance();

  const events = eventsData?.events || [];

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-warm-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
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
          <h1 className="text-2xl font-serif font-bold text-navy-900">Eventos</h1>
          <p className="text-sm text-warm-500 mt-0.5">Missas, retiros, adorações e encontros</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-navy-700 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-all shadow-sm">
          <Plus size={16} /> Criar evento
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-warm-100">
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={24} className="text-warm-400" />
          </div>
          <p className="text-warm-600 font-medium">Nenhum evento encontrado</p>
          <p className="text-sm text-warm-400 mt-1">Não há eventos próximos no momento</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden hover:shadow-md hover:border-navy-200 transition-all">
              <div className="flex flex-col sm:flex-row">
                {/* Date Badge */}
                <div className={`sm:w-24 bg-gradient-to-br ${getEventColor(event.type)} p-4 sm:p-0 flex sm:flex-col items-center justify-center text-white`}>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{new Date(event.start_at).getDate()}</p>
                    <p className="text-xs uppercase opacity-80 font-medium">
                      {new Date(event.start_at).toLocaleDateString('pt-BR', { month: 'short' })}
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
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(event.start_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="flex items-center gap-1.5"><Users size={14} /> {event.attendees_count}{event.capacity ? `/${event.capacity}` : ''}</span>
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
                    <button 
                      onClick={() => attendMutation.mutate({ eventId: event.id })}
                      disabled={attendMutation.isPending}
                      className="flex-1 py-2.5 bg-navy-700 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-all disabled:opacity-50"
                    >
                      {attendMutation.isPending ? 'Participando...' : 'Participar'}
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
      )}
    </div>
  );
}
