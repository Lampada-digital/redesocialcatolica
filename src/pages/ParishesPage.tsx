import { parishes } from '../data/mockData';
import { MapPin, Phone, Globe, Clock, Church, Search, CheckCircle } from 'lucide-react';

export default function ParishesPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy-900">Paróquias</h1>
          <p className="text-sm text-warm-500 mt-0.5">Encontre paróquias e comunidades próximas</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-navy-700 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-all shadow-sm">
          <Church size={16} /> Cadastrar paróquia
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
          <input type="text" placeholder="Buscar paróquias por nome, cidade ou diocese..."
            className="w-full pl-10 pr-4 py-2.5 border border-warm-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 text-warm-700 placeholder:text-warm-400" />
        </div>
      </div>

      {/* Hierarchy */}
      <div className="bg-gradient-to-r from-navy-50 to-ivory-100 rounded-2xl border border-navy-100 p-5">
        <h3 className="font-semibold text-navy-800 mb-3 text-sm">Estrutura Eclesiástica</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {[
            { label: 'Diocese', color: 'bg-navy-500' },
            { label: 'Paróquia', color: 'bg-emerald-500' },
            { label: 'Pastoral', color: 'bg-gold-500' },
          ].map((item, i) => (
            <div key={item.label} className="flex items-center gap-2">
              {i > 0 && <span className="text-warm-300">→</span>}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-warm-200">
                <span className={`w-2 h-2 ${item.color} rounded-full`} />
                <span className="text-warm-700 font-medium text-xs">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parishes */}
      <div className="space-y-4">
        {parishes.map(parish => (
          <div key={parish.id} className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden hover:shadow-md hover:border-navy-200 transition-all">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-navy-100 to-navy-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Church size={24} className="text-navy-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-serif font-bold text-navy-900">{parish.name}</h3>
                    {parish.isVerified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-navy-50 text-navy-700 rounded-full text-xs font-semibold">
                        <CheckCircle size={10} /> Verificada
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-warm-500 mt-0.5">{parish.diocese}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-2 text-sm text-warm-600">
                      <MapPin size={14} className="text-warm-400 flex-shrink-0" />
                      <span className="truncate">{parish.address}, {parish.city}/{parish.state}</span>
                    </div>
                    {parish.phone && (
                      <div className="flex items-center gap-2 text-sm text-warm-600">
                        <Phone size={14} className="text-warm-400 flex-shrink-0" />
                        <span>{parish.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Mass Schedule */}
                  <div className="mt-4 pt-4 border-t border-warm-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={14} className="text-navy-500" />
                      <span className="text-sm font-semibold text-warm-700">Horários de Missa</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {parish.massSchedule.map((schedule, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-lg text-xs text-warm-600 font-medium">
                          {schedule}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button className="flex-1 py-2.5 bg-navy-700 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-all">
                      Ver perfil
                    </button>
                    <button className="px-4 py-2.5 border border-warm-200 text-warm-600 text-sm font-semibold rounded-xl hover:bg-warm-50 transition-all">
                      Seguir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
