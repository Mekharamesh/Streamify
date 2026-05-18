import React, { useState } from "react";
import { ShipWheel } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // ✅ FIXED
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "./lib/api";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
      const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
      });

      const { isPending, error, signupMutation } = useSignUp(); // ✅ FIXED

      const handleSignup = (e) => {
        e.preventDefault();
        signupMutation(signupData);
      };

  return (
       <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      
      {/* MAIN CONTAINER */}
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
          
          {/* LOGO */}
          <div className="mb-6 flex items-center gap-2">
            <ShipWheel className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>
          
            {error &&(
              <div className="alert alert-error mb-4">
                <span>{error.response.data.message}</span>
              </div>
            )} 

          {/* FORM */}
          <form onSubmit={handleSignup} className="space-y-4">
            
            <div>
              <h2 className="text-xl font-semibold">Create an Account</h2>
              <p className="text-sm opacity-70">
                Join Streamify and start your language learning adventure!
              </p>
            </div>

            {/* Full Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
                placeholder="John Doe"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                placeholder="hello@gmail.com"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                placeholder="********"
                className="input input-bordered w-full"
                required
              />
              <p className="text-xs opacity-70 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Checkbox */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox checkbox-sm" required />
                <span className="text-xs leading-tight">
                  I agree to the{" "}
                  <span className="text-primary hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary hover:underline">
                    Privacy Policy
                  </span>
                </span>
              </label>
            </div>

            {/* Button */}
            <button type="submit" className="btn btn-primary w-full">
              {isPending? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Loading...
                </>
              ): (
                "Create Account"
              )}
            </button>

            {/* Login link */}
            <div className="text-center mt-4">
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-primary/10">
          <div className="max-w-md p-8">
            
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
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

export default SignUpPage;