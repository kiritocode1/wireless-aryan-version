import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { formatDate, formatFileSize, type Lang } from "@/lib/format";

type Recruitment = {
  id: string;
  title_en: string;
  title_mr: string;
  pdf_url: string | null;
  published_date: string;
  last_date: string | null;
  file_size_kb: number | null;
};

export default function Recruitment() {
  const { t, language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";

  const { data: recruitments = [], isLoading, error } = useQuery({
    queryKey: ["public", "recruitments"],
    queryFn: async (): Promise<Recruitment[]> => {
      const { data, error } = await supabase
        .from("recruitments")
        .select("id, title_en, title_mr, pdf_url, published_date, last_date, file_size_kb")
        .order("published_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-950
                    text-gray-900 dark:text-gray-100 px-6 py-12 sm:px-12 lg:px-24 relative overflow-hidden">

      <div className="flex justify-between items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center text-gray-900 hover:bg-blue-50 hover:text-blue-700
                     transition-all duration-300 rounded-xl px-4 py-2 shadow-md hover:shadow-blue-200
                     dark:text-gray-100 dark:hover:bg-blue-950/30 dark:hover:text-blue-300
                     dark:hover:shadow-blue-900/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> {t("recruit.back")}
        </Button>
      </div>

      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-blue-700
                     dark:text-blue-400 mb-10">
        {t("recruit.title")}
      </h1>

      <Card className="bg-white/40 border border-gray-300 backdrop-blur-md rounded-2xl shadow-xl dark:bg-gray-800/30 dark:border-gray-700">
        <CardContent className="p-6 overflow-x-auto">
          {isLoading ? (
            <p className="text-center py-6 text-gray-600 dark:text-gray-300">
              {lang === "mr" ? "लोड होत आहे…" : "Loading…"}
            </p>
          ) : error ? (
            <p className="text-center py-6 text-red-600 dark:text-red-400">
              {lang === "mr" ? "लोड करता आले नाही." : "Failed to load."}
            </p>
          ) : recruitments.length === 0 ? (
            <p className="text-center py-6 text-gray-600 dark:text-gray-300">
              {t("recruit.none")}
            </p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-semibold text-center">
                  <th className="border border-gray-300 px-3 py-2">{t("recruit.srno")}</th>
                  <th className="border border-gray-300 px-3 py-2">{t("recruit.date")}</th>
                  <th className="border border-gray-300 px-3 py-2">{t("recruit.titleCol")}</th>
                  <th className="border border-gray-300 px-3 py-2">{t("recruit.view")}</th>
                  <th className="border border-gray-300 px-3 py-2">{t("recruit.download")}</th>
                </tr>
              </thead>
              <tbody>
                {recruitments.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-center transition-all"
                  >
                    <td className="border border-gray-300 px-3 py-2">{idx + 1}</td>
                    <td className="border border-gray-300 px-3 py-2">{formatDate(item.published_date, lang)}</td>
                    <td className="border border-gray-300 px-3 py-2 text-left">
                      {lang === "mr" ? item.title_mr : item.title_en}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {item.pdf_url ? (
                        <a
                          href={item.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          <Eye className="w-4 h-4" /> {t("recruit.view")}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {item.pdf_url ? (
                        <a
                          href={item.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          <Download className="w-4 h-4" /> {t("recruit.download")}
                          {item.file_size_kb ? ` (${formatFileSize(item.file_size_kb)})` : ""}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
