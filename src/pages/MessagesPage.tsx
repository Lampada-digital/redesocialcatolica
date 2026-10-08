import { useState } from 'react';
import { conversations, currentUser, formatTimeAgo } from '../data/mockData';
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

  const getConvName = (conv: typeof conversations[0]) => {
    if (conv.isGroup) return conv.groupName;
    return conv.participants[0]?.name;
  };

  const getConvAvatar = (conv: typeof conversations[0]) => {
    return conv.participants[0]?.avatar;
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 lg:pb-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-10rem)]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className={`${selectedConv ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-slate-200`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-800">Mensagens</h2>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                  <Plus size={20} />
                </button>
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar conversas..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-all border-b border-slate-50 ${
                    selectedConv === conv.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="relative">
                    <img src={getConvAvatar(conv)} alt="" className="w-12 h-12 rounded-full" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-slate-800 truncate">{getConvName(conv)}</p>
                      <span className="text-[10px] text-slate-400">{formatTimeAgo(conv.lastMessageAt)}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${selectedConv ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                  <button
                    onClick={() => setSelectedConv(null)}
                    className="md:hidden p-1 rounded-lg hover:bg-slate-100"
                  >
                    <ArrowLeft size={20} className="text-slate-600" />
                  </button>
                  <img src={getConvAvatar(activeConv)} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-800">{getConvName(activeConv)}</p>
                    <p className="text-xs text-green-600">Online</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                      <Phone size={18} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                      <Video size={18} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  <div className="text-center">
                    <span className="text-xs text-slate-400 bg-white px-3 py-1 rounded-full">Hoje</span>
                  </div>
                  {/* Received message */}
                  <div className="flex items-end gap-2">
                    <img src={getConvAvatar(activeConv)} alt="" className="w-7 h-7 rounded-full" />
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[70%] shadow-sm">
                      <p className="text-sm text-slate-700">Que a paz de Cristo esteja com você!</p>
                      <p className="text-[10px] text-slate-400 mt-1">10:28</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <img src={getConvAvatar(activeConv)} alt="" className="w-7 h-7 rounded-full" />
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[70%] shadow-sm">
                      <p className="text-sm text-slate-700">Até domingo na missa. Vamos rezar juntos pelo grupo de jovens?</p>
                      <p className="text-[10px] text-slate-400 mt-1">10:30</p>
                    </div>
                  </div>
                  {/* Sent message */}
                  <div className="flex items-end gap-2 justify-end">
                    <div className="bg-primary-600 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[70%]">
                      <p className="text-sm text-white">Com certeza! Vou preparar uma intenção especial. 🙏</p>
                      <p className="text-[10px] text-primary-200 mt-1">10:32 ✓✓</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 justify-end">
                    <div className="bg-primary-600 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[70%]">
                      <p className="text-sm text-white">Que Deus nos abençoe! Amém!</p>
                      <p className="text-[10px] text-primary-200 mt-1">10:33 ✓✓</p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                      <Image size={20} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                      <Smile size={20} />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className="w-full px-4 py-2.5 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
                      />
                    </div>
                    <button
                      className="p-2.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all"
                      onClick={() => setMessageText('')}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-600 font-medium">Selecione uma conversa</p>
                  <p className="text-sm text-slate-400 mt-1">Escolha uma conversa para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
