import { ReactNode } from "react";
import { Inbox, Sparkles } from "lucide-react";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  hint?: string;
};

export default function EmptyState({ icon, title, description, action, hint }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed bg-white dark:bg-gray-900 dark:border-gray-800">
      {/* decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(229 231 235 / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(229 231 235 / 0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-5 ring-4 ring-indigo-50 dark:ring-indigo-950/40">
          {icon ?? <Inbox className="w-6 h-6" />}
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md">{description}</p>
        )}
        {action && <div className="mt-6">{action}</div>}
        {hint && (
          <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" /> {hint}
          </p>
        )}
      </div>
    </div>
  );
}
