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

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await signIn(data.email, data.password);
      router.push("/chat");
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Invalid email or password");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
          <GeminiSpark size={48} />
          <h1 className="mt-6 text-2xl font-normal text-[#e3e3e3]">Sign in</h1>
          <p className="mt-1 text-sm text-[#9aa0a6]">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="rounded-xl border border-[#ea4335]/30 bg-[#ea4335]/10 px-4 py-3 text-sm text-[#ea4335]">{serverError}</div>
          )}

          <div className="space-y-2">
            <input
              id="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register("email")}
              className={`w-full rounded-xl border px-4 py-3 bg-transparent text-[#e3e3e3] placeholder:text-[#5f6368] focus:outline-none focus:border-[#1a73e8] transition-colors ${errors.email ? "border-[#ea4335]" : "border-[#3c4043]"}`}
            />
            {errors.email && <p className="text-xs text-[#ea4335]">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                {...register("password")}
                className={`w-full rounded-xl border px-4 py-3 pr-10 bg-transparent text-[#e3e3e3] placeholder:text-[#5f6368] focus:outline-none focus:border-[#1a73e8] transition-colors ${errors.password ? "border-[#ea4335]" : "border-[#3c4043]"}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-[#e3e3e3] transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-[#ea4335]">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-[#8ab4f8] hover:text-[#aecbfa] transition-colors">Forgot password?</Link>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full h-11 rounded-full bg-[#1a73e8] text-white font-medium text-sm hover:bg-[#1557b0] disabled:opacity-50 transition-colors">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#9aa0a6]">
            No account? <Link href="/register" className="text-[#8ab4f8] hover:text-[#aecbfa] transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
