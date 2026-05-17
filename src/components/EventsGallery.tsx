import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { formatDate, type Lang } from "@/lib/format";

import GIMG_1 from "@/assets/gallery/img1.jpeg";
import GIMG_2 from "@/assets/gallery/img2.jpeg";
import GIMG_3 from "@/assets/gallery/img3.jpeg";
import GIMG_4 from "@/assets/gallery/6.jpg";
import GIMG_5 from "@/assets/hero/2.jpg";
import GIMG_6 from "@/assets/gallery/7.jpg";

type NewsItem = {
  id: string;
  title_en: string;
  title_mr: string;
  published_date: string;
};

type RecruitItem = {
  id: string;
  title_en: string;
  title_mr: string;
  published_date: string;
  last_date: string | null;
};

type Photo = {
  id: string;
  photo_url: string;
};

const FALLBACK_PHOTOS = [GIMG_1, GIMG_2, GIMG_3, GIMG_4, GIMG_5, GIMG_6];

const EventsGallery = () => {
  const { t, language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const newsScrollRef = useRef<HTMLDivElement | null>(null);
  const recruitmentScrollRef = useRef<HTMLDivElement | null>(null);

  const policeBlue = "#0A1E4A";

  const { data: latestNews = [] } = useQuery({
    queryKey: ["public", "press_releases", "latest"],
    queryFn: async (): Promise<NewsItem[]> => {
      const { data, error } = await supabase
        .from("press_releases")
        .select("id, title_en, title_mr, published_date")
        .order("published_date", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: recruitment = [] } = useQuery({
    queryKey: ["public", "recruitments", "latest"],
    queryFn: async (): Promise<RecruitItem[]> => {
      const { data, error } = await supabase
        .from("recruitments")
        .select("id, title_en, title_mr, published_date, last_date")
        .order("published_date", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: dbPhotos = [] } = useQuery({
    queryKey: ["public", "photo_gallery", "preview"],
    queryFn: async (): Promise<Photo[]> => {
      const { data, error } = await supabase
        .from("photo_gallery")
        .select("id, photo_url")
        .order("display_order", { ascending: true })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  const galleryImages =
    dbPhotos.length > 0
      ? dbPhotos.map((p) => ({ id: p.id, src: p.photo_url }))
      : FALLBACK_PHOTOS.map((src, i) => ({ id: String(i), src }));

  const autoScroll = (ref: React.RefObject<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    let pos = 0;
    const scroll = () => {
      pos += 0.3;
      if (pos >= el.scrollHeight - el.clientHeight) pos = 0;
      el.scrollTop = pos;
      requestAnimationFrame(scroll);
    };
    requestAnimationFrame(scroll);
  };

  useEffect(() => {
    autoScroll(newsScrollRef);
    autoScroll(recruitmentScrollRef);
  }, []);

  const emptyText = lang === "en" ? "No items yet." : "अद्याप काही नाही.";

  return (
    <section className="py-16 bg-white dark:bg-black transition-colors duration-500">
      <div className="container mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {t("photo.gallery") || "Photo Gallery"}
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full" style={{ background: policeBlue }}></div>
        </div>

        <Card className="bg-white dark:bg-[#101B33] shadow-md rounded-xl mb-10">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="cursor-pointer h-40 md:h-48 overflow-hidden rounded-lg"
                  onClick={() => setSelectedImage(img.src)}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover rounded-lg" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">

          <Card className="bg-white dark:bg-[#101B33] shadow-md rounded-xl">
            <div className="bg-[rgb(0,51,102)] text-white py-3 text-center text-xl font-bold">
              {t("latest.news") || "Latest News"}
            </div>
            <CardContent ref={newsScrollRef} className="max-h-80 overflow-hidden">
              {latestNews.length === 0 ? (
                <p className="text-center py-8 text-gray-500">{emptyText}</p>
              ) : (
                [...latestNews, ...latestNews].map((n, i) => {
                  const title = lang === "mr" ? n.title_mr : n.title_en;
                  return (
                    <Link key={`${n.id}-${i}`} to="/citizen/press-release">
                      <div className="border-b py-3 dark:border-gray-700">
                        <p className="text-gray-900 dark:text-white font-medium">{title}</p>
                        <p className="text-xs text-gray-500 dark:text-white/70">{formatDate(n.published_date, lang)}</p>
                      </div>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#101B33] shadow-md rounded-xl">
            <div className="bg-[rgb(0,51,102)] text-white py-3 text-center text-xl font-bold">
              {t("recruitment") || "Recruitment"}
            </div>
            <CardContent ref={recruitmentScrollRef} className="max-h-80 overflow-hidden">
              {recruitment.length === 0 ? (
                <p className="text-center py-8 text-gray-500">{emptyText}</p>
              ) : (
                [...recruitment, ...recruitment].map((r, i) => {
                  const title = lang === "mr" ? r.title_mr : r.title_en;
                  return (
                    <Link key={`${r.id}-${i}`} to="/recruitments">
                      <div className="border-b py-3 dark:border-gray-700">
                        <p className="text-gray-900 dark:text-white font-medium">{title}</p>
                        <p className="text-xs text-gray-500 dark:text-white/70">
                          {formatDate(r.last_date ?? r.published_date, lang)}
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="" className="max-w-[600px] rounded-lg shadow-lg" />
        </div>
      )}
    </section>
  );
};

export default EventsGallery;
