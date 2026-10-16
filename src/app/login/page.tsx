"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
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
      // Replace with actual authentication logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Login attempt:", formData);
      // Handle successful login - redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // Handle login error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your ForensiAI account"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-['Space_Mono']">
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
              placeholder="Enter your password"
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

        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-sm text-cyan-300 hover:text-cyan-200 hover:underline transition-all duration-300 font-['Space_Mono'] hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] disabled:opacity-50 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400 font-['Orbitron'] matrix-glow-hover"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-slate-300 font-['Space_Mono']">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-cyan-300 hover:text-cyan-200 hover:underline font-medium transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
