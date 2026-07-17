"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks";
import { GeminiSpark } from "@/components/ui/gemini-spark";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    try {
      await resetPassword(data.email);
      setSent(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Failed to send reset email");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
          <GeminiSpark size={48} />
          <h1 className="mt-6 text-2xl font-normal text-[#e3e3e3]">Reset password</h1>
          <p className="mt-1 text-sm text-[#9aa0a6]">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 className="mb-4 h-12 w-12 text-[#34a853]" />
            <h2 className="text-lg font-medium text-[#e3e3e3]">Check your email</h2>
            <p className="mt-2 text-sm text-[#9aa0a6]">We&apos;ve sent a password reset link to your email address.</p>
            <p className="mt-1 text-xs text-[#5f6368]">Didn&apos;t receive it? Check your spam folder or try again.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && <div className="rounded-xl border border-[#ea4335]/30 bg-[#ea4335]/10 px-4 py-3 text-sm text-[#ea4335]">{serverError}</div>}

            <input id="email" type="email" placeholder="Email address" autoComplete="email" {...register("email")}
              className={`w-full rounded-xl border px-4 py-3 bg-transparent text-[#e3e3e3] placeholder:text-[#5f6368] focus:outline-none focus:border-[#1a73e8] transition-colors ${errors.email ? "border-[#ea4335]" : "border-[#3c4043]"}`} />
            {errors.email && <p className="text-xs text-[#ea4335]">{errors.email.message}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full h-11 rounded-full bg-[#1a73e8] text-white font-medium text-sm hover:bg-[#1557b0] disabled:opacity-50 transition-colors">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-[#9aa0a6] hover:text-[#e3e3e3] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
