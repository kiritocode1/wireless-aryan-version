import { ReactNode } from "react";
import { Inbox } from "lucide-react";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16 rounded-lg border border-dashed bg-white/40 dark:bg-gray-900/40 dark:border-gray-800">
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-muted-foreground mb-4">
        {icon ?? <Inbox className="w-6 h-6" />}
      </div>
      <p className="font-medium text-gray-900 dark:text-gray-100">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
