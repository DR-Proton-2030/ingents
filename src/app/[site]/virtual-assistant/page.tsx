import React from "react";
import Layout from "@/screens/layout/Layout";

export default function VirtualAssistantPage() {
  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Virtual Assistant
            </h1>
            <p className="text-gray-600 mb-6">
              Your AI-powered virtual assistant for productivity
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Task Automation
                </h3>
                <p className="text-sm text-gray-600">
                  Automate repetitive tasks and workflows
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Smart Scheduling
                </h3>
                <p className="text-sm text-gray-600">
                  Intelligent calendar and meeting management
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Voice Commands
                </h3>
                <p className="text-sm text-gray-600">
                  Natural language task execution
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
