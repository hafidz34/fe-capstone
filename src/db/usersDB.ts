// --- MongoDB/Express Backend Example for Production ---
// Replace the dummy users array with API calls to your backend.
// This example assumes you have an Express server with a /api/login endpoint
// and a MongoDB "users" collection. Adjust the endpoint and logic as needed.

/*
import axios from "axios";

export type User = {
  username: string;
  password: string;
  role: "user" | "admin";
};

// Call this function in your Login page instead of searching the dummy array
export async function loginUser(username: string, password: string): Promise<User | null> {
  try {
    // Change this URL to your actual backend endpoint
    const response = await axios.post("http://localhost:5000/api/login", {
      username,
      password,
    });

    // The backend should return user data if authentication is successful
    // Adjust this according to your backend's response structure
    if (response.data && response.data.isAuthenticated) {
      // Example: { isAuthenticated: true, user: { username, role } }
      return {
        username: response.data.user.username,
        password: "", // Never store or return the password!
        role: response.data.user.role, // "user" or "admin"
      };
    }
    return null;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}
*/

// --- For development/testing, use the dummy users array below ---
export type User = {
  username: string;
  password: string;
  role: "user" | "admin";
};

const users: User[] = [
  { username: "user", password: "password123", role: "user" },
  { username: "admin", password: "admin123", role: "admin" },
];

export default users;