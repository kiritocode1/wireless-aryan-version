import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type Lang } from "@/lib/format";

type Rank = {
  id: string;
  rank_en: string;
  rank_mr: string;
  description_en: string | null;
  description_mr: string | null;
  display_order: number;
};

export default function Ranks() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";
  const goBack = () => navigate("/");

  const { data: ranks = [], isLoading } = useQuery({
    queryKey: ["public", "ranks"],
    queryFn: async (): Promise<Rank[]> => {
      const { data, error } = await supabase
        .from("ranks")
        .select("id, rank_en, rank_mr, description_en, description_mr, display_order")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["public", "site_settings", "ranks_master_pdf_url"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value_url")
        .eq("key", "ranks_master_pdf_url")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const masterPdf = settings?.value_url ?? "/pdfs/Ranks-in-PCIT.pdf";

  const openPDF = () => {
    window.open(masterPdf, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 px-6 py-12 sm:px-12 lg:px-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-32 left-40 w-96 h-96 bg-blue-600/20 dark:bg-blue-700/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-32 right-40 w-[32rem] h-[32rem] bg-blue-800/20 dark:bg-blue-900/20 blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        <Button
          variant="ghost"
          onClick={goBack}
          className="flex items-center text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 rounded-xl px-4 py-2 shadow-md hover:shadow-blue-200 dark:hover:shadow-blue-900/30 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> {t("backToHome")}
        </Button>

        <h1 className="text-5xl md:text-6xl p-3 font-extrabold tracking-tight text-center bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-500 dark:via-blue-600 dark:to-blue-700 bg-clip-text text-transparent drop-shadow-lg">
          {t("ranks.title")}
        </h1>
        <h2 className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-400 text-center mb-10">
          {t("ranks.subtitle")}
        </h2>

        {isLoading ? (
          <p className="text-center py-12 text-gray-600 dark:text-gray-300">
            {lang === "mr" ? "लोड होत आहे…" : "Loading…"}
          </p>
        ) : ranks.length === 0 ? (
          <p className="text-center py-12 text-gray-600 dark:text-gray-300">
            {lang === "mr" ? "अद्याप कोणतेही पद जोडलेले नाही." : "No ranks added yet."}
          </p>
        ) : (
          <div className="space-y-6">
            {ranks.map((item) => {
              const rank = lang === "mr" ? item.rank_mr : item.rank_en;
              const desc = lang === "mr" ? item.description_mr : item.description_en;
              return (
                <Card
                  key={item.id}
                  className="bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 backdrop-blur-md shadow-lg rounded-3xl hover:shadow-blue-400/20 dark:hover:shadow-blue-600/20 transition-all duration-500"
                >
                  <CardContent className="p-8 space-y-3">
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-blue-600 dark:text-blue-500 flex-shrink-0" />
                      <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{rank}</h3>
                    </div>
                    {desc && (
                      <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">{desc}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Button
            onClick={openPDF}
            className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300"
          >
            {t("ranks.seePDF")}
          </Button>
        </div>
      </div>
    </div>
  );
}
