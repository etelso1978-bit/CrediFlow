
import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CardList from './components/CardList';
import ExpenseModal from './components/ExpenseModal';
import CardModal from './components/CardModal';
import InvoiceView from './components/InvoiceView';
import ReportsView from './components/ReportsView';
import { CreditCard, Expense, AppState } from './types';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_CARDS: CreditCard[] = [
  { id: '1', name: 'Nubank Platinum', bank: 'Nubank', limitTotal: 5000, closingDay: 5, dueDay: 12, brand: 'Mastercard', color: '#820ad1' },
  { id: '2', name: 'Itaú Personalité', bank: 'Itaú', limitTotal: 15000, closingDay: 20, dueDay: 28, brand: 'Visa', color: '#ff7800' }
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'e1', cardId: '1', amount: 45.90, description: 'iFood Jantar', date: new Date().toISOString(), category: 'Alimentação', installments: 1, recurring: false },
  { id: 'e2', cardId: '1', amount: 200.00, description: 'Posto Shell', date: new Date().toISOString(), category: 'Transporte', installments: 1, recurring: false },
  { id: 'e3', cardId: '2', amount: 1500.00, description: 'iPhone 15 Pro', date: new Date().toISOString(), category: 'Outros', installments: 10, recurring: false },
];

const App: React.FC = () => {
  const [state, setState] = React.useState<AppState>(() => {
    const saved = localStorage.getItem('crediflow_state_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    }
    return {
      cards: INITIAL_CARDS,
      expenses: INITIAL_EXPENSES,
      theme: 'light'
    };
  });

  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false);
  const [editingCard, setEditingCard] = React.useState<CreditCard | null>(null);

  // Efeito para aplicar o tema no HTML
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('crediflow_state_v2', JSON.stringify(state));
  }, [state]);

  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4()
    };
    setState(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };

  const handleSaveCard = (cardData: Omit<CreditCard, 'id'> & { id?: string }) => {
    setState(prev => {
      let newCards;
      if (cardData.id) {
        newCards = prev.cards.map(c => c.id === cardData.id ? { ...cardData, id: cardData.id } as CreditCard : c);
      } else {
        const newCard: CreditCard = { ...cardData, id: uuidv4() } as CreditCard;
        newCards = [...prev.cards, newCard];
      }
      return { ...prev, cards: newCards };
    });
    setIsCardModalOpen(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (id: string) => {
    const card = state.cards.find(c => c.id === id);
    if (!card) return;

    if (window.confirm(`Deseja realmente excluir o cartão "${card.name}"? Todas as despesas vinculadas a ele serão removidas permanentemente.`)) {
      setState(prev => {
        const filteredCards = prev.cards.filter(c => c.id !== id);
        const filteredExpenses = prev.expenses.filter(e => e.cardId !== id);
        return {
          ...prev,
          cards: filteredCards,
          expenses: filteredExpenses
        };
      });
    }
  };

  const openNewCardModal = () => {
    setEditingCard(null);
    setIsCardModalOpen(true);
  };

  const openEditCardModal = (card: CreditCard) => {
    setEditingCard(card);
    setIsCardModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard expenses={state.expenses} cards={state.cards} />;
      case 'cards':
        return (
          <CardList 
            cards={state.cards} 
            onAddCard={openNewCardModal} 
            onEditCard={openEditCardModal}
            onDeleteCard={handleDeleteCard} 
          />
        );
      case 'invoices':
        return <InvoiceView expenses={state.expenses} cards={state.cards} />;
      case 'reports':
        return <ReportsView expenses={state.expenses} cards={state.cards} />;
      case 'settings':
        return (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto shadow-sm transition-colors">
             <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 px-2">Configurações</h3>
             <div className="space-y-4">
                <div 
                  className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer transition-all"
                  onClick={toggleTheme}
                >
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-200">Modo Escuro</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Aparência otimizada para ambientes escuros</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${state.theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${state.theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 mt-4 px-2">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">Segurança e Dados</p>
                  <button 
                    onClick={() => {
                      if (window.confirm("Isso apagará todos os seus dados. Continuar?")) {
                        localStorage.removeItem('crediflow_state_v2');
                        window.location.reload();
                      }
                    }}
                    className="w-full text-left text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 p-4 rounded-xl transition-colors border border-transparent"
                  >
                    Resetar Todos os Dados
                  </button>
                </div>
             </div>
          </div>
        );
      default:
        return <Dashboard expenses={state.expenses} cards={state.cards} />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddExpense={() => setIsExpenseModalOpen(true)}
      >
        {renderContent()}
      </Layout>

      <ExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)}
        cards={state.cards}
        onAdd={handleAddExpense}
      />

      <CardModal 
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        editingCard={editingCard}
      />
    </>
  );
};

export default App;
