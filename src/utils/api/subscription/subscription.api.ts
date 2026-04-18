import API from "../api";

export const subscriptionAPI = {
  /** Get current user's subscription */
  getCurrent: () => API.get("/subscription/current"),

  /** Get available plans */
  getPlans: () => API.get("/subscription/plans"),

  /** Get payment history */
  getPayments: () => API.get("/subscription/payments"),

  /** Create a Razorpay order for plan upgrade */
  createOrder: (plan: string) =>
    API.post("/subscription/create-order", { plan }),

  /** Verify payment after Razorpay checkout */
  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    plan: string;
  }) => API.post("/subscription/verify-payment", data),

  /** Cancel subscription at period end */
  cancel: () => API.post("/subscription/cancel"),

  /** Immediately downgrade to free */
  downgrade: () => API.post("/subscription/downgrade"),
};
