
import React from 'react';
import { X, CreditCard as CardIcon, Building2, Landmark, Calendar, Palette } from 'lucide-react';
import { CreditCard, CardBrand } from '../types';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Omit<CreditCard, 'id'> & { id?: string }) => void;
  editingCard?: CreditCard | null;
}

const BRANDS: CardBrand[] = ['Visa', 'Mastercard', 'Elo', 'Amex', 'Other'];
const PRESET_COLORS = [
  '#820ad1', // Nubank
  '#ff7800', // Itaú
  '#004481', // Bradesco/BB
  '#22c55e', // Verde
  '#3b82f6', // Azul
  '#ef4444', // Vermelho
  '#6366f1', // Indigo
  '#1e293b', // Dark
];

const CardModal: React.FC<CardModalProps> = ({ isOpen, onClose, onSave, editingCard }) => {
  const [formData, setFormData] = React.useState<Omit<CreditCard, 'id'>>({
    name: '',
    bank: '',
    limitTotal: 0,
    closingDay: 1,
    dueDay: 10,
    brand: 'Visa',
    color: '#6366f1'
  });

  React.useEffect(() => {
    if (isOpen) {
      if (editingCard) {
        setFormData({
          name: editingCard.name,
          bank: editingCard.bank,
          limitTotal: editingCard.limitTotal,
          closingDay: editingCard.closingDay,
          dueDay: editingCard.dueDay,
          brand: editingCard.brand,
          color: editingCard.color
        });
      } else {
        setFormData({
          name: '',
          bank: '',
          limitTotal: 0,
          closingDay: 1,
          dueDay: 10,
          brand: 'Visa',
          color: '#6366f1'
        });
      }
    }
  }, [editingCard, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: editingCard?.id });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{editingCard ? 'Editar Cartão' : 'Novo Cartão'}</h3>
            <p className="text-indigo-100 text-xs mt-1">Gerencie seu crédito com inteligência</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 px-1">
                <CardIcon size={12} /> Apelido
              </label>
              <input
                required
                type="text"
                placeholder="Ex: Principal"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 px-1">
                <Building2 size={12} /> Banco
              </label>
              <input
                required
                type="text"
                placeholder="Ex: Nubank"
                value={formData.bank}
                onChange={e => setFormData({...formData, bank: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 px-1">
                <Landmark size={12} /> Limite (R$)
              </label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.limitTotal || ''}
                onChange={e => setFormData({...formData, limitTotal: parseFloat(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 px-1">
                <Palette size={12} /> Bandeira
              </label>
              <select
                value={formData.brand}
                onChange={e => setFormData({...formData, brand: e.target.value as CardBrand})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                {BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 px-1">
                <Calendar size={12} /> Fechamento
              </label>
              <input
                required
                type="number"
                min="1"
                max="31"
                value={formData.closingDay}
                onChange={e => setFormData({...formData, closingDay: parseInt(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 px-1">
                <Calendar size={12} /> Vencimento
              </label>
              <input
                required
                type="number"
                min="1"
                max="31"
                value={formData.dueDay}
                onChange={e => setFormData({...formData, dueDay: parseInt(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 px-1">
              <Palette size={12} /> Cor do Cartão
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`w-9 h-9 rounded-full border-4 transition-all hover:scale-110 shadow-sm ${formData.color === color ? 'border-indigo-600 ring-4 ring-indigo-50 scale-105' : 'border-white'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              {editingCard ? 'Salvar Alterações' : 'Cadastrar Cartão'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardModal;
