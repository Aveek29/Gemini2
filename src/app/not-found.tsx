"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] px-4">
      <motion.div
        className="flex max-w-md flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-8xl font-bold text-[#1a73e8]"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          404
        </motion.h1>
        <h2 className="mt-4 text-xl font-semibold text-[#e3e3e3]">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-[#9aa0a6]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="mt-6">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Go home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
