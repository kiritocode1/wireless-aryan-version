import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type Lang, formatDateTime, updatedLabel } from "@/lib/format";

type Photo = {
  id: string;
  title_en: string | null;
  title_mr: string | null;
  photo_url: string;
  taken_date: string | null;
  display_order: number;
  updated_at: string | null;
};

export default function PhotoGallery() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";
  const goBack = () => navigate(-1);

  const { data: photos = [], isLoading, error } = useQuery({
    queryKey: ["public", "photo_gallery"],
    queryFn: async (): Promise<Photo[]> => {
      const { data, error } = await supabase
        .from("photo_gallery")
        .select("id, title_en, title_mr, photo_url, taken_date, display_order, updated_at")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const galleryItems = photos.map((p) => ({
    src: p.photo_url,
    caption: lang === "mr" ? p.title_mr : p.title_en,
    updatedAt: p.updated_at,
  }));

  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openModal = (index: number) => {
    setActiveIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const activeImage = galleryItems[activeIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 text-gray-900 dark:text-gray-100 px-6 py-12 sm:px-12 lg:px-24 relative overflow-hidden">
      <Button
        variant="ghost"
        onClick={goBack}
        className="flex items-center text-gray-900 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl px-4 py-2 shadow-md hover:shadow-blue-200 mb-8 dark:text-gray-100 dark:hover:bg-blue-950/30 dark:hover:text-blue-300 dark:hover:shadow-blue-900/30"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("back.home")}
      </Button>

      <h1 className="text-5xl p-3 md:text-6xl font-extrabold tracking-tight text-center bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg mb-10 dark:from-blue-500 dark:via-blue-600 dark:to-blue-700">
        {t("gallery.title")}
      </h1>

      {isLoading ? (
        <p className="text-center py-12 text-gray-600 dark:text-gray-300">
          {lang === "mr" ? "लोड होत आहे…" : "Loading…"}
        </p>
      ) : error ? (
        <p className="text-center py-12 text-red-600 dark:text-red-400">
          {lang === "mr" ? "लोड करता आले नाही." : "Failed to load."}
        </p>
      ) : galleryItems.length === 0 ? (
        <p className="text-center py-12 text-gray-600 dark:text-gray-300">
          {lang === "mr" ? "अद्याप कोणतेही फोटो जोडलेले नाहीत." : "No photos added yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {galleryItems.map((item, idx) => (
            <Card
              key={idx}
              className="bg-white/30 border border-gray-200 backdrop-blur-md shadow-lg rounded-3xl hover:shadow-blue-400/20 transition-all duration-500 cursor-pointer dark:bg-gray-800/30 dark:border-gray-700 dark:hover:shadow-blue-600/20"
              onClick={() => openModal(idx)}
            >
              <img
                src={item.src}
                alt={item.caption ?? ""}
                className="w-full h-44 sm:h-96 object-cover rounded-t-3xl"
              />
              {(item.caption || item.updatedAt) && (
                <CardContent className="p-6 text-center space-y-1">
                  {item.caption && (
                    <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                      {item.caption}
                    </p>
                  )}
                  {item.updatedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {updatedLabel(lang)}: {formatDateTime(item.updatedAt, lang)}
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {modalOpen && activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl dark:bg-gray-800">
            <button
              className="absolute top-4 right-4 text-blue-700 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 backdrop-blur-sm"
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </button>

            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 dark:bg-gray-700/70 hover:bg-white/90 dark:hover:bg-gray-600 rounded-full p-2"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6 text-blue-700 dark:text-blue-300" />
            </button>

            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 dark:bg-gray-700/70 hover:bg-white/90 dark:hover:bg-gray-600 rounded-full p-2"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6 text-blue-700 dark:text-blue-300" />
            </button>

            <img
              src={activeImage.src}
              alt={activeImage.caption ?? ""}
              className="w-full h-auto object-cover"
            />
            {activeImage.caption && (
              <div className="p-6 text-center bg-blue-50 dark:bg-blue-950/30">
                <p className="text-xl font-semibold text-blue-900 dark:text-blue-200">
                  {activeImage.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
