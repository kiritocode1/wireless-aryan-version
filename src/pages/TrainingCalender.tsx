import React from "react";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate, type Lang } from "@/lib/format";

type CalendarRow = {
  id: string;
  year: number;
  pdf_url: string | null;
};

type ScheduleRow = {
  id: string;
  course_name_en: string;
  course_name_mr: string;
  duration_en: string | null;
  duration_mr: string | null;
  date_from: string | null;
  date_to: string | null;
  eligibility_en: string | null;
  eligibility_mr: string | null;
  coordinator_en: string | null;
  coordinator_mr: string | null;
  pdf_url: string | null;
};

const TrainingCalendar: React.FC = () => {
  const { language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";

  const { data: trainingCalendar = [] } = useQuery({
    queryKey: ["public", "training_calendars"],
    queryFn: async (): Promise<CalendarRow[]> => {
      const { data, error } = await supabase
        .from("training_calendars")
        .select("id, year, pdf_url")
        .order("year", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: trainingSchedules = [] } = useQuery({
    queryKey: ["public", "training_schedules"],
    queryFn: async (): Promise<ScheduleRow[]> => {
      const { data, error } = await supabase
        .from("training_schedules")
        .select("id, course_name_en, course_name_mr, duration_en, duration_mr, date_from, date_to, eligibility_en, eligibility_mr, coordinator_en, coordinator_mr, pdf_url")
        .order("date_from", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCalendarTable = () => (
    <div className="mb-12">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
          Training Calendar
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white">
              <th className="px-6 py-4 text-center font-semibold">Sr. No.</th>
              <th className="px-6 py-4 text-center font-semibold">Year</th>
              <th className="px-6 py-4 text-center font-semibold">View</th>
              <th className="px-6 py-4 text-center font-semibold">Download</th>
            </tr>
          </thead>

          <tbody>
            {trainingCalendar.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">
                  No Data Available
                </td>
              </tr>
            ) : (
              trainingCalendar.map((row, index) => (
                <tr key={row.id} className="hover:bg-blue-50 transition duration-150">
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4 text-center">{row.year}</td>

                  <td className="px-6 py-4 text-center">
                    {row.pdf_url ? (
                      <button
                        onClick={() => window.open(row.pdf_url!, "_blank", "noopener,noreferrer")}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white shadow hover:scale-110 transition"
                        title="View"
                      >
                        👁
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {row.pdf_url ? (
                      <button
                        onClick={() => handleDownload(row.pdf_url!)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white shadow hover:scale-110 transition"
                      >
                        <Download size={18} />
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        Total Records:{" "}
        <span className="font-semibold text-blue-700">{trainingCalendar.length}</span>
      </div>
    </div>
  );

  const renderScheduleTable = () => (
    <div className="mb-12">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
          Training Schedules
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-800 to-blue-950 text-white">
              <th className="px-6 py-4 text-center font-semibold">Sr. No.</th>
              <th className="px-6 py-4 font-semibold">Name of Course</th>
              <th className="px-6 py-4 text-center font-semibold">Duration</th>
              <th className="px-6 py-4 text-center font-semibold">Date From</th>
              <th className="px-6 py-4 text-center font-semibold">Date To</th>
              <th className="px-6 py-4 text-center font-semibold">Eligibility</th>
              <th className="px-6 py-4 text-center font-semibold">Coordinator</th>
              <th className="px-6 py-4 text-center font-semibold">Download</th>
            </tr>
          </thead>

          <tbody>
            {trainingSchedules.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">
                  No Data Available
                </td>
              </tr>
            ) : (
              trainingSchedules.map((row, index) => {
                const courseName = lang === "mr" ? row.course_name_mr : row.course_name_en;
                const duration = lang === "mr" ? row.duration_mr : row.duration_en;
                const eligibility = lang === "mr" ? row.eligibility_mr : row.eligibility_en;
                const coordinator = lang === "mr" ? row.coordinator_mr : row.coordinator_en;
                return (
                  <tr key={row.id} className="hover:bg-blue-50">
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4">{courseName}</td>
                    <td className="px-6 py-4 text-center">{duration ?? "-"}</td>
                    <td className="px-6 py-4 text-center">{formatDate(row.date_from, lang) || "-"}</td>
                    <td className="px-6 py-4 text-center">{formatDate(row.date_to, lang) || "-"}</td>
                    <td className="px-6 py-4 text-center">{eligibility ?? "-"}</td>
                    <td className="px-6 py-4 text-center">{coordinator ?? "-"}</td>
                    <td className="px-6 py-4 text-center">
                      {row.pdf_url ? (
                        <button
                          onClick={() => handleDownload(row.pdf_url!)}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
                        >
                          <Download size={18} />
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        Total Courses:{" "}
        <span className="font-semibold text-blue-700">{trainingSchedules.length}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {renderCalendarTable()}
        {renderScheduleTable()}
      </div>
    </div>
  );
};

export default TrainingCalendar;
