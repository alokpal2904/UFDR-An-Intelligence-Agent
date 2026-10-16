"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export interface CaseFormData {
  caseNo: string;
  leadInvestigator: string;
  caseTitle: string;
  department: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  caseType: "Mobile Device" | "Computer Forensics" | "Network Analysis" | "Digital Evidence" | "Cloud Storage" | "Other";
  description: string;
  fileName: string;
}

interface CaseCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCase: (caseData: CaseFormData) => void;
  fileName: string;
}

export function CaseCreationModal({
  isOpen,
  onClose,
  onCreateCase,
  fileName
}: CaseCreationModalProps) {
  const [formData, setFormData] = useState<CaseFormData>({
    caseNo: "",
    leadInvestigator: "",
    caseTitle: "",
    department: "",
    priority: "Medium",
    caseType: "Other",
    description: "",
    fileName: fileName
  });

  const [errors, setErrors] = useState<Partial<CaseFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CaseFormData> = {};

    if (!formData.caseNo.trim()) {
      newErrors.caseNo = "Case number is required";
    }
    if (!formData.leadInvestigator.trim()) {
      newErrors.leadInvestigator = "Lead investigator is required";
    }
    if (!formData.caseTitle.trim()) {
      newErrors.caseTitle = "Case title is required";
    }
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreateCase({ ...formData, fileName });
      onClose();
      // Reset form
      setFormData({
        caseNo: "",
        leadInvestigator: "",
        caseTitle: "",
        department: "",
        priority: "Medium",
        caseType: "Other",
        description: "",
        fileName: fileName
      });
      setErrors({});
    }
  };

  const handleChange = (field: keyof CaseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setFormData({
      caseNo: "",
      leadInvestigator: "",
      caseTitle: "",
      department: "",
      priority: "Medium",
      caseType: "Other",
      description: "",
      fileName: fileName
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-300">
      <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <Card className="w-full bg-slate-900/98 backdrop-blur-xl border-2 border-cyan-400/70 shadow-2xl matrix-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-4 border-b-2 border-cyan-500/50 bg-gradient-to-r from-slate-800/90 to-slate-700/90">
            <CardTitle className="text-xl font-bold text-cyan-300 font-['Orbitron'] tracking-wider uppercase matrix-glow">
              ⚡ CREATE NEW CASE
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-10 w-10 p-0 text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/30 transition-all duration-300 rounded-full border border-cyan-500/30 hover:border-cyan-400"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
        
          <CardContent className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6 font-['Space_Mono']">
              {/* File Name Display */}
              <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/60 p-4 rounded-xl backdrop-blur-md shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <Label className="text-base font-bold text-cyan-300 font-['Orbitron'] uppercase tracking-wider">
                    📁 UPLOADED FILE
                  </Label>
                </div>
                <p className="text-cyan-100 mt-3 font-['Space_Mono'] text-lg font-semibold bg-slate-800/70 px-4 py-3 rounded-lg border border-cyan-500/40">
                  {fileName}
                </p>
              </div>

              {/* Compact Form Layout */}
              <div className="space-y-5">
                {/* Row 1: Case Number & Lead Investigator */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="caseNo" className="text-sm font-bold text-cyan-300 font-['Orbitron'] uppercase tracking-wider flex items-center">
                      🔢 Case Number *
                    </Label>
                    <Input
                      id="caseNo"
                      type="text"
                      value={formData.caseNo}
                      onChange={(e) => handleChange("caseNo", e.target.value)}
                      placeholder="2024-001"
                      className={`h-12 text-base font-semibold border-2 ${errors.caseNo ? "border-red-400/60 bg-red-900/20" : "border-cyan-500/50"} bg-slate-800/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30`}
                    />
                    {errors.caseNo && (
                      <p className="text-sm text-red-300 font-['Space_Mono'] font-medium">{errors.caseNo}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leadInvestigator" className="text-sm font-bold text-cyan-300 font-['Orbitron'] uppercase tracking-wider flex items-center">
                      � Lead Investigator *
                    </Label>
                    <Input
                      id="leadInvestigator"
                      type="text"
                      value={formData.leadInvestigator}
                      onChange={(e) => handleChange("leadInvestigator", e.target.value)}
                      placeholder="Agent Smith"
                      className={`h-12 text-base font-semibold border-2 ${errors.leadInvestigator ? "border-red-400/60 bg-red-900/20" : "border-cyan-500/50"} bg-slate-800/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30`}
                    />
                    {errors.leadInvestigator && (
                      <p className="text-sm text-red-300 font-['Space_Mono'] font-medium">{errors.leadInvestigator}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Case Title & Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="caseTitle" className="text-sm font-bold text-cyan-300 font-['Orbitron'] uppercase tracking-wider flex items-center">
                      📋 Case Title *
                    </Label>
                    <Input
                      id="caseTitle"
                      type="text"
                      value={formData.caseTitle}
                      onChange={(e) => handleChange("caseTitle", e.target.value)}
                      placeholder="Mobile Device Analysis"
                      className={`h-12 text-base font-semibold border-2 ${errors.caseTitle ? "border-red-400/60 bg-red-900/20" : "border-cyan-500/50"} bg-slate-800/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30`}
                    />
                    {errors.caseTitle && (
                      <p className="text-sm text-red-300 font-['Space_Mono'] font-medium">{errors.caseTitle}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-bold text-cyan-300 font-['Orbitron'] uppercase tracking-wider flex items-center">
                      🏢 Department *
                    </Label>
                    <Input
                      id="department"
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleChange("department", e.target.value)}
                      placeholder="Cybercrime Unit"
                      className={`h-12 text-base font-semibold border-2 ${errors.department ? "border-red-400/60 bg-red-900/20" : "border-cyan-500/50"} bg-slate-800/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30`}
                    />
                    {errors.department && (
                      <p className="text-sm text-red-300 font-['Space_Mono'] font-medium">{errors.department}</p>
                    )}
                  </div>
                </div>

                {/* Row 3: Priority & Case Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-bold text-cyan-300 font-['Orbitron'] uppercase tracking-wider flex items-center">
                      ⚡ Priority
                    </Label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => handleChange("priority", e.target.value as CaseFormData["priority"])}
                      className="w-full px-4 py-3 h-12 border-2 border-cyan-500/50 rounded-md bg-slate-800/70 backdrop-blur-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 font-['Space_Mono'] text-base font-semibold"
                    >
                      <option value="Low">🟢 Low</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="High">🟠 High</option>
                      <option value="Critical">🔴 Critical</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caseType" className="text-sm font-bold text-cyan-300 font-['Orbitron'] uppercase tracking-wider flex items-center">
                      🔍 Case Type
                    </Label>
                    <select
                      id="caseType"
                      value={formData.caseType}
                      onChange={(e) => handleChange("caseType", e.target.value as CaseFormData["caseType"])}
                      className="w-full px-4 py-3 h-12 border-2 border-cyan-500/50 rounded-md bg-slate-800/70 backdrop-blur-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 font-['Space_Mono'] text-base font-semibold"
                    >
                      <option value="Mobile Device">📱 Mobile Device</option>
                      <option value="Computer Forensics">💻 Computer Forensics</option>
                      <option value="Network Analysis">🌐 Network Analysis</option>
                      <option value="Digital Evidence">🔒 Digital Evidence</option>
                      <option value="Cloud Storage">☁️ Cloud Storage</option>
                      <option value="Other">📄 Other</option>
                    </select>
                  </div>
                </div>

                {/* Description - Full Width */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-bold text-cyan-300 font-['Orbitron'] uppercase tracking-wider flex items-center">
                    📝 Case Description *
                  </Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Provide a detailed description of the case, evidence collected, and initial findings..."
                    rows={4}
                    className={`w-full px-4 py-3 border-2 border-cyan-500/50 rounded-lg bg-slate-800/70 backdrop-blur-md text-cyan-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 resize-none font-['Space_Mono'] text-base ${
                      errors.description ? "border-red-400/60 bg-red-900/20" : ""
                    }`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-300 font-['Space_Mono'] font-medium">{errors.description}</p>
                  )}
                </div>
              </div>
            </form>
          </CardContent>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex justify-end space-x-4 px-6 py-4 border-t-2 border-cyan-500/50 bg-gradient-to-r from-slate-800/30 to-slate-700/30 sticky bottom-0 z-10">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-6 py-3 h-12 text-base bg-slate-700/70 hover:bg-slate-600/80 text-slate-300 hover:text-slate-100 border-2 border-slate-400/50 hover:border-slate-300 font-['Orbitron'] font-bold tracking-wider uppercase transition-all duration-300"
            >
              ❌ CANCEL
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-3 h-12 text-base bg-gradient-to-r from-cyan-500/50 to-blue-500/50 hover:from-cyan-400/60 hover:to-blue-400/60 text-cyan-100 hover:text-white border-2 border-cyan-400/70 hover:border-cyan-300 font-['Orbitron'] font-bold tracking-wider uppercase matrix-glow-hover transition-all duration-300 shadow-lg"
            >
              ✅ CREATE CASE
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}