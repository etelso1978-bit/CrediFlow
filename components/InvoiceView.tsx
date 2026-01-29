
import React from 'react';
import { CreditCard, Expense, Category } from '../types';
import { 
  Receipt, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Filter
} from 'lucide-react';

interface InvoiceViewProps {
  expenses: Expense[];
  cards: CreditCard[];
}

interface InvoiceSummary {
  month: number;
  year: number;
  total: number;
  expenses: Array<Expense & { installmentNumber?: number }>;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ expenses, cards }) => {
  const [selectedCardId, setSelectedCardId] = React.useState<string>('all');
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Navegação de meses
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  // Lógica principal: Gerar as faturas baseadas nas datas de fechamento e parcelas
  const getInvoiceData = (): InvoiceSummary => {
    const targetMonth = currentDate.getMonth();
    const targetYear = currentDate.getFullYear();
    
    let filteredExpenses: Array<Expense & { installmentNumber?: number }> = [];

    const activeCards = selectedCardId === 'all' ? cards : cards.filter(c => c.id === selectedCardId);

    expenses.forEach(exp => {
      const card = cards.find(c => c.id === exp.cardId);
      if (!card) return;
      if (selectedCardId !== 'all' && exp.cardId !== selectedCardId) return;

      const purchaseDate = new Date(exp.date);
      
      // Para cada parcela
      for (let i = 0; i < exp.installments; i++) {
        // Calcula o mês de referência da parcela
        // A lógica de fechamento: se a compra foi após o dia de fechamento, cai na próxima fatura
        const installmentBaseDate = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth() + i, purchaseDate.getDate());
        
        let invoiceMonth = installmentBaseDate.getMonth();
        let invoiceYear = installmentBaseDate.getFullYear();

        if (installmentBaseDate.getDate() > card.closingDay) {
          invoiceMonth += 1;
          if (invoiceMonth > 11) {
            invoiceMonth = 0;
            invoiceYear += 1;
          }
        }

        if (invoiceMonth === targetMonth && invoiceYear === targetYear) {
          filteredExpenses.push({
            ...exp,
            amount: exp.amount / exp.installments,
            installmentNumber: exp.installments > 1 ? i + 1 : undefined
          });
        }
      }
    });

    return {
      month: targetMonth,
      year: targetYear,
      total: filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0),
      expenses: filteredExpenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    };
  };

  const invoice = getInvoiceData();
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
  const isFuture = currentDate > new Date();
  const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0) < new Date();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <Receipt size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 capitalize">{monthName} {invoice.year}</h2>
            <p className="text-sm text-slate-500">Gestão detalhada de faturas</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="px-4 font-bold text-slate-700 min-w-[120px] text-center text-sm uppercase tracking-wider">
            {monthName}
          </div>
          <button 
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de Filtros e Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
              <Filter size={14} /> Filtrar Cartão
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedCardId('all')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedCardId === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                Todos os Cartões
              </button>
              {cards.map(card => (
                <button 
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${selectedCardId === card.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedCardId === card.id ? 'white' : card.color }}></div>
                  <span className="truncate">{card.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Status da Fatura</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {isPast ? (
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full"><CheckCircle2 size={18} /></div>
                ) : isFuture ? (
                  <div className="bg-amber-100 text-amber-600 p-2 rounded-full"><Clock size={18} /></div>
                ) : (
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full"><AlertCircle size={18} /></div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {isPast ? 'Fatura Paga' : isFuture ? 'Fatura Prevista' : 'Fatura Aberta'}
                  </p>
                  <p className="text-[10px] text-slate-400">Referência: {monthName}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Total deste mês</p>
                <p className="text-2xl font-black text-indigo-600">
                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.total)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Listagem de Despesas da Fatura */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Lançamentos da Fatura</h3>
              <span className="bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-500">
                {invoice.expenses.length} itens
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] uppercase text-slate-400 font-bold border-b border-slate-50 bg-slate-50/30">
                    <th className="px-6 py-4 text-left">Data</th>
                    <th className="px-6 py-4 text-left">Descrição</th>
                    <th className="px-6 py-4 text-left">Cartão</th>
                    <th className="px-6 py-4 text-right">Valor Parcela</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoice.expenses.map((exp, idx) => {
                    const card = cards.find(c => c.id === exp.cardId);
                    return (
                      <tr key={`${exp.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-600 flex items-center gap-2">
                            <Calendar size={14} className="text-slate-300" />
                            {new Date(exp.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-800">{exp.description}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium uppercase">{exp.category}</span>
                            {exp.installmentNumber && (
                              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">
                                Parc. {exp.installmentNumber}/{exp.installments}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card?.color }}></div>
                             <span className="text-xs font-medium text-slate-500">{card?.name || 'Cartão Removido'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(exp.amount)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {invoice.expenses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <div className="max-w-xs mx-auto space-y-3">
                           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                             <Receipt size={32} />
                           </div>
                           <p className="text-slate-500 font-medium">Nenhuma despesa para este período ou filtro.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                {invoice.expenses.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-50/80">
                      <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-slate-500 uppercase">Subtotal da Fatura:</td>
                      <td className="px-6 py-4 text-right text-lg font-black text-slate-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.total)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
