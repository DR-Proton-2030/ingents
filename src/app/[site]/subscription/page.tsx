import React from "react";
import Layout from "@/screens/layout/Layout";

export default function SubscriptionPage() {
  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
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
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Subscription
            </h1>
            <p className="text-gray-600 mb-6">
              Manage your subscription and billing
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Current Plan
                </h3>
                <p className="text-sm text-gray-600">
                  View your current subscription details
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Billing History
                </h3>
                <p className="text-sm text-gray-600">
                  Access your payment history and invoices
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Upgrade Plans
                </h3>
                <p className="text-sm text-gray-600">
                  Explore premium features and plans
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
