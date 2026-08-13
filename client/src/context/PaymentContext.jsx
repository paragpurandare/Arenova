import { createContext, useContext, useCallback } from "react";
import { createBooking, confirmBooking, cancelBooking } from "../services/bookingService";

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
    async ({
      slotId,
      userId,
      courtId,
      courtName,
      courtAmount,
      sportsType,
      clubId,
      clubName,
      slotDate,
      startTime,
      endTime,
      paymentMethod = "UPI",
      equipmentItems = [],
      userDetails,
      onSuccess,
      onError,
    }) => {
      let booking = null;
      try {
        // 1. Create Booking + Reserve Slot & Equipment on Backend (Status: PENDING)
        booking = await createBooking({
          slotId,
          userId,
          courtId,
          courtName,
          courtAmount,
          sportsType,
          clubId,
          clubName,
          slotDate,
          startTime,
          endTime,
          paymentMethod,
          equipmentItems: equipmentItems.map((e) => ({
            equipmentId: Number(e.id || e.equipmentId),
            equipmentName: e.name || e.equipmentName || "Equipment",
            pricePerUnit: Number(e.pricePerHour || e.pricePerSlot || e.pricePerUnit || e.price || 20),
            quantity: Number(e.qty || e.quantity || 1),
          })),
        });

        const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

        // If a valid Razorpay key is configured in .env, open standard Razorpay Checkout
        if (keyId && keyId !== "YOUR_RAZORPAY_KEY_ID" && keyId !== "rzp_test_XXXXXXXX") {
          await loadRazorpayScript();

          let paymentHandled = false;

          const options = {
            key: keyId,
            amount: Math.round((booking.totalPayable || booking.totalAmount || courtAmount || 0) * 100),
            currency: "INR",
            name: "Arenova Sports",
            description: `Booking #${booking.id} - ${booking.courtName || courtName || "Court"}`,
            prefill: {
              name: userDetails?.name || "",
              email: userDetails?.email || "",
            },
            handler: async (response) => {
              paymentHandled = true;
              try {
                const confirmed = await confirmBooking(booking.id, response.razorpay_payment_id);
                onSuccess?.(confirmed);
              } catch (err) {
                onError?.(err?.response?.data?.message || "Payment verification failed.");
              }
            },
            modal: {
              ondismiss: async () => {
                if (paymentHandled) return;
                paymentHandled = true;
                try {
                  await cancelBooking(booking.id);
                } catch {
                  // ignore cancellation error
                }
                onError?.("Payment process was cancelled.");
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", async (resp) => {
            if (paymentHandled) return;
            paymentHandled = true;
            try {
              await cancelBooking(booking.id);
            } catch {
              // ignore
            }
            onError?.(resp.error?.description || "Payment failed.");
          });
          rzp.open();
        } else {
          // Fallback / Test Mode when key is not set yet: confirm booking directly
          const mockTxn = "TXN-TEST-" + Math.random().toString(36).substring(2, 9).toUpperCase();
          const confirmed = await confirmBooking(booking.id, mockTxn);
          onSuccess?.(confirmed);
        }
      } catch (err) {
        if (booking?.id) {
          try {
            await cancelBooking(booking.id);
          } catch {
            // ignore
          }
        }
        onError?.(err?.response?.data?.message || err?.message || "Booking failed.");
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
