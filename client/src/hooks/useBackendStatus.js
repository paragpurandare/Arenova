/**
 * useBackendStatus
 * Pings the backend once on mount and returns whether it is reachable.
 * Components use this to decide whether to show live data or demo data.
 */
import { useEffect, useState } from "react";
import api from "../services/api";

export default function useBackendStatus() {
  // Start as null (checking), then true (online) or false (offline/demo)
  const [online, setOnline] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/actuator/health", { timeout: 4000 })
      .then(() => { if (!cancelled) setOnline(true); })
      .catch(() => { if (!cancelled) setOnline(false); });
    return () => { cancelled = true; };
  }, []);

  return online; // null = checking, true = backend live, false = demo mode
}
