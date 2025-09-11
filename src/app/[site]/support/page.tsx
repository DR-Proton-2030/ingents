import React from "react";
import Layout from "@/screens/layout/Layout";

export default function SupportPage() {
  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
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
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Support Center
            </h1>
            <p className="text-gray-600 mb-6">
              Get help and support for your questions
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Help Documentation
                </h3>
                <p className="text-sm text-gray-600">
                  Browse our comprehensive help guides
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600">
                  Get instant help from our support team
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Contact Support
                </h3>
                <p className="text-sm text-gray-600">
                  Submit a ticket for technical assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
