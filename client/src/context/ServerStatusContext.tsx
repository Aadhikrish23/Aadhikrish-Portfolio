import { createContext, useContext, useState, useEffect } from "react";
import healthcheckApi from "../APIServices/healthcheck.api";
type ServerContextType = {
  serverReady: boolean;
  connected: boolean;
  failed: boolean;
  retry: () => void;
};

const MAX_ATTEMPTS = 20;

const serverContext = createContext<ServerContextType | null>(null);

export const ServerProvider = ({ children }: { children: React.ReactNode }) => {
  const [serverReady, setServerReady] = useState(false);
  const [connected, setConnected] = useState(false);
  const [failed, setFailed] = useState(false);

  // Bumping this restarts the polling loop after it has given up.
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const healthcheck = async () => {
      try {
        const res = await healthcheckApi.healthCheck();

        if (res.data.status === "OK") {
          setConnected(true);

          timer = setTimeout(() => {
            setServerReady(true);
          }, 1000);
          return;
        }
      } catch {
        // fall through to retry
      }

      attempts++;
      if (attempts < MAX_ATTEMPTS) {
        timer = setTimeout(healthcheck, 2000);
      } else {
        setFailed(true);
      }
    };

    healthcheck();
    return () => clearTimeout(timer);
  }, [retryKey]);

  const retry = () => {
    setFailed(false);
    setRetryKey((k) => k + 1);
  };

  return (
    <serverContext.Provider
    value={{ serverReady, connected, failed, retry }}>
        {children}
    </serverContext.Provider>
  )
}
export const useServerStatus = () => {
  const context = useContext(serverContext);

  if (!context) {
    throw new Error("useServerStatus must be used within ServerProvider");
  }

  return context;
};
