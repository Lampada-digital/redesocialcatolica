import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePosts, useCreatePost, useLikePost } from '../hooks/usePosts';
import { formatTimeAgo } from '../data/mockData';
import {
  Heart, MessageCircle, Share2, Bookmark, Globe, Users, Lock,
  MoreHorizontal, Send, Image, Smile, MapPin, Cross
} from 'lucide-react';

export default function FeedPage() {
  const { user } = useApp();
  const { data: postsData, isLoading: postsLoading } = usePosts();
  const createPostMutation = useCreatePost();
  const likePostMutation = useLikePost();
  
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const posts = postsData?.posts || [];

  const handlePost = async () => {
    if (newPostContent.trim()) {
      try {
        await createPostMutation.mutateAsync(newPostContent);
        setNewPostContent('');
        setShowNewPost(false);
      } catch (error) {
        console.error('Erro ao criar post:', error);
      }
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePostMutation.mutateAsync(postId);
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const visibilityIcon = (v: string) => {
    switch (v) {
      case 'PUBLIC': return <Globe size={12} />;
      case 'FRIENDS': return <Users size={12} />;
      case 'PRIVATE': return <Lock size={12} />;
      default: return <Globe size={12} />;
    }
  };

  if (postsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-warm-200 rounded animate-pulse" />
        <div className="h-32 bg-warm-200 rounded-2xl animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-warm-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-serif font-bold text-navy-900">Início</h1>
        <p className="text-sm text-warm-500 mt-0.5">Veja o que a comunidade está compartilhando</p>
      </div>

      {/* Composer */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                onFocus={() => setShowNewPost(true)}
                placeholder="Compartilhe algo com a comunidade..."
                className="w-full resize-none border-0 outline-none text-warm-700 placeholder:text-warm-400 text-sm min-h-[40px] leading-relaxed"
                rows={showNewPost ? 3 : 1}
              />
            </div>
          </div>
        </div>

        {showNewPost && (
          <div className="border-t border-warm-100 px-4 py-3 flex items-center justify-between bg-warm-50/50">
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-warm-600 hover:bg-warm-100 transition-colors">
                <Image size={16} className="text-navy-500" /> Foto
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-warm-600 hover:bg-warm-100 transition-colors">
                <Smile size={16} className="text-gold-600" /> Emoji
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-warm-600 hover:bg-warm-100 transition-colors">
                <MapPin size={16} className="text-wine-500" /> Local
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setShowNewPost(false); setNewPostContent(''); }} className="px-3 py-1.5 text-xs font-medium text-warm-500 hover:text-warm-700">
                Cancelar
              </button>
              <button 
                onClick={handlePost} 
                disabled={!newPostContent.trim() || createPostMutation.isPending}
                className="px-4 py-1.5 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {createPostMutation.isPending ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { label: 'Evangelho', emoji: '📖', color: 'from-navy-500 to-navy-700' },
          { label: 'Santo do Dia', emoji: '✝️', color: 'from-gold-500 to-gold-700' },
          { label: 'Intenção', emoji: '🙏', color: 'from-wine-500 to-wine-700' },
          { label: 'Eventos', emoji: '📅', color: 'from-emerald-500 to-emerald-700' },
        ].map(item => (
          <button key={item.label} className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-warm-100 hover:border-navy-200 hover:shadow-sm transition-all">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-xs`}>
              {item.emoji}
            </div>
            <span className="text-xs font-medium text-warm-700 whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={24} className="text-warm-400" />
          </div>
          <p className="text-warm-600 font-medium">Nenhuma publicação ainda</p>
          <p className="text-sm text-warm-400 mt-1">Seja o primeiro a compartilhar algo!</p>
        </div>
      ) : (
        posts.map(post => (
          <article key={post.id} className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden animate-fade-in">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-sm font-semibold">
                  {post.author.display_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-warm-800 text-sm">{post.author.display_name}</span>
                    {post.author.is_verified && (
                      <span className="w-4 h-4 bg-navy-600 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-warm-500">
                    <span>@{post.author.username}</span>
                    <span>·</span>
                    <span>{formatTimeAgo(post.created_at)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">{visibilityIcon(post.visibility)}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-warm-100 text-warm-400 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p className="text-warm-700 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>

            {/* Stats */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-warm-500 border-t border-warm-50">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-full bg-wine-100 border border-white flex items-center justify-center">
                    <Heart size={8} className="text-wine-500" fill="currentColor" />
                  </div>
                  <div className="w-4 h-4 rounded-full bg-gold-100 border border-white flex items-center justify-center">
                    <Cross size={7} className="text-gold-600" />
                  </div>
                </div>
                <span>{post.likes_count}</span>
              </div>
              <span>{post.comments_count} comentários · {post.shares_count} compartilhamentos</span>
            </div>

            {/* Actions */}
            <div className="px-2 py-1 flex items-center border-t border-warm-100">
              <button 
                onClick={() => handleLike(post.id)}
                disabled={likePostMutation.isPending}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  likePostMutation.isPending ? 'opacity-50' : ''
                } text-warm-500 hover:bg-warm-50 hover:text-warm-700`}>
                <Heart size={18} />
                <span className="hidden sm:inline">Amém</span>
              </button>
              <button 
                onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-warm-500 hover:bg-warm-50 hover:text-warm-700 transition-all">
                <MessageCircle size={18} />
                <span className="hidden sm:inline">Comentar</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-warm-500 hover:bg-warm-50 hover:text-warm-700 transition-all">
                <Share2 size={18} />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-warm-500 hover:bg-warm-50 hover:text-warm-700 transition-all">
                <Bookmark size={18} />
                <span className="hidden sm:inline">Salvar</span>
              </button>
            </div>

            {/* Comments */}
            {expandedPost === post.id && (
              <div className="border-t border-warm-100 p-4 space-y-3 animate-fade-in bg-warm-50/30">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 relative">
                    <input type="text" placeholder="Escreva um comentário..."
                      className="w-full pl-4 pr-10 py-2.5 bg-white border border-warm-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 text-warm-700 placeholder:text-warm-400" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-navy-600 hover:text-navy-800">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </article>
        ))
      )}
    </div>
  );
}
