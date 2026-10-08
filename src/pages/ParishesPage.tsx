import { parishes } from '../data/mockData';
import { MapPin, Phone, Globe, Clock, Church, Search, CheckCircle } from 'lucide-react';

export default function ParishesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Paróquias</h1>
          <p className="text-sm text-slate-500">Encontre paróquias e comunidades próximas</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-all">
          <Church size={18} />
          Cadastrar paróquia
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar paróquias por nome, cidade ou diocese..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-700"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {['Todas', 'São Paulo', 'Diocese de São Miguel', 'Centro'].map(f => (
            <button
              key={f}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                f === 'Todas' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Hierarchy Info */}
      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-2xl border border-primary-100 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Estrutura Eclesiástica</h3>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-primary-200">
            <span className="w-2 h-2 bg-primary-500 rounded-full" />
            <span className="text-slate-700 font-medium">Diocese</span>
          </div>
          <span className="text-slate-400">→</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-primary-200">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-slate-700 font-medium">Paróquia</span>
          </div>
          <span className="text-slate-400">→</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-primary-200">
            <span className="w-2 h-2 bg-amber-500 rounded-full" />
            <span className="text-slate-700 font-medium">Pastoral</span>
          </div>
        </div>
      </div>

      {/* Parishes List */}
      <div className="space-y-4">
        {parishes.map(parish => (
          <div
            key={parish.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Church size={28} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-800">{parish.name}</h3>
                    {parish.isVerified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                        <CheckCircle size={12} />
                        Verificada
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{parish.diocese}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      <span>{parish.address}, {parish.city}/{parish.state}</span>
                    </div>
                    {parish.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        <span>{parish.phone}</span>
                      </div>
                    )}
                    {parish.website && (
                      <div className="flex items-center gap-2 text-sm text-primary-600">
                        <Globe size={14} />
                        <span>{parish.website}</span>
                      </div>
                    )}
                  </div>

                  {/* Mass Schedule */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={14} className="text-primary-500" />
                      <span className="text-sm font-semibold text-slate-700">Horários de Missa</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {parish.massSchedule.map((schedule, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600"
                        >
                          {schedule}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button className="flex-1 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-all">
                      Ver perfil
                    </button>
                    <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all">
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
