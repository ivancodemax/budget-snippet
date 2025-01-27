import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpensesList } from "@/components/expenses/ExpensesList";
import { ExpensesChart } from "@/components/expenses/ExpensesChart";
import { toast } from "sonner";

interface User {
  email: string;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  notes: string;
  date: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showSignup, setShowSignup] = useState(false);

  const handleAuth = (email: string, password: string) => {
    // In a real app, this would call an authentication API
    setUser({ email });
    toast.success("Authentication successful!");
  };

  const handleAddExpense = (expenseData: Omit<Expense, "id">) => {
    const newExpense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses([newExpense, ...expenses]);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold mb-8 text-primary">Expense Tracker</h1>
        <AuthForm
          type={showSignup ? "signup" : "login"}
          onSubmit={handleAuth}
        />
        <button
          onClick={() => setShowSignup(!showSignup)}
          className="mt-4 text-sm text-gray-600 hover:text-primary"
        >
          {showSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.email}</span>
            <button
              onClick={() => setUser(null)}
              className="text-sm text-gray-600 hover:text-primary"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExpenseForm onSubmit={handleAddExpense} />
          <ExpensesChart expenses={expenses} />
        </div>

        <ExpensesList expenses={expenses} />
      </div>
    </div>
  );
};

export default Index;