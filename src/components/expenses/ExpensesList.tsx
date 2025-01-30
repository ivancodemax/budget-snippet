import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpenseForm } from "./ExpenseForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Expense {
  id: string;
  amount: number;
  category: string;
  notes: string;
  date: string;
}

interface ExpensesListProps {
  expenses: Expense[];
  onExpenseUpdated: () => void;
}

export function ExpensesList({ expenses, onExpenseUpdated }: ExpensesListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      toast.success("Expense deleted successfully");
      onExpenseUpdated();
    } catch (error: any) {
      toast.error("Error deleting expense: " + error.message);
    }
  };

  const handleEdit = async (expense: {
    amount: number;
    category: string;
    notes: string;
    date: string;
  }) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .update({
          amount: expense.amount,
          category: expense.category,
          notes: expense.notes,
          date: expense.date,
        })
        .eq("id", editingExpense?.id);

      if (error) throw error;
      toast.success("Expense updated successfully");
      setEditingExpense(null);
      onExpenseUpdated();
    } catch (error: any) {
      toast.error("Error updating expense: " + error.message);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{expense.category}</h3>
                  <p className="text-sm text-gray-500">{expense.notes}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(expense.date)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold text-primary">
                    {formatAmount(expense.amount)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingExpense(expense)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <p className="text-center text-gray-500">No expenses yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              onSubmit={handleEdit}
              initialExpense={editingExpense}
              submitLabel="Update Expense"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}