"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { CaseOverview } from "@/components/case-overview";
import { CaseTimeline } from "@/components/case-timeline";
import { CaseGraphs } from "@/components/case-graphs";
import { CaseMap } from "@/components/case-map";
import { CaseChatbot } from "@/components/case-chatbot";
import { CaseExport } from "@/components/case-export";
import { ClientWrapper } from "@/components/client-wrapper";

type SidebarItem =
  | "overview"
  | "timeline"
  | "graphs"
  | "map"
  | "chatbot"
  | "export";

// Dummy case data - in real app, this would come from API
const getCaseData = (id: string) => ({
  id,
  name: `Case #2024-${id.padStart(3, "0")}`,
  dateOpened: "2024-01-15",
  status: "completed" as const,
  description: "iPhone 14 Pro data extraction and analysis",
  fileSize: "2.3 GB",
  fileName: "evidence_mobile_device.ufdr",
  investigator: "Agent Smith",
  priority: "High",
  location: "New York, NY",
});

export default function CaseDetailsPage() {
  const params = useParams();
  const caseId = params.id as string;
  const [activeSection, setActiveSection] = useState<SidebarItem>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const caseData = getCaseData(caseId);

  const renderMainContent = () => {
    switch (activeSection) {
      case "overview":
        return <CaseOverview caseData={caseData} />;
      case "timeline":
        return <CaseTimeline caseId={caseId} />;
      case "graphs":
        return <CaseGraphs caseId={caseId} />;
      case "map":
        return <CaseMap caseId={caseId} />;
      case "chatbot":
        return <CaseChatbot caseId={caseId} />;
      case "export":
        return <CaseExport caseData={caseData} />;
      default:
        return <CaseOverview caseData={caseData} />;
    }
  };

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex h-screen">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              caseData={caseData}
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-80 h-full" onClick={(e) => e.stopPropagation()}>
                <Sidebar
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  caseData={caseData}
                  onItemClick={() => setSidebarOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    {caseData.name}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {activeSection}
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto p-6">
              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}
