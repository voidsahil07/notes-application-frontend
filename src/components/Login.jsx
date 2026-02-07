import { useState } from "react";
import api from "../api.js";

export default function Login({ onLogin, setAuthView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border">
      <h2 className="text-3xl font-bold mb-8 text-center text-teal-500">Login</h2>
      {error && <p className="text-red-500 mb-6 text-center bg-red-50 p-3 rounded">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-6 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 mb-6 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500"
          required
        />
        <button type="submit" className="w-full bg-teal-500 text-white py-4 rounded-xl text-lg font-semibold hover:bg-teal-600">
          Login
        </button>
      </form>
      <p className="text-center mt-6 text-sm">
        No account?{" "}
        <button 
          onClick={() => setAuthView("register")}
          className="text-teal-500 hover:underline font-semibold"
        >
          Register here
        </button>
      </p>
    </div>
  );
}
