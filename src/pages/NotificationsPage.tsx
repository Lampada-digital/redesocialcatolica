import { useApp } from '../context/AppContext';
import { formatTimeAgo } from '../data/mockData';
import {
  Heart, MessageCircle, UserPlus, Users, Calendar, Cross,
  Bell, Check, Settings
} from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'POST_LIKE': return <Heart size={16} className="text-red-500" />;
      case 'POST_COMMENT': return <MessageCircle size={16} className="text-blue-500" />;
      case 'FRIEND_REQUEST': return <UserPlus size={16} className="text-green-500" />;
      case 'FRIEND_ACCEPTED': return <UserPlus size={16} className="text-green-500" />;
      case 'NEW_FOLLOWER': return <UserPlus size={16} className="text-purple-500" />;
      case 'COMMUNITY_INVITE': return <Users size={16} className="text-amber-500" />;
      case 'EVENT_REMINDER': return <Calendar size={16} className="text-indigo-500" />;
      case 'PRAYER_SUPPORT': return <Cross size={16} className="text-pink-500" />;
      case 'SYSTEM': return <Bell size={16} className="text-slate-500" />;
      default: return <Bell size={16} className="text-slate-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'POST_LIKE': return 'bg-red-50';
      case 'POST_COMMENT': return 'bg-blue-50';
      case 'FRIEND_REQUEST': return 'bg-green-50';
      case 'FRIEND_ACCEPTED': return 'bg-green-50';
      case 'NEW_FOLLOWER': return 'bg-purple-50';
      case 'COMMUNITY_INVITE': return 'bg-amber-50';
      case 'EVENT_REMINDER': return 'bg-indigo-50';
      case 'PRAYER_SUPPORT': return 'bg-pink-50';
      default: return 'bg-slate-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notificações</h1>
          <p className="text-sm text-slate-500">
            {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all"
            >
              <Check size={16} />
              Marcar todas como lidas
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">Nenhuma notificação</p>
            <p className="text-sm text-slate-400 mt-1">Você está em dia!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif, index) => (
              <button
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-all text-left ${
                  !notif.read ? 'bg-primary-50/30' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBgColor(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <img
                  src={notif.from.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">{notif.from.name}</span>{' '}
                    {notif.content}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatTimeAgo(notif.createdAt)}</p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 bg-primary-500 rounded-full flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Configurações de notificação</h3>
        <div className="space-y-3">
          {[
            { label: 'Curtidas em publicações', enabled: true },
            { label: 'Comentários', enabled: true },
            { label: 'Pedidos de amizade', enabled: true },
            { label: 'Convites para comunidades', enabled: true },
            { label: 'Lembretes de eventos', enabled: true },
            { label: 'Intenções de oração', enabled: true },
            { label: 'Mensagens', enabled: true },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{item.label}</span>
              <div className={`w-10 h-6 rounded-full flex items-center px-1 cursor-pointer transition-all ${
                item.enabled ? 'bg-primary-600 justify-end' : 'bg-slate-200 justify-start'
              }`}>
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
