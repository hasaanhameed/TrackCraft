import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { updateExpense } from "@/api/expenseAPI";
import { useExpenses } from "@/hooks/useExpenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EXPENSE_CATEGORIES } from "@/types/expense";

const EditExpense = () => {
  const { isAuthenticated } = useAuth();
  const { expenses } = useExpenses();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Find the expense to edit
    if (id && expenses.length > 0) {
      const expense = expenses.find((exp) => exp.id === parseInt(id));
      if (expense) {
        setAmount(expense.amount.toString());
        setDescription(expense.description);
        setCategory(expense.category);
        setDate(expense.date);
        setLoading(false);
      } else {
        toast({
          title: "Error",
          description: "Expense not found",
          variant: "destructive",
        });
        navigate("/expenses");
      }
    }
  }, [isAuthenticated, navigate, id, expenses, toast]);

  const validateForm = () => {
    // Check if all fields are filled
    if (!amount || !description || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }

    // Validate amount is a positive number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number for amount",
        variant: "destructive",
      });
      return false;
    }

    if (amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than zero",
        variant: "destructive",
      });
      return false;
    }

    if (amountNum > 1000000000) {
      toast({
        title: "Invalid Amount",
        description: "Amount is too large",
        variant: "destructive",
      });
      return false;
    }

    // Validate description length
    if (description.trim().length < 3) {
      toast({
        title: "Invalid Description",
        description: "Description must be at least 3 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (description.length > 200) {
      toast({
        title: "Invalid Description",
        description: "Description must be less than 200 characters",
        variant: "destructive",
      });
      return false;
    }

    // Validate date is not in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (selectedDate > today) {
      toast({
        title: "Invalid Date",
        description: "Date cannot be in the future",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Session Expired",
          description: "Please login again",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      await updateExpense(token, parseInt(id), {
        amount: parseFloat(amount),
        description: description.trim(),
        category,
        date,
      });

      toast({
        title: "Success",
        description: "Expense updated successfully",
      });

      navigate("/expenses");
    } catch (error) {
      if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to update expense",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/expenses")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Expenses
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Expense</CardTitle>
            <CardDescription>Update your expense details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (PKR)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    PKR
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1000000000"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-14"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="What did you spend on?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/200 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Update Expense
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditExpense;