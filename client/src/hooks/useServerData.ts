import { useEffect, useState } from "react";
import { useServerStatus } from "../context/ServerStatusContext";

interface Result<T> {
  key: string;
  data?: T;
  error: boolean;
}

/**
 * Runs `fetcher` once the backend has woken up, so static content can render
 * immediately while API-driven sections show their own loading state.
 * `key` identifies the request (e.g. a slug); changing it refetches.
 */
export function useServerData<T>(fetcher: () => Promise<T>, key = "") {
  const { connected, failed } = useServerStatus();
  const [result, setResult] = useState<Result<T> | null>(null);

  useEffect(() => {
    if (!connected) return;
    let cancelled = false;

    fetcher()
      .then((data) => {
        if (!cancelled) setResult({ key, data, error: false });
      })
      .catch(() => {
        if (!cancelled) setResult({ key, error: true });
      });

    return () => {
      cancelled = true;
    };
    // fetcher is recreated every render; `key` is the real dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, key]);

  const current = result?.key === key ? result : null;

  return {
    data: current?.data,
    loading: !current && !failed,
    error: current?.error || (!current && failed),
  };
}
