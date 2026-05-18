"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { formatFileSize, type Lang } from "@/lib/format";

type RtiDoc = {
  id: string;
  title_en: string;
  title_mr: string;
  pdf_url: string | null;
  file_size_kb: number | null;
  display_order: number;
};

const labels = {
  en: {
    documentsTitle: "RTI Related Documents",
    back: "Back to Home",
    srno: "Sr. No.",
    details: "Document Title",
    view: "View",
    download: "Download",
    none: "No RTI documents available currently.",
    loading: "Loading…",
    error: "Failed to load documents.",
  },
  mr: {
    documentsTitle: "माहिती अधिकार संबंधित",
    back: "मुख्यपृष्ठावर जा",
    srno: "अ. क्र.",
    details: "शीर्षक",
    view: "पाहा",
    download: "डाउनलोड",
    none: "सध्या कोणतीही माहिती अधिकार कागदपत्रे उपलब्ध नाहीत.",
    loading: "लोड होत आहे…",
    error: "कागदपत्रे लोड करता आली नाहीत.",
  },
};

export default function RTIDocumentsTable() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";
  const L = labels[lang];
  const goBack = () => navigate("/");

  const { data: docs = [], isLoading, error } = useQuery({
    queryKey: ["public", "rti_documents"],
    queryFn: async (): Promise<RtiDoc[]> => {
      const { data, error } = await supabase
        .from("rti_documents")
        .select("id, title_en, title_mr, pdf_url, file_size_kb, display_order")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleView = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (pdfUrl: string, fileName: string) => {
    fetch(pdfUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        a.click();
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 text-gray-900 dark:text-gray-100 px-6 py-12 sm:px-12 lg:px-24">

      <Button
        variant="ghost"
        onClick={goBack}
        className="flex items-center gap-2 text-gray-900 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-100 dark:hover:bg-blue-950/30 dark:hover:text-blue-300 px-4 py-2 rounded-xl shadow-md"
      >
        <ArrowLeft className="w-4 h-4" /> {L.back}
      </Button>

      <div className="max-w-5xl mx-auto mt-12">
        <Card className="bg-white/40 border border-gray-300 backdrop-blur-md rounded-2xl shadow-xl dark:bg-gray-800/30 dark:border-gray-700">
          <CardContent className="p-6 overflow-x-auto">
            <h3 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              {L.documentsTitle}
            </h3>

            {isLoading ? (
              <p className="text-center py-6 text-gray-600 dark:text-gray-300">{L.loading}</p>
            ) : error ? (
              <p className="text-center py-6 text-red-600 dark:text-red-400">{L.error}</p>
            ) : docs.length === 0 ? (
              <p className="text-center py-6 text-gray-600 dark:text-gray-300">{L.none}</p>
            ) : (
              <table className="w-full text-left border-collapse border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 text-center">
                    <th className="border border-gray-300 px-3 py-2">{L.srno}</th>
                    <th className="border border-gray-300 px-3 py-2">{L.details}</th>
                    <th className="border border-gray-300 px-3 py-2">{L.view}</th>
                    <th className="border border-gray-300 px-3 py-2">{L.download}</th>
                  </tr>
                </thead>

                <tbody>
                  {docs.map((doc, index) => {
                    const title = lang === "mr" ? doc.title_mr : doc.title_en;
                    return (
                      <tr
                        key={doc.id}
                        className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-center transition-all"
                      >
                        <td className="border px-3 py-2">{index + 1}</td>
                        <td className="border px-3 py-2 text-left">{title}</td>
                        <td className="border px-3 py-2">
                          {doc.pdf_url ? (
                            <button
                              onClick={() => handleView(doc.pdf_url!)}
                              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Eye className="w-4 h-4" /> {L.view}
                            </button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="border px-3 py-2">
                          {doc.pdf_url ? (
                            <button
                              onClick={() => handleDownload(doc.pdf_url!, `${title}.pdf`)}
                              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Download className="w-4 h-4" /> {L.download}
                              {doc.file_size_kb ? ` (${formatFileSize(doc.file_size_kb)})` : ""}
                            </button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
