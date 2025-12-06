const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const loginUser = async (email: string, password: string) => {
  // Debug logs
  console.log("🔍 VITE_API_URL from env:", import.meta.env.VITE_API_URL);
  console.log("🔍 BASE_URL being used:", BASE_URL);
  console.log("🔍 Full URL:", `${BASE_URL}/login`);
  console.log("🔍 All env vars:", import.meta.env);

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email,
      password: password,
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await response.json();
  return data; // contains access_token + token_type
};