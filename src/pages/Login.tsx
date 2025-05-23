import { useState } from "react";
import users from "../db/usersDB"; // Import the users array

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Query the users array for the user
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", user.role);
      window.dispatchEvent(new Event("authChange")); // Notify other tabs/components
      window.location.replace("/"); // Reloads the page and navigates to "/"
    } else {
      alert("Invalid username or password");
    }

    // Placeholder for MongoDB --------------------------------------------------------------> sesuain sama db aslinya
    /*
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("role", data.role);
          navigate("/");
        } else {
          alert("Invalid username or password");
        }
      } else {
        alert("Error logging in. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to the server.");
    }
    */
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      <form className="w-full max-w-md" onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}
