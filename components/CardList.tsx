
import React from 'react';
import { CreditCard, CardBrand } from '../types';
import { Plus, CreditCard as CardIcon, Edit3, Trash2 } from 'lucide-react';

interface CardListProps {
  cards: CreditCard[];
  onAddCard: () => void;
  onEditCard: (card: CreditCard) => void;
  onDeleteCard: (id: string) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onAddCard, onEditCard, onDeleteCard }) => {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Meus Cartões</h2>
          <p className="text-slate-500">Gerencie seus limites e datas de fechamento.</p>
        </div>
        <button 
          onClick={onAddCard}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          Novo Cartão
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div 
            key={card.id}
            className="group relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl flex flex-col h-full"
            style={{ 
              background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
              color: 'white'
            }}
          >
            {/* Gloss effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{card.bank}</p>
                <h3 className="text-xl font-bold mt-1 truncate max-w-[180px]">{card.name}</h3>
              </div>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <CardIcon size={24} />
              </div>
            </div>

            <div className="space-y-4 relative z-10 flex-1">
              <div>
                <p className="text-[10px] opacity-70 uppercase font-bold tracking-tighter">Limite Total</p>
                <p className="text-xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.limitTotal)}
                </p>
              </div>

              <div className="flex gap-4">
                <div>
                  <p className="text-[9px] opacity-70 uppercase font-bold">Venc.</p>
                  <p className="font-bold text-sm">Dia {card.dueDay}</p>
                </div>
                <div>
                  <p className="text-[9px] opacity-70 uppercase font-bold">Fech.</p>
                  <p className="font-bold text-sm">Dia {card.closingDay}</p>
                </div>
                <div>
                  <p className="text-[9px] opacity-70 uppercase font-bold">Rede</p>
                  <p className="font-bold text-sm">{card.brand}</p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="mt-6 pt-4 border-t border-white/20 flex gap-2 relative z-10">
               <button 
                 type="button"
                 onClick={() => onEditCard(card)}
                 className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold backdrop-blur-sm transition-all active:scale-95"
               >
                 <Edit3 size={14} /> Editar
               </button>
               <button 
                 type="button"
                 onClick={() => onDeleteCard(card.id)}
                 className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/10 hover:bg-red-500/40 rounded-lg text-xs font-bold backdrop-blur-sm transition-all active:scale-95 text-white"
               >
                 <Trash2 size={14} /> Excluir
               </button>
            </div>
          </div>
        ))}

        {cards.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-slate-400 bg-white/50">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <CardIcon size={40} className="opacity-20" />
            </div>
            <p className="text-lg font-bold text-slate-600">Nenhum cartão cadastrado</p>
            <p className="text-sm mt-1">Sua jornada financeira começa aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardList;
