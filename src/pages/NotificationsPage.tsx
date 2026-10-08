import { useApp } from '../context/AppContext';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks/useNotifications';
import { formatTimeAgo } from '../data/mockData';
import { Heart, MessageCircle, UserPlus, Users, Calendar, Cross, Bell, Check, Settings } from 'lucide-react';

export default function NotificationsPage() {
  const { data: notificationsData, isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = (notificationsData?.notifications || []) as any[];
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'POST_LIKE': return <Heart size={14} className="text-wine-500" />;
      case 'POST_COMMENT': return <MessageCircle size={14} className="text-navy-500" />;
      case 'FRIEND_REQUEST': case 'FRIEND_ACCEPTED': return <UserPlus size={14} className="text-emerald-500" />;
      case 'NEW_FOLLOWER': return <UserPlus size={14} className="text-purple-500" />;
      case 'COMMUNITY_INVITE': return <Users size={14} className="text-gold-600" />;
      case 'EVENT_REMINDER': return <Calendar size={14} className="text-indigo-500" />;
      case 'PRAYER_SUPPORT': return <Cross size={14} className="text-wine-500" />;
      default: return <Bell size={14} className="text-warm-500" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'POST_LIKE': return 'bg-wine-50';
      case 'POST_COMMENT': return 'bg-navy-50';
      case 'FRIEND_REQUEST': case 'FRIEND_ACCEPTED': return 'bg-emerald-50';
      case 'NEW_FOLLOWER': return 'bg-purple-50';
      case 'COMMUNITY_INVITE': return 'bg-gold-50';
      case 'EVENT_REMINDER': return 'bg-indigo-50';
      case 'PRAYER_SUPPORT': return 'bg-wine-50';
      default: return 'bg-warm-50';
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-warm-200 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-warm-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy-900">Notificações</h1>
          <p className="text-sm text-warm-500">{unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia!'}</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-navy-600 hover:bg-navy-50 rounded-lg font-medium transition-all disabled:opacity-50"
            >
              <Check size={14} /> Marcar todas como lidas
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-warm-100 text-warm-600"><Settings size={16} /></button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-warm-400" />
            </div>
            <p className="text-warm-600 font-medium">Nenhuma notificação</p>
            <p className="text-sm text-warm-400 mt-1">Você está em dia!</p>
          </div>
        ) : (
          <div className="divide-y divide-warm-50">
            {notifications.map(notif => (
              <button 
                key={notif.id} 
                onClick={() => handleMarkRead(notif.id)}
                disabled={markReadMutation.isPending}
                className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-warm-50 transition-all text-left disabled:opacity-50 ${!notif.is_read ? 'bg-navy-50/30' : ''}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${getBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {notif.from_user?.display_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-warm-700">
                    <span className="font-semibold text-warm-800">{notif.from_user?.display_name || 'Sistema'}</span>{' '}
                    {notif.content}
                  </p>
                  <p className="text-xs text-warm-400 mt-0.5">{formatTimeAgo(notif.created_at)}</p>
                </div>
                {!notif.is_read && <div className="w-2 h-2 bg-navy-600 rounded-full flex-shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
