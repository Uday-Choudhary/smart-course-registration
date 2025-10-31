import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../api/client";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await login(email, password);
      // Optional: fetch profile to route by role
      const profile = await apiClient.get("/api/profile", { auth: true });
      const role = profile?.user?.role;
      if (role === "Admin") navigate("/admin");
      else if (role === "Faculty") navigate("/faculty");
      else navigate("/student");
    } catch (err) {
      setError(err?.data?.error || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

      {/* Outer container centers the card vertically & horizontally */}
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <div className="w-full max-w-md rounded-xl px-6 py-8 border border-slate-700 bg-slate-800 text-white text-sm">
          <h2 className="text-2xl font-semibold text-center">Sign In</h2>
          <p className="text-slate-300 mt-1 text-center">Login to your account</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-slate-300"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 mb-0 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-slate-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 mb-0 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="text-right">
              <a
                href="#"
                className="font-medium text-indigo-400 hover:text-indigo-300 text-sm"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full mt-2 px-4 py-2.5 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="text-center mt-4 text-sm">
            Don&apos;t have an account? <Link to="/register" className="underline">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
