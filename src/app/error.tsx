"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] px-4">
      <motion.div
        className="max-w-md rounded-2xl border border-[#3c4043] bg-[#1e1f20] p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#ea4335]/10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <AlertTriangle className="h-8 w-8 text-[#ea4335]" />
        </motion.div>

        <h2 className="text-xl font-semibold text-[#e3e3e3]">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-[#9aa0a6]">
          An unexpected error occurred. Please try again.
        </p>

        {error.digest && (
          <p className="mt-2 font-mono text-xs text-[#5f6368]">
            Error: {error.digest}
          </p>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload page
          </Button>
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
