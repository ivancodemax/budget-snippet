import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Expense {
  id: string;
  amount: number;
  category: string;
  notes: string;
  date: string;
}

interface ExpensesListProps {
  expenses: Expense[];
}

export function ExpensesList({ expenses }: ExpensesListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
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
                <p className="text-xs text-gray-400">{formatDate(expense.date)}</p>
              </div>
              <div className="text-lg font-semibold text-primary">
                {formatAmount(expense.amount)}
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <p className="text-center text-gray-500">No expenses yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}