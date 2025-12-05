import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Type for a single expense (from backend)
export interface Expense {
  id: number;
  user_id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
}

// Type for creating an expense (frontend form)
export interface NewExpense {
  amount: number;
  description: string;
  category: string;
  date: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const useExpenses = () => {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // GET all expenses - wrapped in useCallback
  const fetchExpenses = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE}/expenses/get_expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data: Expense[] = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, [token]);

  // Fetch all expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ADD a new expense
  const addExpense = async (expense: NewExpense) => {
    try {
      const response = await fetch(`${API_BASE}/expenses/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expense),
      });
      if (!response.ok) throw new Error("Failed to add expense");
      // Refresh list
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // UPDATE an expense
  const updateExpense = async (id: number, expense: NewExpense) => {
    try {
      const response = await fetch(`${API_BASE}/expenses/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expense),
      });
      if (!response.ok) throw new Error("Failed to update expense");
      // Refresh list
      fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  // DELETE an expense
  const deleteExpense = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/expenses/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete expense");
      
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return { expenses, addExpense, updateExpense, deleteExpense };
};