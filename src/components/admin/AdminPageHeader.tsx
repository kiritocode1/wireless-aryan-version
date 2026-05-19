import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
};

export default function AdminPageHeader({ title, description, meta, actions }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b dark:border-gray-800">
      <div className="space-y-1 min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 truncate">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {meta && <div className="text-xs text-muted-foreground pt-1">{meta}</div>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
