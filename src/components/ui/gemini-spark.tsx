"use client";

interface GeminiSparkProps {
  className?: string;
  size?: number;
}

export function GeminiSpark({ className = "", size = 24 }: GeminiSparkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
        fill="url(#spark-gradient)"
      />
      <defs>
        <linearGradient id="spark-gradient" x1="4" y1="2" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285f4" />
          <stop offset="0.25" stopColor="#ea4335" />
          <stop offset="0.5" stopColor="#fbbc04" />
          <stop offset="0.75" stopColor="#34a853" />
          <stop offset="1" stopColor="#4285f4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
