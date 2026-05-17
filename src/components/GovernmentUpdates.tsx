import { useEffect, useState } from "react";
import { ExternalLink, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { formatDate, type Lang } from "@/lib/format";

type Bulletin = {
  id: string;
  title_en: string;
  title_mr: string;
  pdf_url: string | null;
  published_date: string;
};

type Tender = {
  id: string;
  title_en: string;
  title_mr: string;
  pdf_url: string | null;
  published_date: string;
};

const GovernmentUpdates = () => {
  const { language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";

  const [bulletinOffset, setBulletinOffset] = useState(0);
  const [tenderOffset, setTenderOffset] = useState(0);
  const [isPausedBulletins, setIsPausedBulletins] = useState(false);
  const [isPausedTenders, setIsPausedTenders] = useState(false);

  const { data: bulletins = [] } = useQuery({
    queryKey: ["public", "bulletins", "latest"],
    queryFn: async (): Promise<Bulletin[]> => {
      const { data, error } = await supabase
        .from("bulletins")
        .select("id, title_en, title_mr, pdf_url, published_date")
        .order("published_date", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: tenders = [] } = useQuery({
    queryKey: ["public", "tenders", "latest"],
    queryFn: async (): Promise<Tender[]> => {
      const { data, error } = await supabase
        .from("tenders")
        .select("id, title_en, title_mr, pdf_url, published_date")
        .order("published_date", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  const bulletinItems = [...bulletins, ...bulletins, ...bulletins];
  const tenderItems = [...tenders, ...tenders, ...tenders];

  useEffect(() => {
    if (isPausedBulletins || bulletins.length === 0) return;
    const interval = setInterval(() => {
      setBulletinOffset((prev) => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [isPausedBulletins, bulletins.length]);

  useEffect(() => {
    if (isPausedTenders || tenders.length === 0) return;
    const interval = setInterval(() => {
      setTenderOffset((prev) => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [isPausedTenders, tenders.length]);

  useEffect(() => {
    if (bulletinOffset > bulletins.length * 80) setBulletinOffset(0);
  }, [bulletinOffset, bulletins.length]);

  useEffect(() => {
    if (tenderOffset > tenders.length * 80) setTenderOffset(0);
  }, [tenderOffset, tenders.length]);

  const headerTitleBulletin =
    lang === "en"
      ? "Latest Bulletins / Orders / Notices"
      : "नवीन बुलेटिन / आदेश / सूचना";
  const headerTitleTender = lang === "en" ? "Latest Tenders" : "नवीन निविदा";
  const readMoreText = lang === "en" ? "Read More" : "पुढे वाचा";
  const emptyText = lang === "en" ? "No updates yet." : "अद्याप कोणतीही माहिती नाही.";

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bulletins */}
          <div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            onMouseEnter={() => setIsPausedBulletins(true)}
            onMouseLeave={() => setIsPausedBulletins(false)}
          >
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-4">
              <h2 className="text-xl font-bold text-white text-center">
                {headerTitleBulletin}
              </h2>
            </div>

            <div className="relative h-80 overflow-hidden">
              {bulletins.length === 0 ? (
                <p className="flex items-center justify-center h-full text-gray-500">{emptyText}</p>
              ) : (
                <div
                  className="absolute w-full transition-transform"
                  style={{
                    transform: `translateY(-${bulletinOffset}px)`,
                    transition: isPausedBulletins ? "none" : "transform 0.05s linear",
                  }}
                >
                  {bulletinItems.map((b, idx) => {
                    const title = lang === "mr" ? b.title_mr : b.title_en;
                    return (
                      <div
                        key={`${b.id}-${idx}`}
                        className="mx-6 my-3 bg-gray-50 rounded-lg p-4 border-l-4 border-blue-900 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-medium text-gray-800 flex-1 text-sm">{title}</h3>
                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {formatDate(b.published_date, lang)}
                          </span>
                        </div>
                        {b.pdf_url && (
                          <div className="flex gap-2 mt-2">
                            <a
                              href={b.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-900 hover:underline text-xs flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {lang === "en" ? "Open PDF" : "पीडीएफ पहा"}
                            </a>
                            <a
                              href={b.pdf_url}
                              download
                              className="text-gray-700 hover:text-blue-900 text-xs flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              {lang === "en" ? "Download" : "डाउनलोड"}
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>

            <div className="flex justify-end">
              <button className="bg-blue-900 hover:bg-blue-950 text-white font-bold px-6 py-2 rounded-tl-xl transition">
                {readMoreText}
              </button>
            </div>
          </div>

          {/* Tenders */}
          <div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            onMouseEnter={() => setIsPausedTenders(true)}
            onMouseLeave={() => setIsPausedTenders(false)}
          >
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-4">
              <h2 className="text-xl font-bold text-white text-center">{headerTitleTender}</h2>
            </div>

            <div className="relative h-80 overflow-hidden">
              {tenders.length === 0 ? (
                <p className="flex items-center justify-center h-full text-gray-500">{emptyText}</p>
              ) : (
                <div
                  className="absolute w-full transition-transform"
                  style={{
                    transform: `translateY(-${tenderOffset}px)`,
                    transition: isPausedTenders ? "none" : "transform 0.05s linear",
                  }}
                >
                  {tenderItems.map((t, idx) => {
                    const title = lang === "mr" ? t.title_mr : t.title_en;
                    return (
                      <div
                        key={`${t.id}-${idx}`}
                        className="mx-6 my-3 bg-gray-50 rounded-lg p-4 border-l-4 border-blue-900 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-medium text-gray-800 flex-1 text-sm">{title}</h3>
                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {formatDate(t.published_date, lang)}
                          </span>
                        </div>
                        {t.pdf_url && (
                          <div className="flex gap-2 mt-2">
                            <a
                              href={t.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-900 hover:underline text-xs flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {lang === "en" ? "Open PDF" : "पीडीएफ पहा"}
                            </a>
                            <a
                              href={t.pdf_url}
                              download
                              className="text-gray-700 hover:text-blue-900 text-xs flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              {lang === "en" ? "Download" : "डाउनलोड"}
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>

            <div className="flex justify-end">
              <button className="bg-blue-900 hover:bg-blue-950 text-white font-bold px-6 py-2 rounded-tl-xl transition">
                {readMoreText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GovernmentUpdates;
