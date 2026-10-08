import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { profileService } from '../services/profileService';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin, Calendar, Heart, Users, BookOpen, Church, Edit3,
  Camera, Settings, FileText
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  // Fetch real profile data
  const { data: profileData } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const result = await profileService.getProfile(user.id);
      return result.profile;
    },
    enabled: !!user?.id,
  });

  const tabs = [
    { id: 'posts' as const, label: 'Publicações', icon: FileText },
    { id: 'about' as const, label: 'Sobre', icon: BookOpen },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-48 sm:h-56 bg-gradient-to-br from-navy-600 via-navy-700 to-navy-900 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gold-400/20 blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-navy-400/20 blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent" />
          <button className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-sm rounded-lg text-white/80 hover:text-white hover:bg-black/30 transition-all">
            <Camera size={16} />
          </button>
        </div>

        <div className="absolute -bottom-12 left-4 sm:left-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-navy-300 to-navy-500 flex items-center justify-center text-white text-3xl font-serif font-bold ring-4 ring-white shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button className="absolute bottom-1 right-1 p-1.5 bg-navy-700 rounded-full text-white hover:bg-navy-800 transition-colors">
              <Camera size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm pt-16 pb-6 px-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-navy-900">{user?.name}</h1>
              {user?.isVerified && (
                <span className="w-5 h-5 bg-navy-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-warm-500 text-sm">@{user?.username}</p>
            <p className="text-warm-600 text-sm mt-2 max-w-md leading-relaxed">{user?.bio}</p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-warm-500">
              {user?.city && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-warm-400" /> {user.city}, {user.state}</span>}
              {user?.patronSaint && <span className="flex items-center gap-1.5"><Heart size={14} className="text-wine-400" /> {user.patronSaint}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-navy-700 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-all">
              <Edit3 size={14} /> Editar perfil
            </button>
            <button className="p-2 border border-warm-200 rounded-xl hover:bg-warm-50 text-warm-600 transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 sm:gap-8 mt-6 pt-6 border-t border-warm-100">
          {[
            { label: 'Amigos', value: user?.friendsCount || 0 },
            { label: 'Seguidores', value: user?.followersCount || 0 },
            { label: 'Seguindo', value: user?.followingCount || 0 },
          ].map(stat => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="text-xl font-bold text-navy-800">{stat.value}</p>
              <p className="text-xs text-warm-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm">
        <div className="flex border-b border-warm-100">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id ? 'border-navy-600 text-navy-800' : 'border-transparent text-warm-500 hover:text-warm-700'
              }`}>
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'posts' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-warm-400" />
              </div>
              <p className="text-warm-600 font-medium">Suas publicações aparecerão aqui</p>
              <p className="text-sm text-warm-400 mt-1">Compartilhe algo com a comunidade</p>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-navy-800 mb-3 text-sm uppercase tracking-wider">Sobre mim</h3>
                <p className="text-sm text-warm-600 leading-relaxed">{user?.bio || 'Nenhuma biografia adicionada.'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-navy-800 mb-3 text-sm uppercase tracking-wider">Informações</h3>
                <div className="space-y-3">
                  {user?.city && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin size={16} className="text-warm-400 flex-shrink-0" />
                      <span className="text-warm-600">{user.city}, {user.state}, {user.country}</span>
                    </div>
                  )}
                  {user?.patronSaint && (
                    <div className="flex items-center gap-3 text-sm">
                      <Heart size={16} className="text-warm-400 flex-shrink-0" />
                      <span className="text-warm-600">Santo de devoção: {user.patronSaint}</span>
                    </div>
                  )}
                  {user?.joinedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={16} className="text-warm-400 flex-shrink-0" />
                      <span className="text-warm-600">Membro desde {new Date(user.joinedAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
