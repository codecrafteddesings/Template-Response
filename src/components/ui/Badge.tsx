interface BadgeProps {
  status: "success" | "pending" | "error";
  label: string;
}

const styles = {
  success:
    "bg-terminalgreen-bg text-terminalgreen-dark dark:text-terminalgreen",
  pending:
    "bg-amberprimary-bg text-amberprimary dark:text-amberprimary",
  error: "bg-redprimary-bg text-redprimary dark:text-redprimary",
};

export default function Badge({ status, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${styles[status]}`}
    >
      {status === "success" && (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
          <path d="M10.28 2.22a.75.75 0 010 1.06l-5.5 5.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 011.06-1.06L4.25 7.19l4.97-4.97a.75.75 0 011.06 0z" />
        </svg>
      )}
      {status === "error" && (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 1.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V2.25A.75.75 0 016 1.5zM6 8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
          <path
            fillRule="evenodd"
            d="M6 0a6 6 0 100 12A6 6 0 006 0zM1.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {status === "pending" && (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M6 0a6 6 0 100 12A6 6 0 006 0zM1.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"
            clipRule="evenodd"
          />
          <path d="M6 3a.75.75 0 01.75.75v2a.75.75 0 01-1.5 0v-2A.75.75 0 016 3z" />
        </svg>
      )}
      {label}
    </span>
  );
}
