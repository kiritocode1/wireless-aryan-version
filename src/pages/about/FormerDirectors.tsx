import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type Lang, formatDateTime, updatedLabel } from "@/lib/format";
import placeholder from "@/assets/director-placeholder.jpg";

type Director = {
  id: string;
  name_en: string;
  name_mr: string;
  designation_en: string | null;
  designation_mr: string | null;
  tenure: string | null;
  photo_url: string | null;
  display_order: number;
  updated_at: string | null;
};

export default function FormerDirectors() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";

  const { data: directors = [], isLoading, error } = useQuery({
    queryKey: ["public", "former_directors"],
    queryFn: async (): Promise<Director[]> => {
      const { data, error } = await supabase
        .from("former_directors")
        .select("id, name_en, name_mr, designation_en, designation_mr, tenure, photo_url, display_order, updated_at")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-200"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-5 h-5" />
        {t("fd.back")}
      </Button>

      <h1 className="text-3xl font-bold text-center mb-10 text-blue-900 dark:text-blue-400">
        {t("fd.title")}
      </h1>

      {isLoading ? (
        <p className="text-center py-12 text-gray-600 dark:text-gray-300">
          {lang === "mr" ? "लोड होत आहे…" : "Loading…"}
        </p>
      ) : error ? (
        <p className="text-center py-12 text-red-600 dark:text-red-400">
          {lang === "mr" ? "लोड करता आले नाही." : "Failed to load."}
        </p>
      ) : directors.length === 0 ? (
        <p className="text-center py-12 text-gray-600 dark:text-gray-300">
          {lang === "mr" ? "अद्याप कोणतेही माजी संचालक जोडलेले नाहीत." : "No former directors added yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {directors.map((director) => {
            const name = lang === "mr" ? director.name_mr : director.name_en;
            const desig = lang === "mr" ? director.designation_mr : director.designation_en;
            return (
              <Card
                key={director.id}
                className="shadow-lg hover:shadow-2xl transition duration-300 rounded-2xl bg-white dark:bg-gray-800 flex flex-col items-center p-6"
              >
                <img
                  src={director.photo_url ?? placeholder}
                  alt={name}
                  className="w-40 h-40 object-cover rounded-full border-4 border-gray-200 dark:border-gray-700"
                />
                <CardContent className="p-4 text-center">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {name}
                  </h2>
                  {desig && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {desig}
                    </p>
                  )}
                  {director.tenure && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {director.tenure}
                    </p>
                  )}
                  {director.updated_at && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {updatedLabel(lang)}: {formatDateTime(director.updated_at, lang)}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
