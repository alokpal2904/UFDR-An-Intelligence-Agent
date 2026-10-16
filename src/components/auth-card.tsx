"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 p-4 relative">
      <Card className="w-full max-w-md shadow-2xl border border-cyan-500/20 bg-slate-900/90 backdrop-blur-lg rounded-xl matrix-glass matrix-float hover:border-cyan-400/30 transition-all duration-500">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold text-cyan-200/70 tracking-tight font-['Orbitron']">
              ForensiAI
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.5)]"></div>
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-cyan-200/70 font-['Orbitron'] tracking-wide">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-slate-300 mt-2 font-['Space_Mono']">
                {description}
              </CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </div>
  );
}
