import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  mono?: boolean;
}

export default function FormField({
  label,
  error,
  mono,
  className = "",
  ...inputProps
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={inputProps.id || inputProps.name?.toString()}
        className="text-sm font-medium text-text-secondary dark:text-slate-400 tracking-wide uppercase text-[11px] block mb-1.5"
      >
        {label}
      </label>
      <input
        {...inputProps}
        className={`w-full border border-border-light rounded px-3 py-2.5 bg-surface text-text-primary placeholder:text-text-secondary/50 outline-none transition-all duration-150 focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20 dark:focus:border-deepnavy dark:focus:ring-deepnavy/30 ${
          error
            ? "border-redprimary bg-redprimary-bg dark:bg-redprimary-bg"
            : "hover:border-border-medium"
        } ${mono ? "font-mono-input tracking-wider" : ""} ${className}`}
      />
      {error && (
        <p className="text-redprimary text-xs mt-1 flex items-center gap-1">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
