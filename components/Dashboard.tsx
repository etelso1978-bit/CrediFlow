
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  AlertTriangle, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Expense, CreditCard, Category } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface DashboardProps {
  expenses: Expense[];
  cards: CreditCard[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ expenses, cards }) => {
  const [insights, setInsights] = React.useState<string>("Analisando seus dados...");
  const [loadingInsights, setLoadingInsights] = React.useState(true);

  React.useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const res = await getFinancialInsights(expenses, cards);
      setInsights(res || "Erro ao carregar insights.");
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [expenses, cards]);

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalLimit = cards.reduce((acc, curr) => acc + curr.limitTotal, 0);
  const availableLimit = totalLimit - totalSpent;
  const limitUsagePercent = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  const categoryData = expenses.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const monthlyData = [
    { name: 'Jan', value: 2400 },
    { name: 'Fev', value: 3100 },
    { name: 'Mar', value: 1800 },
    { name: 'Abr', value: totalSpent },
  ];

  return (
    <div className="space-y-6 transition-colors duration-300">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Visão Geral</h2>
          <p className="text-slate-500 dark:text-slate-400">Acompanhe seu desempenho financeiro este mês.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 flex shadow-sm transition-colors">
          <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md text-sm font-medium">Este Mês</button>
          <button className="px-4 py-2 text-slate-500 dark:text-slate-400 rounded-md text-sm font-medium">Últimos 3 meses</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
              <TrendingDown size={20} />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gastos no Mês</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Wallet size={20} />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-500">Geral</span>
          </div>
          <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Limite Disponível</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(availableLimit)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${limitUsagePercent > 80 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Uso do Limite</h4>
          <div className="mt-2">
            <div className="flex justify-between items-end mb-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{limitUsagePercent.toFixed(1)}%</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalLimit)}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${limitUsagePercent > 80 ? 'bg-red-500' : 'bg-indigo-600'}`} 
                style={{ width: `${Math.min(limitUsagePercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-[400px] flex flex-col transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Evolução de Gastos</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', color: '#f1f5f9' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-indigo-200 dark:shadow-none flex flex-col transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-indigo-200" size={20} />
            <h3 className="text-lg font-bold">Insights do CrediFlow AI</h3>
          </div>
          <div className="flex-1 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl p-4 overflow-y-auto">
            {loadingInsights ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <p className="text-sm text-indigo-100">Consultando o Gemini...</p>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm">
                <p className="text-indigo-50 leading-relaxed whitespace-pre-line">
                  {insights}
                </p>
              </div>
            )}
          </div>
          <button className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 py-2 rounded-lg transition-all">
            Ver detalhes da análise <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
