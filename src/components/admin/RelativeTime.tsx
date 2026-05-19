import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  iso: string | null | undefined;
  className?: string;
  prefix?: string;
};

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

function relative(iso: string): string {
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, secs] of UNITS) {
    if (Math.abs(seconds) >= secs || unit === "second") {
      return rtf.format(-Math.round(seconds / secs), unit);
    }
  }
  return "";
}

function absolute(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RelativeTime({ iso, className, prefix }: Props) {
  if (!iso) return null;
  const rel = relative(iso);
  const abs = absolute(iso);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={className}>{prefix ? `${prefix} ${rel}` : rel}</span>
      </TooltipTrigger>
      <TooltipContent>{abs}</TooltipContent>
    </Tooltip>
  );
}
