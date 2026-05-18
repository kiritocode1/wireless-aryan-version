import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import directorPlaceholder from "@/assets/director-placeholder.jpg";
import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type Lang } from "@/lib/format";

type Director = {
  id: number;
  name_en: string;
  name_mr: string;
  designation_en: string | null;
  designation_mr: string | null;
  message_en: string | null;
  message_mr: string | null;
  photo_url: string | null;
};

export default function DirectorsDesk() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";
  const onBack = () => navigate("/");

  const { data: director, isLoading } = useQuery({
    queryKey: ["public", "director_current"],
    queryFn: async (): Promise<Director | null> => {
      const { data, error } = await supabase
        .from("director_current")
        .select("id, name_en, name_mr, designation_en, designation_mr, message_en, message_mr, photo_url")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
  });

  const name = director ? (lang === "mr" ? director.name_mr : director.name_en) : t("a2.name");
  const designation = director
    ? lang === "mr"
      ? director.designation_mr
      : director.designation_en
    : t("a2.desg");
  const message = director ? (lang === "mr" ? director.message_mr : director.message_en) : null;
  const photo = director?.photo_url ?? directorPlaceholder;

  return (
    <div className="min-h-screen
                    bg-gradient-to-b from-gray-50 via-white to-gray-100
                    dark:from-gray-900 dark:via-gray-950 dark:to-gray-900
                    text-gray-900 dark:text-gray-100
                    px-6 py-12 sm:px-12 lg:px-24 relative overflow-hidden">

      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-40 w-72 h-72 bg-blue-600/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-20 right-40 w-80 h-80 bg-blue-800/10 blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center text-gray-700 dark:text-gray-200
                     hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300
                     transition-all duration-300 rounded-xl px-4 py-2 shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> {t("a1.back")}
        </Button>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
          <div className="flex-shrink-0 relative group">
            <div className="absolute -inset-2 rounded-full
                            bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                            opacity-40 blur-lg group-hover:opacity-80 transition duration-700"></div>
            <img
              src={photo}
              alt={name}
              className="relative w-40 h-40 p-3 md:w-48 md:h-48 rounded-full object-cover
                         border-4 border-gray-200 dark:border-gray-700 shadow-xl
                         transition-all duration-500 group-hover:border-blue-300 dark:group-hover:border-blue-600 group-hover:shadow-2xl"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight
                           bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900
                           bg-clip-text text-transparent p-3">
              {t("a2.desk")}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 dark:text-blue-300">
              {name}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {designation} <br />
              <span className="text-blue-700 dark:text-blue-400 font-semibold">{t("a2.dept")}</span>, <br />
              {t("a2.loc")}
            </p>
          </div>
        </div>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                         shadow-xl rounded-3xl hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-all duration-500">
          <CardContent className="p-10 prose max-w-none space-y-8">
            {isLoading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading…</p>
            ) : message ? (
              <p
                className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line"
              >
                {message}
              </p>
            ) : (
              <p
                className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: t("b1.intro") }}
              />
            )}
            <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50
                            dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-900/40
                            p-8 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-inner">
              <p className="text-xl font-bold text-center text-blue-900 dark:text-blue-200">
                {t("b1.conc")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
