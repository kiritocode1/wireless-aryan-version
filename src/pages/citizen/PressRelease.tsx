import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Newspaper } from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type Lang, formatDateTime, updatedLabel } from "@/lib/format";

type PressRelease = {
  id: string;
  title_en: string;
  title_mr: string;
  description_en: string | null;
  description_mr: string | null;
  photo_url: string | null;
  pdf_url: string | null;
  published_date: string;
  updated_at: string | null;
};

export default function PressRelease() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";
  const goBack = () => navigate("/");

  const { data: newsItems = [], isLoading, error } = useQuery({
    queryKey: ["public", "press_releases"],
    queryFn: async (): Promise<PressRelease[]> => {
      const { data, error } = await supabase
        .from("press_releases")
        .select("id, title_en, title_mr, description_en, description_mr, photo_url, pdf_url, published_date, updated_at")
        .order("published_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 text-gray-900 dark:text-gray-100 px-6 py-12 sm:px-12 lg:px-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-32 left-40 w-96 h-96 bg-blue-600/20 dark:bg-blue-700/20 blur-3xl rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-32 right-40 w-[32rem] h-[32rem] bg-blue-800/20 dark:bg-blue-900/20 blur-3xl rounded-full animate-pulse-slow"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        <Button
          variant="ghost"
          onClick={goBack}
          className="flex items-center text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 rounded-xl px-4 py-2 shadow-md hover:shadow-blue-200 dark:hover:shadow-blue-900/30 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> {t("back.home")}
        </Button>

        <h1 className="text-5xl md:text-6xl p-3 font-extrabold tracking-tight text-center bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-500 dark:via-blue-600 dark:to-blue-700 bg-clip-text text-transparent drop-shadow-lg">
          {t("press.title")}
        </h1>
        <h2 className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-400 text-center mb-12">
          {t("press.subtitle")}
        </h2>

        {isLoading ? (
          <p className="text-center py-12 text-gray-600 dark:text-gray-300">
            {lang === "mr" ? "लोड होत आहे…" : "Loading…"}
          </p>
        ) : error ? (
          <p className="text-center py-12 text-red-600 dark:text-red-400">
            {lang === "mr" ? "लोड करता आले नाही." : "Failed to load."}
          </p>
        ) : newsItems.length === 0 ? (
          <p className="text-center py-12 text-gray-600 dark:text-gray-300">
            {lang === "mr" ? "सध्या कोणतीही प्रेस प्रकाशने उपलब्ध नाहीत." : "No press releases available currently."}
          </p>
        ) : (
          <div className="space-y-10">
            {newsItems.map((item) => {
              const title = lang === "mr" ? item.title_mr : item.title_en;
              const desc = lang === "mr" ? item.description_mr : item.description_en;
              return (
                <Card
                  key={item.id}
                  onClick={() => { if (item.pdf_url) window.open(item.pdf_url, "_blank"); }}
                  className={`bg-white/20 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 backdrop-blur-md shadow-xl rounded-3xl hover:shadow-blue-400/20 dark:hover:shadow-blue-600/20 transition-all duration-500 flex flex-col md:flex-row overflow-hidden ${item.pdf_url ? "cursor-pointer" : ""}`}
                >
                  {item.photo_url && (
                    <div className="md:w-1/3 h-64 md:h-auto relative group">
                      <img
                        src={item.photo_url}
                        alt={title}
                        className="w-full h-full object-cover rounded-t-3xl md:rounded-none md:rounded-l-3xl transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <CardContent className="p-8 flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <Newspaper className="w-6 h-6 text-blue-600 dark:text-blue-500 flex-shrink-0" />
                      <h3 className="text-2xl p-2 md:text-3xl font-bold text-blue-700 dark:text-blue-400 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 bg-clip-text text-transparent">
                        {title}
                      </h3>
                    </div>
                    {desc && (
                      <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed text-justify">
                        {desc}
                      </p>
                    )}
                    {item.updated_at && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {updatedLabel(lang)}: {formatDateTime(item.updated_at, lang)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
