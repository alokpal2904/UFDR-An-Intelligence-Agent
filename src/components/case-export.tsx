"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Image,
  Database,
  Archive,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  FileJson,
  Printer,
  Share2,
} from "lucide-react";

interface CaseData {
  id: string;
  name: string;
  status: string;
  fileName?: string;
}

interface CaseExportProps {
  caseData: CaseData;
}

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  format: string;
  size: string;
  type: "report" | "data" | "evidence" | "summary";
  available: boolean;
}

const exportOptions: ExportOption[] = [
  {
    id: "full-report",
    title: "Complete Forensic Report",
    description:
      "Comprehensive analysis report with all findings, evidence, and conclusions",
    icon: FileText,
    format: "PDF",
    size: "2.4 MB",
    type: "report",
    available: true,
  },
  {
    id: "evidence-package",
    title: "Evidence Package",
    description:
      "All recovered files, photos, and digital evidence in organized folders",
    icon: Archive,
    format: "ZIP",
    size: "1.8 GB",
    type: "evidence",
    available: true,
  },
  {
    id: "timeline-data",
    title: "Timeline Data",
    description:
      "Chronological activity data in spreadsheet format for further analysis",
    icon: FileSpreadsheet,
    format: "XLSX",
    size: "156 KB",
    type: "data",
    available: true,
  },
  {
    id: "location-data",
    title: "Location Data",
    description: "GPS coordinates, location timeline, and mapping data",
    icon: Database,
    format: "JSON",
    size: "89 KB",
    type: "data",
    available: true,
  },
  {
    id: "recovered-images",
    title: "Recovered Images",
    description:
      "All photos and images found during analysis, including deleted files",
    icon: Image,
    format: "ZIP",
    size: "245 MB",
    type: "evidence",
    available: true,
  },
  {
    id: "summary-report",
    title: "Executive Summary",
    description: "High-level summary report for stakeholders and legal teams",
    icon: FileText,
    format: "PDF",
    size: "512 KB",
    type: "summary",
    available: true,
  },
  {
    id: "raw-data",
    title: "Raw Analysis Data",
    description: "Unprocessed forensic data and logs for technical review",
    icon: FileJson,
    format: "JSON",
    size: "45 MB",
    type: "data",
    available: false,
  },
  {
    id: "chain-custody",
    title: "Chain of Custody",
    description: "Legal documentation tracking evidence handling and analysis",
    icon: CheckCircle2,
    format: "PDF",
    size: "234 KB",
    type: "report",
    available: false,
  },
];

const getTypeColor = (type: ExportOption["type"]) => {
  switch (type) {
    case "report":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "evidence":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "data":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "summary":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
  }
};

const getTypeIcon = (type: ExportOption["type"]) => {
  switch (type) {
    case "report":
      return FileText;
    case "evidence":
      return Archive;
    case "data":
      return Database;
    case "summary":
      return FileSpreadsheet;
    default:
      return Download;
  }
};

export function CaseExport({ caseData }: CaseExportProps) {
  const handleDownload = (option: ExportOption) => {
    if (!option.available) return;

    // Simulate download - in real app, this would trigger actual download
    console.log(`Downloading ${option.title} for case ${caseData.id}`);

    // Show download started notification
    alert(
      `Download started: ${option.title} (${option.format}, ${option.size})`
    );
  };

  const handleBulkDownload = () => {
    const availableOptions = exportOptions.filter((opt) => opt.available);
    console.log(
      `Bulk downloading ${availableOptions.length} files for case ${caseData.id}`
    );
    alert(
      `Bulk download started: ${availableOptions.length} files will be packaged together`
    );
  };

  const handlePrint = () => {
    console.log(`Printing summary for case ${caseData.id}`);
    alert("Print dialog would open for the case summary report");
  };

  const handleShare = () => {
    console.log(`Sharing case ${caseData.id}`);
    alert("Share options would open (email, secure link, etc.)");
  };

  const availableCount = exportOptions.filter((opt) => opt.available).length;
  const totalSize = exportOptions
    .filter((opt) => opt.available)
    .reduce((total, opt) => {
      const size = parseFloat(opt.size.replace(/[^\d.]/g, ""));
      const unit = opt.size.includes("GB")
        ? 1024
        : opt.size.includes("KB")
        ? 0.001
        : 1;
      return total + size * unit;
    }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
          Export & Download
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Download reports, evidence packages, and analysis data for case{" "}
          {caseData.id}.
        </p>
      </div>

      {/* Export Summary */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Download className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                  Ready for Export
                </h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  {availableCount} files available • Total size: ~
                  {totalSize.toFixed(1)} GB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={handleBulkDownload}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportOptions.map((option) => {
          const OptionIcon = option.icon;
          const TypeIcon = getTypeIcon(option.type);

          return (
            <Card
              key={option.id}
              className={`bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg transition-all duration-200 ${
                option.available
                  ? "hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600"
                  : "opacity-60"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        option.available
                          ? "bg-indigo-100 dark:bg-indigo-900/30"
                          : "bg-slate-100 dark:bg-slate-700"
                      }`}
                    >
                      <OptionIcon
                        className={`h-5 w-5 ${
                          option.available
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-slate-400"
                        }`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-slate-100">
                        {option.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getTypeColor(option.type)}>
                          {option.type}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {option.format} • {option.size}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {option.available ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {option.description}
                </p>
                <Button
                  onClick={() => handleDownload(option)}
                  disabled={!option.available}
                  className={`w-full ${
                    option.available
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {option.available ? "Download" : "Processing..."}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Export Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Reports
            </p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {
                exportOptions.filter(
                  (opt) => opt.type === "report" && opt.available
                ).length
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-700">
          <CardContent className="p-4 text-center">
            <Archive className="h-6 w-6 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Evidence
            </p>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
              {
                exportOptions.filter(
                  (opt) => opt.type === "evidence" && opt.available
                ).length
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-4 text-center">
            <Database className="h-6 w-6 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Data Files
            </p>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
              {
                exportOptions.filter(
                  (opt) => opt.type === "data" && opt.available
                ).length
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700">
          <CardContent className="p-4 text-center">
            <FileSpreadsheet className="h-6 w-6 text-amber-500 dark:text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Summaries
            </p>
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
              {
                exportOptions.filter(
                  (opt) => opt.type === "summary" && opt.available
                ).length
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
