import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { users } from '../data/mockData';
import {
  MapPin, Calendar, Heart, Users, BookOpen, Church, Edit3,
  Camera, Settings, Grid, Bookmark, FileText
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'saved'>('posts');

  const tabs = [
    { id: 'posts' as const, label: 'Publicações', icon: FileText },
    { id: 'about' as const, label: 'Sobre', icon: BookOpen },
    { id: 'friends' as const, label: 'Amigos', icon: Users },
    { id: 'saved' as const, label: 'Salvos', icon: Bookmark },
  ];

  const friendSuggestions = users.slice(1, 5);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Cover Photo */}
      <div className="relative">
        <div className="h-48 sm:h-64 bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-gold-400/30 blur-2xl" />
          </div>
          <button className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white hover:bg-black/50">
            <Camera size={18} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="absolute -bottom-16 left-4 sm:left-8">
          <div className="relative">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-2 right-2 p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700">
              <Camera size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm pt-20 pb-6 px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{user?.name}</h1>
            <p className="text-slate-500 text-sm">@{user?.username}</p>
            <p className="text-slate-600 text-sm mt-2 max-w-md">{user?.bio}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {user?.city}, {user?.state}
              </span>
              <span className="flex items-center gap-1">
                <Church size={14} /> {user?.parish}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={14} className="text-pink-500" /> {user?.patronSaint}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-all">
              <Edit3 size={16} />
              Editar perfil
            </button>
            <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-6 pt-6 border-t border-slate-100">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-800">{user?.friendsCount}</p>
            <p className="text-xs text-slate-500">Amigos</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-800">{user?.followersCount}</p>
            <p className="text-xs text-slate-500">Seguidores</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-800">{user?.followingCount}</p>
            <p className="text-xs text-slate-500">Seguindo</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-800">{user?.interests.length}</p>
            <p className="text-xs text-slate-500">Interesses</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={24} className="text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">Suas publicações aparecerão aqui</p>
                <p className="text-sm text-slate-400 mt-1">Compartilhe algo com a comunidade</p>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Sobre mim</h3>
                <p className="text-sm text-slate-600">{user?.bio}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Informações</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-slate-400" />
                    <span className="text-slate-600">{user?.city}, {user?.state}, {user?.country}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Church size={16} className="text-slate-400" />
                    <span className="text-slate-600">{user?.parish}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen size={16} className="text-slate-400" />
                    <span className="text-slate-600">{user?.diocese}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Heart size={16} className="text-pink-400" />
                    <span className="text-slate-600">Santo de devoção: {user?.patronSaint}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="text-slate-600">Membro desde {new Date(user?.joinedAt || '').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Interesses</h3>
                <div className="flex flex-wrap gap-2">
                  {user?.interests.map(interest => (
                    <span key={interest} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">Amigos em comum</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {friendSuggestions.map(friend => (
                  <div key={friend.id} className="flex flex-col items-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
                    <img src={friend.avatar} alt="" className="w-16 h-16 rounded-full mb-2" />
                    <p className="text-sm font-medium text-slate-800 text-center">{friend.name}</p>
                    <p className="text-xs text-slate-500">{friend.city}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">Publicações salvas</p>
              <p className="text-sm text-slate-400 mt-1">Salve publicações para ver depois</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
