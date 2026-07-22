import { createContext, useContext, useCallback } from "react";
import { initiateBooking, verifyPayment } from "../services/bookingService";

const PaymentContext = createContext(null);

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (document.getElementById("razorpay-script")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export function PaymentProvider({ children }) {
  const startPayment = useCallback(
    async ({ courtId, slotId, equipment, amount, userDetails, onSuccess, onError }) => {
      try {
        await loadRazorpayScript();

        const orderRes = await initiateBooking({
          courtId,
          slotId,
          equipmentItems: equipment || [],
          amount,
        });

        const { orderId, razorpayOrderId, currency } = orderRes;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXX",
          amount: Math.round(amount * 100),
          currency: currency || "INR",
          order_id: razorpayOrderId,
          name: "Arenova",
          description: "Court Booking & Equipment Rental",
          prefill: {
            name: userDetails?.name || "",
            email: userDetails?.email || "",
          },
          handler: async (response) => {
            try {
              const result = await verifyPayment({
                orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              onSuccess?.(result);
            } catch (err) {
              onError?.(err);
            }
          },
          modal: {
            ondismiss: () => onError?.(new Error("Payment cancelled")),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (resp) => {
          onError?.(new Error(resp.error?.description || "Payment failed"));
        });
        rzp.open();
      } catch (err) {
        onError?.(err);
      }
    },
    []
  );

  return (
    <PaymentContext.Provider value={{ startPayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used within a PaymentProvider");
  return ctx;
}
