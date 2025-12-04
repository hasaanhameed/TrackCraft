import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, List, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const { expenses } = useExpenses();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  });

  const totalThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Track Craft
          </h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">{currentMonth}</p>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle>Total Spent This Month</CardTitle>
            <CardDescription>Your monthly expense summary</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">
              PKR {totalThisMonth.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle>By Category</CardTitle>
            <CardDescription>Breakdown of expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(categoryTotals).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(categoryTotals).map(([category, total]) => (
                  <div key={category} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                    <span className="font-medium">{category}</span>
                    <span className="text-lg font-semibold text-primary">
                      PKR {total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No expenses this month yet
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            size="lg" 
            variant="outline"
            className="h-20 text-lg"
            onClick={() => navigate('/add-expense')}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-20 text-lg"
            onClick={() => navigate('/expenses')}
          >
            <List className="h-5 w-5 mr-2" />
            View All Expenses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;