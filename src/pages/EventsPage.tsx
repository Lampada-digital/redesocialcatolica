import { events, formatDate, formatDateTime } from '../data/mockData';
import {
  Calendar, MapPin, Clock, Users, Plus, Filter, Church,
  Music, BookOpen, Heart, Star, PartyPopper
} from 'lucide-react';

export default function EventsPage() {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'MISSA': return <Church size={20} className="text-primary-600" />;
      case 'TERCO': return <Heart size={20} className="text-pink-600" />;
      case 'ADORACAO': return <Star size={20} className="text-amber-600" />;
      case 'RETIRIO': return <BookOpen size={20} className="text-purple-600" />;
      case 'CATEQUESE': return <BookOpen size={20} className="text-blue-600" />;
      case 'ENCONTRO': return <Users size={20} className="text-green-600" />;
      case 'FORMACAO': return <BookOpen size={20} className="text-indigo-600" />;
      case 'FESTA': return <PartyPopper size={20} className="text-orange-600" />;
      default: return <Calendar size={20} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'MISSA': return 'from-primary-500 to-primary-700';
      case 'TERCO': return 'from-pink-500 to-pink-700';
      case 'ADORACAO': return 'from-amber-500 to-amber-700';
      case 'RETIRIO': return 'from-purple-500 to-purple-700';
      case 'CATEQUESE': return 'from-blue-500 to-blue-700';
      case 'ENCONTRO': return 'from-green-500 to-green-700';
      case 'FORMACAO': return 'from-indigo-500 to-indigo-700';
      case 'FESTA': return 'from-orange-500 to-orange-700';
      default: return 'from-slate-500 to-slate-700';
    }
  };

  const getEventLabel = (type: string) => {
    const labels: Record<string, string> = {
      MISSA: 'Missa',
      TERCO: 'Terço',
      ADORACAO: 'Adoração',
      RETIRIO: 'Retiro',
      CATEQUESE: 'Catequese',
      ENCONTRO: 'Encontro',
      FORMACAO: 'Formação',
      FESTA: 'Festa',
    };
    return labels[type] || type;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Eventos</h1>
          <p className="text-sm text-slate-500">Missas, retiros, adorações e muito mais</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-all">
          <Plus size={18} />
          Criar evento
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Próximos', value: events.length, color: 'bg-primary-50 text-primary-700' },
          { label: 'Esta semana', value: 3, color: 'bg-green-50 text-green-700' },
          { label: 'Participando', value: 2, color: 'bg-amber-50 text-amber-700' },
          { label: 'Organizados', value: 1, color: 'bg-purple-50 text-purple-700' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter size={16} className="text-slate-400 flex-shrink-0" />
        {['Todos', 'Missas', 'Terço', 'Adoração', 'Retiros', 'Formação'].map(f => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              f === 'Todos' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map(event => (
          <div
            key={event.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Event Date Badge */}
              <div className={`sm:w-24 bg-gradient-to-br ${getEventColor(event.type)} p-4 sm:p-0 flex sm:flex-col items-center justify-center text-white`}>
                <div className="text-center">
                  <p className="text-2xl font-bold">{new Date(event.startAt).getDate()}</p>
                  <p className="text-xs uppercase opacity-80">
                    {new Date(event.startAt).toLocaleDateString('pt-BR', { month: 'short' })}
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getEventIcon(event.type)}
                      <span className="text-xs font-medium text-slate-500 uppercase">{getEventLabel(event.type)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{event.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{event.description}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {formatDateTime(event.startAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={14} />
                        {event.attendees}{event.capacity ? `/${event.capacity}` : ''} participantes
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <img
                        src={'avatar' in event.organizer ? event.organizer.avatar : (event.organizer as { avatar: string }).avatar}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-slate-500">
                        Organizado por {'name' in event.organizer ? event.organizer.name : (event.organizer as { name: string }).name}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      event.status === 'UPCOMING' ? 'bg-green-100 text-green-700' :
                      event.status === 'ONGOING' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {event.status === 'UPCOMING' ? 'Em breve' : event.status === 'ONGOING' ? 'Agora' : 'Encerrado'}
                    </span>
                    {event.capacity && (
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-primary-500 h-1.5 rounded-full"
                          style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button className="flex-1 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-all">
                    Participar
                  </button>
                  <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all">
                    Interessado
                  </button>
                  <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all">
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
