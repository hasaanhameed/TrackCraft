import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Target, Edit, AlertTriangle } from "lucide-react";
import { updateMonthlyLimit } from "@/api/userAPI";
import { useAuth } from "@/contexts/AuthContext";

interface MonthlyLimitCardProps {
  monthlyLimit: number | null;
  totalSpent: number;
  onLimitUpdated: () => void;
}

const MonthlyLimitCard = ({
  monthlyLimit,
  totalSpent,
  onLimitUpdated,
}: MonthlyLimitCardProps) => {
  const [open, setOpen] = useState(false);
  const [limitValue, setLimitValue] = useState(monthlyLimit?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSaveLimit = async () => {
    if (!user?.id || !limitValue) return;

    setIsLoading(true);
    try {
      await updateMonthlyLimit(user.id, parseFloat(limitValue));
      onLimitUpdated();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update monthly limit:", error);
      alert("Failed to update monthly limit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const percentageUsed = monthlyLimit ? (totalSpent / monthlyLimit) * 100 : 0;
  const isOverBudget = monthlyLimit ? totalSpent > monthlyLimit : false;

  return (
    <Card
      className={`shadow-lg ${isOverBudget ? "border-destructive/50" : "border-primary/10"}`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Monthly Budget
            </CardTitle>
            <CardDescription>
              {monthlyLimit
                ? "Track your spending against your budget"
                : "Set a budget to track your expenses"}
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                {monthlyLimit ? (
                  <Edit className="h-4 w-4 mr-2" />
                ) : (
                  <Target className="h-4 w-4 mr-2" />
                )}
                {monthlyLimit ? "Edit" : "Set Budget"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {monthlyLimit
                    ? "Update Monthly Budget"
                    : "Set Monthly Budget"}
                </DialogTitle>
                <DialogDescription>
                  Enter your desired monthly spending budget. This helps you
                  track and manage your expenses better.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="limit">Budget Amount (PKR)</Label>
                  <Input
                    id="limit"
                    type="number"
                    placeholder="e.g., 20000"
                    value={limitValue}
                    onChange={(e) => setLimitValue(e.target.value)}
                    min="0"
                    step="100"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveLimit}
                  disabled={isLoading || !limitValue}
                >
                  {isLoading ? "Saving..." : "Save Budget"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {monthlyLimit ? (
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-sm text-muted-foreground">Spent</p>
                <p
                  className={`text-3xl font-bold ${isOverBudget ? "text-destructive" : "text-primary"}`}
                >
                  PKR {totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-2xl font-semibold text-muted-foreground">
                  PKR {monthlyLimit.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {percentageUsed.toFixed(1)}% used
                </span>
                <span
                  className={
                    isOverBudget
                      ? "text-destructive font-medium"
                      : "text-muted-foreground"
                  }
                >
                  PKR {Math.abs(monthlyLimit - totalSpent).toFixed(2)}{" "}
                  {isOverBudget ? "over" : "remaining"}
                </span>
              </div>
              <Progress
                value={Math.min(percentageUsed, 100)}
                className={`h-3 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
              />
            </div>

            {isOverBudget && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Budget Exceeded
                  </p>
                  <p className="text-xs text-destructive/80 mt-1">
                    You've spent PKR {(totalSpent - monthlyLimit).toFixed(2)}{" "}
                    more than your monthly budget.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-4">
              No budget set yet. Click "Set Budget" to start tracking your
              expenses.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyLimitCard;
