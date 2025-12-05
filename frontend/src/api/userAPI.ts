const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const createUser = async (name: string, email: string, password: string) => {
  // Making a POST request to create a new user
  const response = await fetch(`${BASE_URL}/users/signup`, {
    method: 'POST', // HTTP method
    headers: {
      'Content-Type': 'application/json', // Specify the content type as JSON
    },
    body: JSON.stringify({
      name,       // Name to be passed in the body
      email,      // Email to be passed in the body
      password,   // Password to be passed in the body
    }),
  });

  // If the response is not ok (e.g., status code not in the 2xx range), throw an error
  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  // Parse the response JSON
  const data = await response.json();

  // Return the response data (the created user info)
  return data;
};