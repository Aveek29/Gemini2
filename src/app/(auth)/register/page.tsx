"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks";
import { GeminiSpark } from "@/components/ui/gemini-spark";

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      await signUp(data.email, data.password, data.fullName);
      setSuccessMessage("Account created! Please check your email to verify your account.");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3 bg-transparent text-[#e3e3e3] placeholder:text-[#5f6368] focus:outline-none focus:border-[#1a73e8] transition-colors ${hasError ? "border-[#ea4335]" : "border-[#3c4043]"}`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
          <GeminiSpark size={48} />
          <h1 className="mt-6 text-2xl font-normal text-[#e3e3e3]">Create account</h1>
          <p className="mt-1 text-sm text-[#9aa0a6]">Get started with Gemini</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && <div className="rounded-xl border border-[#ea4335]/30 bg-[#ea4335]/10 px-4 py-3 text-sm text-[#ea4335]">{serverError}</div>}
          {successMessage && <div className="rounded-xl border border-[#34a853]/30 bg-[#34a853]/10 px-4 py-3 text-sm text-[#34a853]">{successMessage}</div>}

          <input id="fullName" type="text" placeholder="Full name" autoComplete="name" {...register("fullName")} className={inputClass(!!errors.fullName)} />
          {errors.fullName && <p className="text-xs text-[#ea4335]">{errors.fullName.message}</p>}

          <input id="email" type="email" placeholder="Email" autoComplete="email" {...register("email")} className={inputClass(!!errors.email)} />
          {errors.email && <p className="text-xs text-[#ea4335]">{errors.email.message}</p>}

          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"} placeholder="Password" autoComplete="new-password" {...register("password")} className={inputClass(!!errors.password) + " pr-10"} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-[#e3e3e3] transition-colors">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-[#ea4335]">{errors.password.message}</p>}

          <div className="relative">
            <input id="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Confirm password" autoComplete="new-password" {...register("confirmPassword")} className={inputClass(!!errors.confirmPassword) + " pr-10"} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-[#e3e3e3] transition-colors">
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-[#ea4335]">{errors.confirmPassword.message}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full h-11 rounded-full bg-[#1a73e8] text-white font-medium text-sm hover:bg-[#1557b0] disabled:opacity-50 transition-colors">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#9aa0a6]">
            Already have an account? <Link href="/login" className="text-[#8ab4f8] hover:text-[#aecbfa] transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
