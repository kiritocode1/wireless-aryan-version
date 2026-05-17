import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type Lang } from "@/lib/format";
import placeholder from "@/assets/21.png";

type Activity = {
  id: string;
  title_en: string;
  title_mr: string;
  photo_url: string | null;
  activity_date: string | null;
};

export default function WelfareActivities() {
  const { t, language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";
  const [selectedItem, setSelectedItem] = useState<{ title: string; img: string } | null>(null);

  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ["public", "welfare_activities"],
    queryFn: async (): Promise<Activity[]> => {
      const { data, error } = await supabase
        .from("welfare_activities")
        .select("id, title_en, title_mr, photo_url, activity_date")
        .order("activity_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const welfareItems = activities.map((a) => ({
    title: lang === "mr" ? a.title_mr : a.title_en,
    img: a.photo_url ?? placeholder,
  }));

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 dark:text-white">{t("welfare.title")}</h2>

      <Accordion type="single" collapsible className="space-y-3">
        <AccordionItem value="welfare" className="border rounded-lg dark:border-gray-700">
          <AccordionTrigger className="text-xl font-semibold px-4 dark:text-white hover:dark:bg-gray-800">
            {t("welfare.accordionTitle")}
          </AccordionTrigger>

          <AccordionContent className="px-4 pb-4">
            {isLoading ? (
              <p className="text-center py-6 text-gray-600 dark:text-gray-300">
                {lang === "mr" ? "लोड होत आहे…" : "Loading…"}
              </p>
            ) : error ? (
              <p className="text-center py-6 text-red-600 dark:text-red-400">
                {lang === "mr" ? "लोड करता आले नाही." : "Failed to load."}
              </p>
            ) : welfareItems.length === 0 ? (
              <p className="text-center py-6 text-gray-600 dark:text-gray-300">
                {lang === "mr" ? "अद्याप कोणत्याही कल्याणकारी क्रिया जोडल्या नाहीत." : "No welfare activities added yet."}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {welfareItems.map((item, idx) => (
                  <Card
                    key={idx}
                    className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = placeholder;
                        }}
                        loading="lazy"
                      />
                    </div>

                    <CardContent className="pt-4">
                      <h3 className="text-lg font-medium dark:text-white">{item.title}</h3>
                      <div className="mt-3">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-3 py-1 rounded-md border transition hover:bg-black hover:text-white dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {t("welfare.viewButton")}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-1 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ✕
            </button>
            <img
              src={selectedItem.img}
              alt={selectedItem.title}
              className="w-full h-auto rounded-lg shadow-lg object-contain"
            />
            <h3 className="text-xl font-semibold text-center mt-4 dark:text-white">
              {selectedItem.title}
            </h3>
          </div>
        </div>
      )}
    </section>
  );
}
