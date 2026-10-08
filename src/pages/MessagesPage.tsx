import { useState } from 'react';
import { conversations, formatTimeAgo } from '../data/mockData';
import { Search, Plus, Send, Phone, Video, MoreVertical, Smile, Image, ArrowLeft } from 'lucide-react';

export default function MessagesPage() {
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConvs = conversations.filter(c =>
    c.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.isGroup && c.groupName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeConv = conversations.find(c => c.id === selectedConv);
  const getConvName = (conv: typeof conversations[0]) => conv.isGroup ? conv.groupName : conv.participants[0]?.name;
  const getConvAvatar = (conv: typeof conversations[0]) => conv.participants[0]?.avatar;

  return (
    <div className="pb-20 lg:pb-0">
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden h-[calc(100vh-10rem)]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className={`${selectedConv ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-warm-100`}>
            <div className="p-4 border-b border-warm-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-serif font-bold text-navy-900">Mensagens</h2>
                <button className="p-2 rounded-lg hover:bg-warm-100 text-warm-600"><Plus size={18} /></button>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar conversas..."
                  className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-navy-500 text-warm-700 placeholder:text-warm-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map(conv => (
                <button key={conv.id} onClick={() => setSelectedConv(conv.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-warm-50 transition-all border-b border-warm-50 ${selectedConv === conv.id ? 'bg-navy-50' : ''}`}>
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-sm font-semibold">
                      {getConvName(conv)?.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-warm-800 truncate">{getConvName(conv)}</p>
                      <span className="text-[10px] text-warm-400">{formatTimeAgo(conv.lastMessageAt)}</span>
                    </div>
                    <p className="text-xs text-warm-500 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 bg-navy-700 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{conv.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${selectedConv ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
            {activeConv ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 border-b border-warm-100">
                  <button onClick={() => setSelectedConv(null)} className="md:hidden p-1 rounded-lg hover:bg-warm-100">
                    <ArrowLeft size={20} className="text-warm-600" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-sm font-semibold">
                    {getConvName(activeConv)?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-warm-800">{getConvName(activeConv)}</p>
                    <p className="text-xs text-emerald-600">Online</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-warm-100 text-warm-500"><Phone size={16} /></button>
                    <button className="p-2 rounded-lg hover:bg-warm-100 text-warm-500"><Video size={16} /></button>
                    <button className="p-2 rounded-lg hover:bg-warm-100 text-warm-500"><MoreVertical size={16} /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-ivory-50">
                  <div className="text-center"><span className="text-xs text-warm-400 bg-white px-3 py-1 rounded-full border border-warm-100">Hoje</span></div>
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-[10px] font-semibold">{getConvName(activeConv)?.charAt(0)}</div>
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[70%] shadow-sm border border-warm-100">
                      <p className="text-sm text-warm-700">Que a paz de Cristo esteja com você!</p>
                      <p className="text-[10px] text-warm-400 mt-1">10:28</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-navy-200 to-navy-400 flex items-center justify-center text-white text-[10px] font-semibold">{getConvName(activeConv)?.charAt(0)}</div>
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[70%] shadow-sm border border-warm-100">
                      <p className="text-sm text-warm-700">Até domingo na missa!</p>
                      <p className="text-[10px] text-warm-400 mt-1">10:30</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 justify-end">
                    <div className="bg-navy-700 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[70%]">
                      <p className="text-sm text-white">Com certeza! Vou preparar uma intenção especial. 🙏</p>
                      <p className="text-[10px] text-navy-200 mt-1">10:32 ✓✓</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-warm-100">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-warm-100 text-warm-500"><Image size={18} /></button>
                    <button className="p-2 rounded-lg hover:bg-warm-100 text-warm-500"><Smile size={18} /></button>
                    <div className="flex-1">
                      <input type="text" value={messageText} onChange={e => setMessageText(e.target.value)} placeholder="Digite uma mensagem..."
                        className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-navy-500 text-warm-700 placeholder:text-warm-400" />
                    </div>
                    <button className="p-2.5 bg-navy-700 text-white rounded-full hover:bg-navy-800 transition-all"><Send size={16} /></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-warm-300" />
                  </div>
                  <p className="text-warm-600 font-medium">Selecione uma conversa</p>
                  <p className="text-sm text-warm-400 mt-1">Escolha uma conversa para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
