import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type Lang } from "@/lib/format";

type FacultyMember = {
  id: string;
  name_en: string;
  name_mr: string;
  designation_en: string | null;
  designation_mr: string | null;
  email: string | null;
  contact: string | null;
  photo_url: string | null;
  display_order: number;
};

export default function PlanningDepartment() {
  const { t, language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";

  const { data: faculty = [], isLoading, error } = useQuery({
    queryKey: ["public", "faculty"],
    queryFn: async (): Promise<FacultyMember[]> => {
      const { data, error } = await supabase
        .from("faculty")
        .select("id, name_en, name_mr, designation_en, designation_mr, email, contact, photo_url, display_order")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const cardClass =
    "flex flex-col md:flex-row bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 gap-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700";
  const imgClass = "w-40 h-40 object-cover rounded-xl border-4 border-gray-200 dark:border-gray-600";
  const nameClass = "text-2xl font-bold text-blue-900 dark:text-blue-200";
  const titleClass = "text-lg text-gray-700 dark:text-gray-300 mt-1 font-medium";
  const textClass = "text-gray-600 dark:text-gray-400 mt-2 text-sm";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-900 dark:text-blue-300 mb-16 leading-tight">
          {t("planning.faculties.title")}
        </h1>

        {isLoading ? (
          <p className="text-center py-12 text-gray-600 dark:text-gray-300">
            {lang === "mr" ? "लोड होत आहे…" : "Loading…"}
          </p>
        ) : error ? (
          <p className="text-center py-12 text-red-600 dark:text-red-400">
            {lang === "mr" ? "लोड करता आले नाही." : "Failed to load."}
          </p>
        ) : faculty.length === 0 ? (
          <p className="text-center py-12 text-gray-600 dark:text-gray-300">
            {lang === "mr" ? "अद्याप कोणतेही प्राध्यापक जोडलेले नाहीत." : "No faculty added yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {faculty.map((member) => {
              const name = lang === "mr" ? member.name_mr : member.name_en;
              const desig = lang === "mr" ? member.designation_mr : member.designation_en;
              return (
                <div key={member.id} className={cardClass}>
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={name} className={imgClass} />
                  ) : (
                    <div className={`${imgClass} bg-gray-200 dark:bg-gray-700`} />
                  )}
                  <div className="flex flex-col justify-center">
                    <h2 className={nameClass}>{name}</h2>
                    {desig && <p className={titleClass}>{desig}</p>}
                    {member.email && <p className={textClass}>{member.email}</p>}
                    {member.contact && (
                      <p className={textClass}>
                        {t("common.phone")}: {member.contact}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
