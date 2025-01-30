import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpensesList } from "@/components/expenses/ExpensesList";
import { ExpensesChart } from "@/components/expenses/ExpensesChart";
import { MonthlyFlowChart } from "@/components/expenses/MonthlyFlowChart";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface User {
  email: string;
  id: string;
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
  const [showSignup, setShowSignup] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          email: session.user.email || "",
          id: session.user.id,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email || "",
          id: session.user.id,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: expenses = [], refetch: refetchExpenses } = useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        toast.error("Failed to fetch expenses");
        return [];
      }
      return data;
    },
    enabled: !!user,
  });

  const handleAuth = async (email: string, password: string) => {
    if (isAuthLoading) {
      toast.error("Please wait before trying again");
      return;
    }

    try {
      setIsAuthLoading(true);
      let { error } = showSignup
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin + "/email-confirmed",
              data: {
                email: email,
              }
            }
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) {
        if (error.message.includes('rate_limit')) {
          toast.error("Please wait a moment before trying again");
        } else {
          toast.error(error.message);
        }
        return;
      }

      // Show success message
      if (showSignup) {
        toast.success("Please check your email to confirm your account!", {
          duration: 6000,
          description: "We've sent you an email with a confirmation link."
        });
      } else {
        toast.success("Logged in successfully!");
      }
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error("Error logging out");
    }
  };

  const handleAddExpense = async (expenseData: Omit<Expense, "id">) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("expenses").insert({
        ...expenseData,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Transaction added successfully!");
      refetchExpenses();
    } catch (error: any) {
      toast.error("Error adding transaction: " + error.message);
    }
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
          disabled={isAuthLoading}
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
              onClick={handleLogout}
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

        <MonthlyFlowChart expenses={expenses} />

        <ExpensesList expenses={expenses} onExpenseUpdated={refetchExpenses} />
      </div>
    </div>
  );
};

export default Index;
