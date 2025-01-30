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
    const day = d.getDay();
    const mondayBasedIndex = day === 0 ? 6 : day - 1;
    return dayNames[mondayBasedIndex];
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const isDateInSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const weekDates = getCurrentWeekDates();
  
  const chartData = weekDates.map((date) => {
    const dayExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return isDateInSameDay(expenseDate, date) && e.category !== "Income";
    });
    const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      day: getDayName(date.toISOString()),
      amount: total,
    };
  });

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
              <Bar dataKey="amount" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}