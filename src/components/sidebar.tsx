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
    <div className="w-80 h-full bg-slate-900/90 backdrop-blur-md border-r border-cyan-500/20 flex flex-col matrix-glass matrix-scan-line">
      {/* Header */}
      <div className="p-6 border-b border-cyan-500/20">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 text-cyan-200 hover:text-cyan-300 transition-all duration-300 mb-4 font-['Space_Mono'] hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)] matrix-glow-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Dashboard</span>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-cyan-200/70 mb-1 font-['Orbitron'] tracking-wide">
            {caseData.name}
          </h1>
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium font-['Space_Mono']",
                caseData.status === "completed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              )}
            >
              {caseData.status === "completed" ? "Completed" : "Ongoing"}
            </div>
            <span className="text-xs text-slate-400 font-['Space_Mono']">
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
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 font-['Space_Mono'] matrix-glow-hover",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border border-cyan-500/40 shadow-lg matrix-glow"
                    : "text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-200 hover:border-cyan-500/20 border border-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    isActive
                      ? "text-cyan-300"
                      : "text-slate-400 group-hover:text-cyan-400"
                  )}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,255,255,0.6)] animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-cyan-500/20">
        <div className="text-xs text-slate-400 text-center font-['Space_Mono']">
          ForensiAI v2.0
        </div>
      </div>
    </div>
  );
}
