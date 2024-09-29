// import LoginForm from '@/components/LoginForm/LoginForm';

// export default function AdminLogin() {
//   return (
//     <main className="flex flex-col items-center justify-center p-10 mt-20">
//       <h1 className="underline text-3xl font-medium">Admin Login</h1>
//       <div className="mt-20">
//         <LoginForm />
//       </div>
//     </main>
//   );
// }

import React, { useState } from "react";
import { useRouter } from "next/router";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Store token in local storage
        router.push("/admin/viewSuggestion"); // Redirect to view suggestions
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Admin Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default AdminLogin;
