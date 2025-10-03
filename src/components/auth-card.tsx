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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white dark:bg-slate-900 rounded-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-800 to-blue-500 bg-clip-text text-transparent tracking-tight">
              ForensiAI
            </h1>
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-800 to-blue-500 mx-auto mt-2 rounded-full"></div>
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
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
