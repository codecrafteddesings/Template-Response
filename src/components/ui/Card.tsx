import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({
  children,
  className = "",
  padding = true,
}: CardProps) {
  return (
    <div
      className={`bg-surface border border-border-light rounded-sm ${padding ? "p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
