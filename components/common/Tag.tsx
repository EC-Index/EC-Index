// components/common/Tag.tsx
import { cn } from "@/lib/utils";
import { getPlatformDisplayName } from "@/lib/charts";

interface TagProps {
  children: React.ReactNode;
  variant?: "platform" | "category" | "default";
  className?: string;
}

export default function Tag({
  children,
  variant = "default",
  className,
}: TagProps) {
  const variantStyles = {
    platform: "bg-blue-100 text-blue-700",
    category: "bg-green-100 text-green-700",
    default: "bg-gray-100 text-gray-700",
  };

  const displayText =
    variant === "platform"
      ? getPlatformDisplayName(children as any)
      : children;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {displayText}
    </span>
  );
}
