import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

interface MonthlyFlowChartProps {
  expenses: Expense[];
}

export function MonthlyFlowChart({ expenses }: MonthlyFlowChartProps) {
  const CATEGORIES = [
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Bills",
    "Other"
  ];

  const getMonthData = () => {
    const monthlyData: Record<string, { 
      moneyIn: number; 
      moneyOut: number;
      categories: Record<string, number>;
    }> = {};
    
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { 
          moneyIn: 0, 
          moneyOut: 0,
          categories: {}
        };
      }
      
      if (expense.category === "Income") {
        monthlyData[monthKey].moneyIn += expense.amount;
      } else {
        monthlyData[monthKey].moneyOut += expense.amount;
        if (!monthlyData[monthKey].categories[expense.category]) {
          monthlyData[monthKey].categories[expense.category] = 0;
        }
        monthlyData[monthKey].categories[expense.category] += expense.amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        moneyIn: data.moneyIn,
        moneyOut: data.moneyOut,
        netCashflow: data.moneyIn - data.moneyOut,
        ...data.categories
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  };

  const data = getMonthData();
  const categoryColors = {
    "Food": "#FF6B6B",
    "Transport": "#4ECDC4",
    "Entertainment": "#45B7D1",
    "Shopping": "#96CEB4",
    "Bills": "#FFEEAD",
    "Other": "#FFD93D"
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center space-y-2">
        <h2 className="text-xl font-semibold">Money In & Out</h2>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={data[data.length - 1]?.month} className="w-full">
          <TabsList className="w-full justify-start mb-4 overflow-x-auto">
            {data.map((monthData) => (
              <TabsTrigger key={monthData.month} value={monthData.month}>
                {formatMonth(monthData.month)}
              </TabsTrigger>
            ))}
          </TabsList>

          {data.map((monthData) => (
            <TabsContent key={monthData.month} value={monthData.month}>
              <div className="text-center mb-6">
                <div className="text-sm text-gray-500">Net cashflow</div>
                <div className={`text-3xl font-bold ${monthData.netCashflow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(monthData.netCashflow)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatMonth(monthData.month)}
                </div>
              </div>

              <div className="h-[300px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[monthData]} barGap={0}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={formatMonth}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Bar dataKey="moneyIn" name="Money In" fill="#4ECDC4" />
                    <Bar dataKey="moneyOut" name="Money Out" fill="#FF6B6B" />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Money In</div>
                    <div className="text-xl font-semibold text-[#4ECDC4]">
                      {formatCurrency(monthData.moneyIn)}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Money Out</div>
                    <div className="text-xl font-semibold text-[#FF6B6B]">
                      {formatCurrency(monthData.moneyOut)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] }}
                        />
                        <span>{category}</span>
                      </div>
                      <div className="font-semibold">
                        {formatCurrency(monthData[category] || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}