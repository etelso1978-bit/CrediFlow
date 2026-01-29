
import React from 'react';
import { X, CreditCard, Tag, FileText, Calendar, Repeat, Layers } from 'lucide-react';
import { CreditCard as CardType, Category, Expense } from '../types';

interface ExpenseModalProps {
  cards: CardType[];
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id'>) => void;
}

const CATEGORIES: Category[] = [
  'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Moradia', 'Assinaturas', 'Outros'
];

const ExpenseModal: React.FC<ExpenseModalProps> = ({ cards, isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = React.useState({
    cardId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Outros' as Category,
    installments: '1',
    recurring: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      cardId: formData.cardId,
      amount: parseFloat(formData.amount),
      installments: parseInt(formData.installments),
      category: formData.category
    });
    onClose();
    // Reset
    setFormData({
      cardId: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Outros',
      installments: '1',
      recurring: false
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Lançar Despesa</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Card Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
              <CreditCard size={14} /> Selecione o Cartão
            </label>
            <select
              required
              value={formData.cardId}
              onChange={e => setFormData({...formData, cardId: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
            >
              <option value="">Escolha um cartão...</option>
              {cards.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.bank})</option>
              ))}
            </select>
          </div>

          {/* Amount & Description */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                VALOR (R$)
              </label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                <Tag size={14} /> Categoria
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
              <FileText size={14} /> Descrição
            </label>
            <input
              required
              type="text"
              placeholder="Onde ou com o que gastou?"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                <Calendar size={14} /> Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                <Layers size={14} /> Parcelas
              </label>
              <input
                type="number"
                min="1"
                max="48"
                value={formData.installments}
                onChange={e => setFormData({...formData, installments: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setFormData({...formData, recurring: !formData.recurring})}>
            <input 
              type="checkbox" 
              checked={formData.recurring} 
              onChange={() => {}} // Controlled by div
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" 
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Repeat size={14} /> Compra Recorrente
              </p>
              <p className="text-[10px] text-slate-500">Repetir mensalmente (ex: Netflix)</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              Confirmar Lançamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
