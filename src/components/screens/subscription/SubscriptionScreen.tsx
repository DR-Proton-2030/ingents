"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  Crown,
  Star,
  ArrowRight,
  Shield,
  CreditCard,
  Clock,
  X,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { subscriptionAPI } from "@/utils/api/subscription/subscription.api";
import { toast } from "react-toastify";

// ---------- Types ----------
interface Plan {
  id: string;
  name: string;
  price: number;
  price_display: string;
  features: string[];
}

interface Subscription {
  _id: string;
  plan: string;
  status: string;
  amount: number;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface Payment {
  _id: string;
  plan: string;
  amount: number;
  status: string;
  razorpay_payment_id?: string;
  paid_at?: string;
  createdAt: string;
}

// ---------- Plan Icons ----------
const planIcons: Record<string, React.ReactNode> = {
  free: <Star className="w-6 h-6" />,
  pro: <Zap className="w-6 h-6" />,
  pro_plus: <Crown className="w-6 h-6" />,
};

const planColors: Record<string, string> = {
  free: "from-gray-400 to-gray-500",
  pro: "from-blue-500 to-indigo-600",
  pro_plus: "from-purple-500 to-pink-600",
};

const RAZORPAY_KEY = "rzp_test_SYlbshsg5rKnuO";

// ---------- Component ----------
export default function SubscriptionScreen() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"plans" | "billing">("plans");
  const [showCancelModal, setShowCancelModal] = useState(false);

  // ---------- Load Data ----------
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subRes, plansRes, paymentsRes] = await Promise.all([
        subscriptionAPI.getCurrent(),
        subscriptionAPI.getPlans(),
        subscriptionAPI.getPayments(),
      ]);
      setSubscription(subRes.data?.data || null);
      setPlans(plansRes.data?.data || []);
      setPayments(paymentsRes.data?.data || []);
    } catch (err) {
      console.error("Failed to load subscription data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------- Razorpay Checkout ----------
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (plan: string) => {
    if (plan === "free") return;
    setProcessingPlan(plan);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Payment gateway failed to load");
        setProcessingPlan(null);
        return;
      }

      // Create order on backend
      const res = await subscriptionAPI.createOrder(plan);
      const orderData = res.data?.data;

      if (!orderData) {
        toast.error("Failed to create payment order");
        setProcessingPlan(null);
        return;
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Ingents AI",
        description: `${orderData.plan_name} Plan Subscription`,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            await subscriptionAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            });
            toast.success(`Upgraded to ${orderData.plan_name}!`);
            fetchData();
          } catch (err) {
            toast.error("Payment verification failed");
          } finally {
            setProcessingPlan(null);
          }
        },
        modal: {
          ondismiss: () => setProcessingPlan(null),
        },
        prefill: {},
        theme: {
          color: "#111827",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error("Something went wrong");
      setProcessingPlan(null);
    }
  };

  const handleCancel = async () => {
    try {
      await subscriptionAPI.cancel();
      toast.success("Subscription will be cancelled at period end");
      setShowCancelModal(false);
      fetchData();
    } catch (err) {
      toast.error("Cancellation failed");
    }
  };

  // ---------- Helpers ----------
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatAmount = (paise: number) =>
    paise === 0 ? "Free" : `₹${(paise / 100).toFixed(2)}`;

  const isCurrentPlan = (planId: string) => subscription?.plan === planId;

  // ---------- Render ----------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your plan and billing</p>
      </div>

      {/* Current Status Banner */}
      {subscription && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 rounded-2xl bg-white border border-gray-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${planColors[subscription.plan]} text-white`}>
              {planIcons[subscription.plan]}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {plans.find((p) => p.id === subscription.plan)?.name || subscription.plan} Plan
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {subscription.cancel_at_period_end
                  ? `Cancels on ${formatDate(subscription.current_period_end)}`
                  : `Renews ${formatDate(subscription.current_period_end)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${subscription.status === "active"
                ? "bg-emerald-50 text-emerald-600"
                : subscription.status === "past_due"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-red-50 text-red-600"
                }`}
            >
              {subscription.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
        {[
          { id: "plans" as const, label: "Plans", icon: <Zap className="w-3.5 h-3.5" /> },
          { id: "billing" as const, label: "Billing History", icon: <CreditCard className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plans Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "plans" && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {plans.map((plan) => {
              const isCurrent = isCurrentPlan(plan.id);
              const isPopular = plan.id === "pro";
              const isProcessing = processingPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -4 }}
                  className={`relative rounded-2xl border p-6 transition-all ${isCurrent
                    ? "border-gray-900 bg-black/80 text-white shadow-xl"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
                    }`}
                >
                  {isPopular && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Popular
                    </div>
                  )}

                  <div className="mb-5">
                    <div
                      className={`inline-flex p-2.5 rounded-xl ${isCurrent ? "bg-white/10" : `bg-gradient-to-br ${planColors[plan.id]} text-white`
                        }`}
                    >
                      {planIcons[plan.id]}
                    </div>
                  </div>

                  <h3 className={`text-lg font-bold ${isCurrent ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>

                  <div className="mt-2 mb-5">
                    <span className={`text-3xl font-black ${isCurrent ? "text-white" : "text-gray-900"}`}>
                      {plan.price === 0 ? "₹0" : `₹${plan.price / 100}`}
                    </span>
                    <span className={`text-sm ${isCurrent ? "text-white/60" : "text-gray-400"}`}>
                      /month
                    </span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isCurrent ? "text-emerald-400" : "text-emerald-500"
                            }`}
                        />
                        <span
                          className={`text-sm ${isCurrent ? "text-white/80" : "text-gray-600"
                            }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <div className="flex flex-col gap-2">
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-xl bg-white/10 text-white/60 text-sm font-semibold cursor-not-allowed"
                      >
                        Current Plan
                      </button>
                      {plan.id !== "free" && !subscription?.cancel_at_period_end && (
                        <button
                          onClick={() => setShowCancelModal(true)}
                          className="w-full py-2 text-xs text-white/40 hover:text-red-400 transition-colors font-medium"
                        >
                          Cancel Subscription
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isProcessing || plan.id === "free"}
                      className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${plan.id === "free"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]"
                        }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : plan.id === "free" ? (
                        "Free Forever"
                      ) : (
                        <>
                          Upgrade <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <motion.div
            key="billing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {payments.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
                <CreditCard className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                <p className="text-sm font-semibold text-gray-400">No payments yet</p>
                <p className="text-xs text-gray-300 mt-1">Your billing history will appear here</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Transaction ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment._id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatDate(payment.paid_at || payment.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900 capitalize">
                            {payment.plan.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {formatAmount(payment.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${payment.status === "captured"
                              ? "bg-emerald-50 text-emerald-600"
                              : payment.status === "failed"
                                ? "bg-red-50 text-red-600"
                                : "bg-gray-100 text-gray-500"
                              }`}
                          >
                            {payment.status === "captured" && (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {payment.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                          {payment.razorpay_payment_id || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Badge */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-300">
        <Shield className="w-3.5 h-3.5" />
        <span>Payments secured by Razorpay · PCI DSS Compliant</span>
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <button
                onClick={() => setShowCancelModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-red-50">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Cancel Subscription?</h3>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Your {plans.find((p) => p.id === subscription?.plan)?.name} plan will remain active until{" "}
                <strong>{subscription?.current_period_end && formatDate(subscription.current_period_end)}</strong>.
                After that, you'll be downgraded to the Free plan.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Keep Plan
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                >
                  Cancel Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
