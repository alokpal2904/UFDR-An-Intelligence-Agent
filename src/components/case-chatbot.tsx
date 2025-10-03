"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Lightbulb,
  Search,
  FileText,
  Clock,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
  suggestions?: string[];
}

interface CaseChatbotProps {
  caseId: string;
}

// Dummy conversation data
const initialMessages: Message[] = [
  {
    id: "1",
    content:
      "Hello! I'm ForensiAI Assistant. I can help you analyze this case. What would you like to know?",
    sender: "ai",
    timestamp: "2024-01-15T09:00:00Z",
    suggestions: [
      "What files were recovered?",
      "Show me the timeline",
      "Any suspicious activity?",
      "Summary of findings",
    ],
  },
  {
    id: "2",
    content: "What files were recovered from this device?",
    sender: "user",
    timestamp: "2024-01-15T09:01:00Z",
  },
  {
    id: "3",
    content:
      "I found several categories of files from the iPhone 14 Pro analysis:\n\n📸 **Images**: 534 photos (including 23 deleted)\n💬 **Messages**: 267 text conversations\n📞 **Call Logs**: 89 call records\n📍 **Location Data**: 15 GPS coordinates\n📄 **Documents**: 12 PDF files\n🎵 **Media**: 45 audio/video files\n\nWould you like me to elaborate on any specific category?",
    sender: "ai",
    timestamp: "2024-01-15T09:01:30Z",
    suggestions: [
      "Show deleted photos",
      "Analyze message content",
      "Location timeline",
      "Recent call activity",
    ],
  },
];

const quickActions = [
  {
    icon: Search,
    label: "Search Evidence",
    prompt: "Search for specific evidence in this case",
  },
  {
    icon: FileText,
    label: "Generate Report",
    prompt: "Generate a summary report of findings",
  },
  {
    icon: Clock,
    label: "Timeline Analysis",
    prompt: "Show me the activity timeline",
  },
  {
    icon: Lightbulb,
    label: "Key Insights",
    prompt: "What are the key insights from this case?",
  },
];

export function CaseChatbot({ caseId }: CaseChatbotProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        sender: "ai",
        timestamp: new Date().toISOString(),
        suggestions: generateSuggestions(content),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("deleted") || input.includes("photo")) {
      return "I found 23 deleted photos that were successfully recovered. They include:\n\n🗓️ **Recent deletions** (last 7 days): 15 photos\n📷 **Screenshots**: 8 items\n🔍 **Analysis**: Most were deleted on Jan 14th between 10:30-11:45 PM\n\nThese photos may contain important evidence. Would you like me to show the metadata or check for any connections to other evidence?";
    }

    if (
      input.includes("message") ||
      input.includes("text") ||
      input.includes("chat")
    ) {
      return "Message analysis reveals interesting patterns:\n\n💬 **Total conversations**: 267 threads\n⚠️ **Flagged content**: 5 conversations contain suspicious keywords\n🕐 **Active periods**: Heavy usage between 8 PM - 2 AM\n📱 **Apps analyzed**: WhatsApp, SMS, Telegram, Signal\n\nI detected potential evidence in conversations with contacts 'Unknown-1' and 'J.Smith'. Should I provide detailed analysis?";
    }

    if (
      input.includes("location") ||
      input.includes("gps") ||
      input.includes("map")
    ) {
      return "Location analysis shows movement patterns:\n\n📍 **Tracked locations**: 15 GPS coordinates\n🗺️ **Key areas**: Central Park, Times Square, Brooklyn Bridge\n⏱️ **Timeline**: Jan 15th, 9:20 AM - 6:30 PM\n🚗 **Transportation**: Connected to vehicle Bluetooth at 6:30 PM\n\nThere's a 2-hour gap in location data from 2:00-4:00 PM. This might indicate the device was turned off or in airplane mode.";
    }

    if (input.includes("call") || input.includes("phone")) {
      return "Call log analysis reveals:\n\n📞 **Total calls**: 89 records\n🔴 **Outgoing**: 45 calls\n🟢 **Incoming**: 44 calls\n⏰ **Duration range**: 30 seconds to 47 minutes\n📊 **Peak activity**: 3 calls to unknown number on Jan 14th\n\nOne number appears frequently but isn't in contacts: +1-555-0147. This number was called 8 times in the last week.";
    }

    return "I understand you're asking about this case. Based on the current evidence, I can provide insights about:\n\n🔍 File recovery and analysis\n📱 Device usage patterns\n📍 Location and movement data\n💬 Communication analysis\n⚡ Timeline reconstruction\n\nWhat specific aspect would you like me to investigate further?";
  };

  const generateSuggestions = (userInput: string): string[] => {
    const input = userInput.toLowerCase();

    if (input.includes("deleted") || input.includes("photo")) {
      return [
        "Show photo metadata",
        "Check for duplicates",
        "Timeline of deletions",
        "Related evidence",
      ];
    }

    if (input.includes("message")) {
      return [
        "Suspicious conversations",
        "Contact analysis",
        "Keyword search",
        "Export messages",
      ];
    }

    if (input.includes("location")) {
      return [
        "Show route map",
        "Missing time periods",
        "Frequent locations",
        "Speed analysis",
      ];
    }

    return [
      "More details",
      "Related evidence",
      "Export findings",
      "Next steps",
    ];
  };

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
          AI Assistant
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Ask questions about the case evidence and get AI-powered insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-slate-100">
                <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Case Analysis Chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.sender === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === "user"
                            ? "bg-indigo-600 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`p-3 rounded-lg ${
                            message.sender === "user"
                              ? "bg-indigo-600 text-white"
                              : "bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">
                            {message.content}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {formatTime(message.timestamp)}
                        </p>

                        {/* AI Suggestions */}
                        {message.sender === "ai" && message.suggestions && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                                className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about case evidence, timeline, or findings..."
                  className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-slate-100">
                <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="w-full p-3 text-left bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <ActionIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                          {action.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Case Info */}
          <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-700 mt-6">
            <CardContent className="p-4">
              <div className="text-center">
                <Bot className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                  AI Analysis Ready
                </h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  Ask me anything about this case. I have analyzed all evidence
                  files and can provide detailed insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
