// components/common/Badge.tsx

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "featured" | "category" | "default";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variantStyles = {
    featured: "bg-yellow-100 text-yellow-800 border-yellow-300",
    category: "bg-purple-100 text-purple-700 border-purple-300",
    default: "bg-gray-100 text-gray-700 border-gray-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded text-xs font-semibold border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}