import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import IMG2 from "@/assets/hero/2.jpg";
import IMG6 from "@/assets/hero/Slider.jpeg";
import DIRECTOR_PHOTO from "@/assets/director.jpg";
import { Link } from "react-router-dom";

const maharashtraEmblem = "https://via.placeholder.com/128x128?text=MH+Emblem";

type Slide = {
  id: string;
  photo_url: string;
  title_en: string | null;
  title_mr: string | null;
  subtitle_en: string | null;
  subtitle_mr: string | null;
  display_order: number;
};

type Director = {
  name_en: string;
  name_mr: string;
  designation_en: string | null;
  designation_mr: string | null;
  photo_url: string | null;
};

const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();
  const lang = language === "mr" ? "mr" : "en";
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: dbSlides = [] } = useQuery({
    queryKey: ["public", "home_slider"],
    queryFn: async (): Promise<Slide[]> => {
      const { data, error } = await supabase
        .from("home_slider")
        .select("id, photo_url, title_en, title_mr, subtitle_en, subtitle_mr, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: director } = useQuery({
    queryKey: ["public", "director_current"],
    queryFn: async (): Promise<Director | null> => {
      const { data, error } = await supabase
        .from("director_current")
        .select("name_en, name_mr, designation_en, designation_mr, photo_url")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
  });

  const heroSlides = useMemo(() => {
    if (dbSlides.length > 0) {
      return dbSlides.map((s) => ({
        image: s.photo_url,
        title: lang === "mr" ? s.title_mr ?? "" : s.title_en ?? "",
        subtitle: lang === "mr" ? s.subtitle_mr ?? "" : s.subtitle_en ?? "",
      }));
    }
    return [
      { image: IMG6, title: "", subtitle: "" },
      { image: IMG2, title: "", subtitle: "" },
    ];
  }, [dbSlides, lang]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const directorName = director ? (lang === "mr" ? director.name_mr : director.name_en) : t("director.name");
  const directorDesig = director ? (lang === "mr" ? director.designation_mr : director.designation_en) : t("director.designation");
  const directorPhoto = director?.photo_url ?? DIRECTOR_PHOTO;

  return (
    <section className="relative min-h-[80vh] bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="relative h-[30vh] md:h-[85vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              className="w-full h-full bg-cover bg-center relative brightness-105 contrast-110 saturate-125"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="absolute inset-0 flex items-end mb-[2rem] md:mb-28 justify-center text-center">
                <div className="container mx-auto px-4 flex-col gap-y-5 justify-center">
                  {slide.title && (
                    <h2
                      className="text-2xl md:text-5xl xl:text-5xl capitalize font-bold text-white drop-shadow-lg mb-4 fade-in"
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                    />
                  )}
                  {slide.subtitle && (
                    <p className="hidden sm:block text-lg sm:text-xl md:text-2xl text-white/90 drop-shadow slide-up">
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2
             bg-black/50 hover:bg-black/70
             text-white p-3 rounded-full shadow-lg
             backdrop-blur-sm transition-all z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2
             bg-black/50 hover:bg-black/70
             text-white p-3 rounded-full shadow-lg
             backdrop-blur-sm transition-all z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentSlide ? "bg-white" : "bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Card className="glass-card overflow-hidden fade-in dark:bg-gray-900/50 dark:border-gray-800 transition-all">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <img src={maharashtraEmblem} alt="Maharashtra Police Emblem" className="w-32 h-32" />
              </div>

              <CardContent className="p-8 text-center relative z-10">
                <div className="relative inline-block mb-6">
                  <img
                    src={directorPhoto}
                    alt={directorName}
                    className="w-52 h-52 object-cover rounded-lg shadow-xl mx-auto"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{directorName}</h3>
                <p className="text-primary font-semibold mb-1">{t("director.rank")}</p>
                <p
                  className="text-muted-foreground text-sm mb-4"
                  dangerouslySetInnerHTML={{ __html: directorDesig ?? "" }}
                />
                <Link to={"/about/directors-desk"}>
                  <Button className="btn-police dark:text-white">{t("director.desk")}</Button>
                </Link>
              </CardContent>
            </div>
          </Card>

          <div className="space-y-6 slide-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-sans font-extrabold mb-4 p-3 text-foreground">
                {t("welcome.title")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t("welcome.message")}
              </p>
            </div>

            <Card className="glass-card border-l-4 border-l dark:bg-gray-900/50 dark:border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-muted-foreground mb-4 leading-relaxed text-justify">
                  {t("director.desk")}
                </h3>
                <p className="text-muted-foreground mb-4">{t("director.caption")}</p>
                <Link to={"/about/directors-desk"}>
                  <Button
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground dark:text-white"
                  >
                    {t("read.more")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
