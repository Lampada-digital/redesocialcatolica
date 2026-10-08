import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Send, Phone, Video, MoreVertical, Smile, Image, ArrowLeft } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useApp();
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // In a real implementation, this would use useConversations hook
  // For now, showing empty state since there are no real conversations yet

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
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-warm-400" />
                </div>
                <p className="text-warm-600 font-medium">Nenhuma conversa ainda</p>
                <p className="text-sm text-warm-400 mt-1">Inicie uma conversa com outros membros</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${selectedConv ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-warm-300" />
                </div>
                <p className="text-warm-600 font-medium">Selecione uma conversa</p>
                <p className="text-sm text-warm-400 mt-1">Escolha uma conversa para começar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
