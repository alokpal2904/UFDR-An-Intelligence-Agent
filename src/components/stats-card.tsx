"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatsCardProps) {
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        <div className="p-2 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg">
          <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1">
          {value}
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={`text-xs font-medium ${
                trend.isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
              from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
