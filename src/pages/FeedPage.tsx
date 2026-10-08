import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { posts as mockPosts, formatTimeAgo } from '../data/mockData';
import {
  Heart, MessageCircle, Share2, Bookmark, Globe, Users, Lock,
  MoreHorizontal, Send, Image, Smile, MapPin, X
} from 'lucide-react';

export default function FeedPage() {
  const { user, posts, likePost, addPost } = useApp();
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handlePost = () => {
    if (newPostContent.trim()) {
      addPost(newPostContent);
      setNewPostContent('');
      setShowNewPost(false);
    }
  };

  const visibilityIcon = (v: string) => {
    switch (v) {
      case 'PUBLIC': return <Globe size={14} />;
      case 'FRIENDS': return <Users size={14} />;
      case 'PRIVATE': return <Lock size={14} />;
      default: return <Globe size={14} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Create Post */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                onFocus={() => setShowNewPost(true)}
                placeholder="Compartilhe algo com a comunidade..."
                className="w-full resize-none border-0 outline-none text-slate-700 placeholder:text-slate-400 text-sm min-h-[40px]"
                rows={showNewPost ? 3 : 1}
              />
            </div>
          </div>
        </div>

        {showNewPost && (
          <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100">
                <Image size={18} className="text-green-500" />
                <span className="hidden sm:inline">Foto</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100">
                <Smile size={18} className="text-yellow-500" />
                <span className="hidden sm:inline">Emoji</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100">
                <MapPin size={18} className="text-red-500" />
                <span className="hidden sm:inline">Local</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowNewPost(false); setNewPostContent(''); }}
                className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handlePost}
                disabled={!newPostContent.trim()}
                className="px-4 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Publicar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stories/Quick Actions */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { label: 'Oração do Dia', emoji: '🙏', color: 'from-purple-500 to-purple-600' },
          { label: 'Evangelho', emoji: '📖', color: 'from-blue-500 to-blue-600' },
          { label: 'Santo de Hoje', emoji: '✝️', color: 'from-amber-500 to-amber-600' },
          { label: 'Intenção', emoji: '💫', color: 'from-pink-500 to-pink-600' },
          { label: 'Evento', emoji: '📅', color: 'from-green-500 to-green-600' },
        ].map(item => (
          <button
            key={item.label}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-xl`}>
              {item.emoji}
            </div>
            <span className="text-xs font-medium text-slate-600 whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Posts */}
      {posts.map(post => (
        <article key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800 text-sm">{post.author.name}</span>
                  {post.author.isVerified && (
                    <span className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{formatTimeAgo(post.createdAt)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">{visibilityIcon(post.visibility)}</span>
                </div>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-3">
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
          </div>

          {/* Post Image */}
          {post.image && (
            <div className="px-4 pb-3">
              <img
                src={post.image}
                alt=""
                className="w-full rounded-xl object-cover max-h-96"
              />
            </div>
          )}

          {/* Post Stats */}
          <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>{post.likes} curtidas</span>
            <span>{post.comments} comentários · {post.shares} compartilhamentos</span>
          </div>

          {/* Post Actions */}
          <div className="px-2 py-1 flex items-center border-t border-slate-100">
            <button
              onClick={() => likePost(post.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                post.liked ? 'text-red-500' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Heart size={20} fill={post.liked ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">Curtir</span>
            </button>
            <button
              onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all"
            >
              <MessageCircle size={20} />
              <span className="hidden sm:inline">Comentar</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all">
              <Share2 size={20} />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all">
              <Bookmark size={20} />
              <span className="hidden sm:inline">Salvar</span>
            </button>
          </div>

          {/* Comments Section */}
          {expandedPost === post.id && (
            <div className="border-t border-slate-100 p-4 space-y-3 animate-fade-in">
              <div className="flex items-start gap-2">
                <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full" />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary-600">
                    <Send size={16} />
                  </button>
                </div>
              </div>
              {/* Sample comments */}
              <div className="flex items-start gap-2">
                <img src={mockPosts[1].author.avatar} alt="" className="w-8 h-8 rounded-full" />
                <div className="bg-slate-100 rounded-2xl px-4 py-2.5 flex-1">
                  <p className="text-xs font-semibold text-slate-800">{mockPosts[1].author.name}</p>
                  <p className="text-sm text-slate-600">Amém! Que mensagem linda! 🙏</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <img src={mockPosts[2].author.avatar} alt="" className="w-8 h-8 rounded-full" />
                <div className="bg-slate-100 rounded-2xl px-4 py-2.5 flex-1">
                  <p className="text-xs font-semibold text-slate-800">{mockPosts[2].author.name}</p>
                  <p className="text-sm text-slate-600">Que Deus nos abençoe! 💫</p>
                </div>
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
