export const createExpense = async (token: string, expenseData: 
    {
        amount: number;
        description: string;
        category: string;
        date: string;
    }
) => {
  const response = await fetch("http://127.0.0.1:8000/expenses/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    throw new Error("Failed to create expense");
  }

  return response.json();
};

export const getAllExpenses = async (token: string) => {
  const response = await fetch("http://127.0.0.1:8000/expenses/get_expenses", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return await response.json();
};

export const updateExpense = async (
  token: string,
  id: number,
  expenseData: {
    amount: number;
    description: string;
    category: string;
    date: string;
  }
) => {
  const response = await fetch(`http://127.0.0.1:8000/expenses/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    throw new Error("Failed to update expense");
  }

  return response.json();
};  