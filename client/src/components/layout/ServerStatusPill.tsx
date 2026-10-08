import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useServerStatus } from "../../context/ServerStatusContext";

// Non-blocking notice while the free-tier backend wakes up.
export default function ServerStatusPill() {
  const { connected, failed, retry } = useServerStatus();
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <AnimatePresence>
        {!connected && (
          <motion.div
            role="status"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full max-w-md items-center gap-3 border border-line bg-surface px-4 py-3 text-sm shadow-lg shadow-black/40"
          >
            {failed ? (
              <>
                <span className="flex-1 text-muted">Couldn't reach the server.</span>
                <button
                  onClick={retry}
                  className="font-medium text-fg underline decoration-accent decoration-2"
                >
                  Try again
                </button>
              </>
            ) : (
              <>
                <span className="h-2 w-2 shrink-0 bg-accent motion-safe:animate-pulse" />
                <span className="text-muted">
                  Waking up the server. Projects and posts load in a few seconds.
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
