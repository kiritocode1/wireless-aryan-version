export type Lang = "en" | "mr";

export const formatDate = (iso: string | null | undefined, lang: Lang): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatFileSize = (kb: number | null | undefined): string => {
  if (kb == null) return "";
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
};

export const pickLang = <T>(en: T, mr: T, lang: Lang): T => (lang === "mr" ? mr : en);
