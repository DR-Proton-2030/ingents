import React from "react";
import Layout from "@/screens/layout/Layout";

export default function AnalyticsPage() {
  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600 mb-6">
              Comprehensive analytics and data insights
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Performance Metrics
                </h3>
                <p className="text-sm text-gray-600">
                  Track key performance indicators
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Custom Reports
                </h3>
                <p className="text-sm text-gray-600">
                  Generate detailed custom reports
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Data Visualization
                </h3>
                <p className="text-sm text-gray-600">
                  Interactive charts and graphs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
