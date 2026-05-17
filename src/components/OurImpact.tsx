import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

import cardBg1 from "../assets/hero/2.jpg";
import cardBg6 from "../assets/hero/repters.jpeg";
import cardBg7 from "../assets/hero/mobileradio12.jpeg";
import cardBg8 from "../assets/hero/handle radio.jpeg";

type DbStat = {
  id: string;
  label_en: string;
  label_mr: string;
  value: string;
  suffix: string | null;
  display_order: number;
};

const FALLBACK_BGS = [cardBg1, cardBg1, cardBg1, cardBg1, cardBg1, cardBg6, cardBg7, cardBg8];
const FALLBACK_GRADIENTS = [
  "from-blue-600/90 to-cyan-600/90",
  "from-teal-600/90 to-emerald-600/90",
  "from-amber-600/90 to-orange-600/90",
  "from-rose-600/90 to-pink-600/90",
  "from-purple-600/90 to-indigo-600/90",
  "from-green-600/90 to-teal-600/90",
  "from-red-600/90 to-pink-600/90",
  "from-yellow-500/90 to-orange-600/90",
];

const FALLBACK_STATS = [
  { id: "1", label_en: "Operating", label_mr: "कार्यरत", value: "1946", suffix: "", display_order: 1 },
  { id: "2", label_en: "Zone Offices", label_mr: "विभागीय कार्यालये", value: "6", suffix: "", display_order: 2 },
  { id: "3", label_en: "Range Offices", label_mr: "परिक्षेत्र कार्यालये", value: "8", suffix: "", display_order: 3 },
  { id: "4", label_en: "Employees", label_mr: "कर्मचारी", value: "1470", suffix: "", display_order: 4 },
  { id: "5", label_en: "Units", label_mr: "घटक", value: "73", suffix: "", display_order: 5 },
  { id: "6", label_en: "Repeaters", label_mr: "रिपीटर्स", value: "297", suffix: "", display_order: 6 },
  { id: "7", label_en: "Mobile Radios", label_mr: "मोबाईल रेडिओ", value: "12353", suffix: "", display_order: 7 },
  { id: "8", label_en: "Handheld Radios", label_mr: "हँडहेल्ड रेडिओ", value: "16471", suffix: "", display_order: 8 },
];

const OurImpact = () => {
  const { t, language } = useLanguage();
  const lang = language === "mr" ? "mr" : "en";
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: string | number }>({});
  const sectionRef = useRef<HTMLElement>(null);

  const { data: dbStats = [] } = useQuery({
    queryKey: ["public", "impact_stats"],
    queryFn: async (): Promise<DbStat[]> => {
      const { data, error } = await supabase
        .from("impact_stats")
        .select("id, label_en, label_mr, value, suffix, display_order")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const stats = dbStats.length > 0 ? dbStats : FALLBACK_STATS;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          stats.forEach((stat) => {
            const target = Number(stat.value);
            if (isNaN(target)) {
              setAnimatedValues((prev) => ({ ...prev, [stat.id]: stat.value }));
              return;
            }
            let current = 0;
            const increment = Math.max(1, Math.floor(target / 60));
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                clearInterval(timer);
                current = target;
              }
              setAnimatedValues((prev) => ({ ...prev, [stat.id]: current }));
            }, 30);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isVisible, stats]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 bg-gradient-to-b from-gray-50 via-blue-50 to-white dark:from-gray-900 dark:via-slate-900 dark:to-black"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-black dark:text-white text-3xl md:text-4xl font-extrabold tracking-wide">
            {t("impact.title")}
          </h2>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.slice(0, 4).map((stat, index) => (
              <ImpactCard
                key={stat.id}
                stat={stat}
                index={index}
                isVisible={isVisible}
                animatedValues={animatedValues}
                lang={lang}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.slice(4, 8).map((stat, index) => (
              <ImpactCard
                key={stat.id}
                stat={stat}
                index={index + 4}
                isVisible={isVisible}
                animatedValues={animatedValues}
                lang={lang}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ImpactCard = ({
  stat,
  index,
  isVisible,
  animatedValues,
  lang,
}: {
  stat: DbStat;
  index: number;
  isVisible: boolean;
  animatedValues: { [key: string]: string | number };
  lang: "en" | "mr";
}) => {
  const label = lang === "mr" ? stat.label_mr : stat.label_en;
  const bg = FALLBACK_BGS[index % FALLBACK_BGS.length];
  const gradient = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-400 h-full
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        hover:scale-105`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      <div className="relative z-10 p-6 md:p-8 text-center flex flex-col items-center justify-center h-48 md:h-56">
        <div className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-2xl">
          {animatedValues[stat.id] ?? "0"}
          <span className="text-3xl md:text-4xl ml-1">{stat.suffix ?? ""}</span>
        </div>

        <p className="mt-4 text-sm md:text-base font-bold text-white/95 uppercase tracking-wider">
          {label}
        </p>

        <div className="mt-5 w-16 h-1 bg-white/60 group-hover:bg-white group-hover:w-24 mx-auto rounded-full transition-all duration-400" />
      </div>
    </div>
  );
};

export default OurImpact;
