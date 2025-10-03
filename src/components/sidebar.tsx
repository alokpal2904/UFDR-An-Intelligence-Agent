"use client";

import { cn } from "@/lib/utils";
import {
  FileText,
  Clock,
  BarChart3,
  Map,
  MessageSquare,
  Download,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

type SidebarItem =
  | "overview"
  | "timeline"
  | "graphs"
  | "map"
  | "chatbot"
  | "export";

interface SidebarProps {
  activeSection: SidebarItem;
  setActiveSection: (section: SidebarItem) => void;
  caseData: {
    id: string;
    name: string;
    status: string;
  };
  onItemClick?: () => void;
}

const sidebarItems = [
  {
    id: "overview" as SidebarItem,
    label: "Overview",
    icon: FileText,
  },
  {
    id: "timeline" as SidebarItem,
    label: "Timeline",
    icon: Clock,
  },
  {
    id: "graphs" as SidebarItem,
    label: "Graphs",
    icon: BarChart3,
  },
  {
    id: "map" as SidebarItem,
    label: "Map",
    icon: Map,
  },
  {
    id: "chatbot" as SidebarItem,
    label: "Chatbot",
    icon: MessageSquare,
  },
  {
    id: "export" as SidebarItem,
    label: "Export",
    icon: Download,
  },
];

export function Sidebar({
  activeSection,
  setActiveSection,
  caseData,
  onItemClick,
}: SidebarProps) {
  const handleItemClick = (section: SidebarItem) => {
    setActiveSection(section);
    onItemClick?.();
  };

  return (
    <div className="w-80 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Dashboard</span>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
            {caseData.name}
          </h1>
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                caseData.status === "completed"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              )}
            >
              {caseData.status === "completed" ? "Completed" : "Ongoing"}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ID: {caseData.id}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700/50 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-500"
                  )}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          ForensiAI v2.0
        </div>
      </div>
    </div>
  );
}
