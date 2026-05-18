import React from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "./lib/api.js";
import useLogin from "../hooks/useLogin.js";

const LoginPage = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  const {isPending, error,loginMutation} = useLogin()

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-[#111111] border border-gray-800 rounded-xl shadow-lg overflow-hidden">

        {/* LEFT SIDE (FORM) */}
        <div className="w-full lg:w-1/2 p-8">

          {/* LOGO */}
          <div className="flex items-center gap-2 mb-6">
            <ShipWheelIcon className="text-green-500" size={28} />
            <h1 className="text-2xl font-bold text-green-500">Streamify</h1>
          </div>

          {/* TITLE */}
          <h2 className="text-lg font-semibold text-white mb-1">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Sign in to your account to continue your language journey
          </p>

          {/* ERROR */}
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-2 rounded mb-4">
              {error?.response?.data?.message || "Login failed"}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="mt-1 w-full px-4 py-2 rounded-md bg-[#0b0b0b] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                placeholder="********"
                className="mt-1 w-full px-4 py-2 rounded-md bg-[#0b0b0b] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2 rounded-md bg-green-500 hover:bg-green-600 text-black font-semibold transition"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-green-500 hover:underline">
                  Create one
                </Link>
              </p>
            </div>

          </form>
        </div>

        {/* RIGHT SIDE (IMAGE) */}
        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-primary/10">

          <div className="max-w-md p-8">

            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6 ">
              <h2 className="text-xl font-semibold">
                Connect with Language partners worldwide
              </h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;