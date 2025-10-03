"use client";

import { StatsCard } from "@/components/stats-card";
import { UploadBox } from "@/components/upload-box";
import { CaseList } from "@/components/case-list";
import { FolderOpen, Clock, CheckCircle, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  // Dummy stats data - replace with real data from API
  const stats = {
    totalCases: 127,
    ongoingCases: 23,
    completedCases: 104,
  };

  const handleFileUpload = (file: File) => {
    // Handle file upload logic here
    console.log("Uploaded file:", file.name);
    // TODO: Implement file upload to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-800 to-blue-500 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back! Here's an overview of your forensic analysis cases.
          </p>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Cases"
            value={stats.totalCases}
            icon={FolderOpen}
            description="All forensic cases"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Ongoing Cases"
            value={stats.ongoingCases}
            icon={Clock}
            description="Currently active"
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Completed Cases"
            value={stats.completedCases}
            icon={CheckCircle}
            description="Successfully closed"
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
            New Analysis
          </h2>
          <UploadBox onFileUpload={handleFileUpload} />
        </div>

        {/* Past Cases Section */}
        <div>
          <CaseList />
        </div>
      </div>
    </div>
  );
}
