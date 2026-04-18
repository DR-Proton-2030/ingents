import React from "react";
import Layout from "@/screens/layout/Layout";
import SubscriptionScreen from "@/components/screens/subscription/SubscriptionScreen";

export default function SubscriptionPage() {
  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-6 py-6 h-[79vh] overflow-y-auto hidescroll">
        <SubscriptionScreen />
      </div>
    </Layout>
  );
}
