import { useState } from "react";
import Navbar from "../src/components/Navbar";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data.error || "Registration failed.");
    } else {
      setSuccessMsg("Registration successful! You can now log in.");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Account</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full max-w-sm">
          <input
            type="text"
            placeholder="Username"
            className="p-3 border border-gray-300 rounded text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`p-3 text-white font-semibold rounded transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 text-red-600 font-semibold">{errorMsg}</div>
        )}
        {successMsg && (
          <div className="mt-4 text-green-600 font-semibold">{successMsg}</div>
        )}

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Log in here
          </a>
        </p>
      </div>
    </>
  );
}
