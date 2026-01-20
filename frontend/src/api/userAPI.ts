const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const response = await fetch(`${BASE_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const data = await response.json();
  return data;
};

// Get current user info using JWT token
export const getCurrentUser = async (token: string) => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  const data = await response.json();
  return data;
};

export const getUserById = async (userId: number, token: string) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  return data;
};

export const updateMonthlyLimit = async (
  userId: number,
  monthlyLimit: number,
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/users/${userId}/monthly-limit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      monthly_limit: monthlyLimit,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update monthly limit");
  }

  const data = await response.json();
  return data;
};
