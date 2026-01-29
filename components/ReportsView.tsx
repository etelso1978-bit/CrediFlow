
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
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  Download, 
  FileText, 
  Table as TableIcon, 
  Calendar, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { Expense, CreditCard, Category } from '../types';

interface ReportsViewProps {
  expenses: Expense[];
  cards: CreditCard[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9', '#64748b'];

const MONTHS_NAMES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const ReportsView: React.FC<ReportsViewProps> = ({ expenses, cards }) => {
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [selectedCardId, setSelectedCardId] = React.useState('all');

  const filteredExpenses = expenses.filter(exp => {
    const date = new Date(exp.date);
    const yearMatch = date.getFullYear() === selectedYear;
    const cardMatch = selectedCardId === 'all' || exp.cardId === selectedCardId;
    return yearMatch && cardMatch;
  });

  // 1. Dados para Evolução Mensal
  const monthlyData = MONTHS_NAMES.map((month, index) => {
    const total = filteredExpenses
      .filter(exp => new Date(exp.date).getMonth() === index)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { name: month, total };
  });

  // 2. Dados para Distribuição por Categoria
  const categoryData = filteredExpenses.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Estatísticas
  const totalYear = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const avgMonthly = totalYear / 12;
  const maxExpense = filteredExpenses.length > 0 
    ? Math.max(...filteredExpenses.map(e => e.amount)) 
    : 0;
  const topCategory = categoryData[0]?.name || 'Nenhuma';

  const exportCSV = () => {
    const headers = ['Data', 'Descrição', 'Categoria', 'Valor', 'Cartão'];
    const rows = filteredExpenses.map(e => [
      new Date(e.date).toLocaleDateString('pt-BR'),
      e.description,
      e.category,
      e.amount.toFixed(2),
      cards.find(c => c.id === e.cardId)?.name || 'N/A'
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_crediflow_${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header com Filtros e Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Relatórios Financeiros</h2>
            <p className="text-sm text-slate-500">Análise profunda dos seus hábitos de consumo</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select 
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 max-w-[150px]"
          >
            <option value="all">Todos Cartões</option>
            {cards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>

          <button 
            onClick={exportCSV}
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
          >
            <TableIcon size={18} /> CSV
          </button>
          <button 
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            onClick={() => window.print()}
          >
            <Download size={18} /> PDF
          </button>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Gasto Total Ano</p>
            <h4 className="text-2xl font-black text-slate-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalYear)}
            </h4>
            <div className="flex items-center gap-1 mt-2 text-emerald-500 font-bold text-xs">
              <TrendingUp size={14} /> 8% menor que 2023
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 text-slate-50 opacity-10 group-hover:scale-110 transition-transform">
            <Target size={120} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Média Mensal</p>
          <h4 className="text-2xl font-black text-slate-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(avgMonthly)}
          </h4>
          <p className="text-xs text-slate-400 mt-2">Baseado em 12 meses</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Maior Compra</p>
          <h4 className="text-2xl font-black text-slate-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(maxExpense)}
          </h4>
          <p className="text-xs text-slate-400 mt-2">Single transaction</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Categoria Top</p>
          <h4 className="text-2xl font-black text-indigo-600">
            {topCategory}
          </h4>
          <p className="text-xs text-slate-400 mt-2">Maior volume de gastos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Barras - Evolução */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-500" /> Evolução Mensal de Gastos
            </h3>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> Realizado</div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  cursor={{stroke: '#6366f1', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza - Categorias */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[450px]">
          <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
            <ArrowUpRight size={18} className="text-emerald-500" /> Distribuição por Categoria
          </h3>
          <div className="flex-1 relative">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="40%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1500}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <TrendingUp size={32} className="opacity-20" />
                 </div>
                 <p className="text-sm font-medium">Sem dados para o gráfico</p>
              </div>
            )}
          </div>
          
          <div className="space-y-3 mt-4 overflow-y-auto pr-2 max-h-[120px]">
             {categoryData.map((item, idx) => (
               <div key={item.name} className="flex items-center justify-between group">
                 <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                   <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.name}</span>
                 </div>
                 <span className="text-xs font-black text-slate-800">
                    {((item.value / totalYear) * 100).toFixed(1)}%
                 </span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Tabela de Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Maiores Lançamentos</h3>
            <span className="text-[10px] font-black uppercase text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">Top 5</span>
          </div>
          <div className="divide-y divide-slate-50">
             {filteredExpenses
               .sort((a, b) => b.amount - a.amount)
               .slice(0, 5)
               .map((exp, idx) => (
                 <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                       <span className="text-slate-300 font-black text-xl w-6">0{idx + 1}</span>
                       <div>
                         <p className="text-sm font-bold text-slate-800">{exp.description}</p>
                         <p className="text-[10px] text-slate-500 font-medium uppercase">{exp.category} • {new Date(exp.date).toLocaleDateString('pt-BR')}</p>
                       </div>
                    </div>
                    <p className="text-sm font-black text-slate-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(exp.amount)}
                    </p>
                 </div>
               ))
             }
             {filteredExpenses.length === 0 && (
               <div className="p-12 text-center text-slate-400 italic text-sm">Nenhum registro encontrado.</div>
             )}
          </div>
        </div>

        <div className="bg-indigo-900 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
             <TrendingUp size={160} />
          </div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-bold">Resumo Financeiro</h3>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Em {selectedYear}, você teve um controle {totalYear > 10000 ? 'moderado' : 'excelente'} das suas despesas. 
              Sua maior concentração de gastos está em <span className="text-white font-black underline">{topCategory}</span>.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Impacto Anual</p>
                 <p className="text-lg font-black">{totalYear > 20000 ? 'Alto' : 'Baixo'}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Perfil de Uso</p>
                 <p className="text-lg font-black">Consciente</p>
              </div>
            </div>
            <button className="w-full bg-white text-indigo-900 font-black py-4 rounded-2xl shadow-xl hover:bg-indigo-50 transition-all active:scale-[0.98]">
              Análise Detalhada IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
