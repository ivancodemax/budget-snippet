import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpensesChartProps {
  expenses: Expense[];
}

export function ExpensesChart({ expenses }: ExpensesChartProps) {
  const getDayName = (date: string) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const d = new Date(date);
    // Get day of week (0-6, starting from Sunday)
    const day = d.getDay();
    // Convert to Monday-based index (0-6, starting from Monday)
    const mondayBasedIndex = day === 0 ? 6 : day - 1;
    return dayNames[mondayBasedIndex];
  };

  // Get dates for Mon-Sun of current week
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    // Calculate days to subtract to get to Monday (0 = Sunday, so we need 6 for Monday)
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);
    monday.setHours(0, 0, 0, 0); // Reset time part
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();
  
  const chartData = weekDates.map((date) => {
    const dayExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      const compareDate = new Date(date);
      return expenseDate.toDateString() === compareDate.toDateString();
    });
    const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      day: getDayName(date),
      amount: total,
    };
  });

  // Sort the data to ensure Monday comes first
  const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const sortedChartData = [...chartData].sort((a, b) => 
    orderedDays.indexOf(a.day) - orderedDays.indexOf(b.day)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(Number(value))
                }
              />
              <Bar dataKey="amount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}