import React from "react";
import Layout from "@/screens/layout/Layout";

export default function FinanceAIPage() {
  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finance AI
            </h1>
            <p className="text-gray-600 mb-6">
              AI-powered financial analysis and insights
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Budget Planning
                </h3>
                <p className="text-sm text-gray-600">
                  Smart budget recommendations and tracking
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Investment Analysis
                </h3>
                <p className="text-sm text-gray-600">
                  AI-driven investment portfolio optimization
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Risk Assessment
                </h3>
                <p className="text-sm text-gray-600">
                  Comprehensive financial risk evaluation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
