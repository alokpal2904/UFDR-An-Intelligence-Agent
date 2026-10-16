"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    try {
      // Replace with actual registration logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Signup attempt:", formData);
      // Handle successful signup - redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      // Handle signup error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create account"
      description="Join ForensiAI to get started"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-['Space_Mono']">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-sm font-medium text-cyan-300 font-['Orbitron']"
          >
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 h-4 w-4" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              className={`pl-10 transition-all duration-300 ${
                errors.name
                  ? "border-red-500/50 focus:border-red-400 shadow-[0_0_10px_rgba(255,68,68,0.2)]"
                  : ""
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-300 font-['Space_Mono']">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-cyan-300 font-['Orbitron']"
          >
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 h-4 w-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className={`pl-10 transition-all duration-300 ${
                errors.email
                  ? "border-red-500/50 focus:border-red-400 shadow-[0_0_10px_rgba(255,68,68,0.2)]"
                  : ""
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-300 font-['Space_Mono']">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-cyan-300 font-['Orbitron']"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 h-4 w-4" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              className={`pl-10 transition-all duration-300 ${
                errors.password
                  ? "border-red-500/50 focus:border-red-400 shadow-[0_0_10px_rgba(255,68,68,0.2)]"
                  : ""
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-300 font-['Space_Mono']">
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-cyan-300 font-['Orbitron']"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 h-4 w-4" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`pl-10 transition-all duration-300 ${
                errors.confirmPassword
                  ? "border-red-500/50 focus:border-red-400 shadow-[0_0_10px_rgba(255,68,68,0.2)]"
                  : ""
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-300 font-['Space_Mono']">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="text-xs text-slate-300 bg-slate-800/60 backdrop-blur-md p-3 rounded-md border border-cyan-500/10 font-['Space_Mono']">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="text-cyan-300 hover:text-cyan-200 hover:underline transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-cyan-300 hover:text-cyan-200 hover:underline transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
          >
            Privacy Policy
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] disabled:opacity-50 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 hover:border-emerald-400 font-['Orbitron'] matrix-glow-hover"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin" />
              <span>Creating account...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-slate-300 font-['Space_Mono']">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-cyan-300 hover:text-cyan-200 hover:underline font-medium transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
