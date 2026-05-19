import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useMemo, ReactNode } from "react";
import { formatDateTime, updatedLabel, type Lang } from "@/lib/format";

import imgAdmin from "@/assets/11.jpg";
import imgTech from "@/assets/11.jpg";
import imgDev from "@/assets/11.jpg";
import imgVSat from "@/assets/11.jpg";
import imgStore from "@/assets/11.jpg";
import imgCommittee from "@/assets/11.jpg";
import imgTest from "@/assets/11.jpg";
import imgCentral from "@/assets/11.jpg";
import imgCipher from "@/assets/11.jpg";
import imgLicense from "@/assets/11.jpg";
import imgTraffic from "@/assets/11.jpg";

import imgBranchA from "@/assets/11.jpg";
import imgBranchB from "@/assets/11.jpg";
import imgBranchE from "@/assets/11.jpg";
import imgBranchD from "@/assets/11.jpg";
import imgTechnical from "@/assets/11.jpg";
import imgDevelopment from "@/assets/11.jpg";
import imgVSatSub from "@/assets/11.jpg";
import imgStoreSub from "@/assets/11.jpg";
import imgCommitteeSub from "@/assets/11.jpg";
import imgTestCell from "@/assets/11.jpg";
import imgCentralStore from "@/assets/11.jpg";
import imgCipherSub from "@/assets/11.jpg";
import imgLicenseSub from "@/assets/11.jpg";
import imgTrafficSub from "@/assets/11.jpg";

type OfficeSection = {
  slug: string;
  title_en: string;
  title_mr: string;
  incharge_en: string | null;
  incharge_mr: string | null;
  description_en: string | null;
  description_mr: string | null;
  photo_url: string | null;
  updated_at: string | null;
};

export default function OfficersHQ() {
  const { t, language } = useLanguage();
  const lang: Lang = language === "mr" ? "mr" : "en";
  const navigate = useNavigate();
  const goBack = () => navigate("/");

  const { data: dbSections = [] } = useQuery({
    queryKey: ["public", "office_sections"],
    queryFn: async (): Promise<OfficeSection[]> => {
      const { data, error } = await supabase
        .from("office_sections")
        .select("slug, title_en, title_mr, incharge_en, incharge_mr, description_en, description_mr, photo_url, updated_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const overrides = useMemo(() => {
    const m = new Map<string, OfficeSection>();
    for (const s of dbSections) m.set(s.slug, s);
    return m;
  }, [dbSections]);

  const SectionCard = ({
    slug,
    title,
    img,
    incharge,
    content,
  }: {
    slug: string;
    title: string;
    img: string;
    incharge?: string;
    content: ReactNode;
  }) => {
    const o = overrides.get(slug);
    const displayTitle = o ? (lang === "mr" ? o.title_mr : o.title_en) : t(title);
    const displayPhoto = o?.photo_url ?? img;
    const displayIncharge = o
      ? lang === "mr"
        ? o.incharge_mr
        : o.incharge_en
      : incharge
      ? t(incharge)
      : null;
    const displayDescription = o ? (lang === "mr" ? o.description_mr : o.description_en) : null;
    const displayUpdatedAt = o?.updated_at ?? null;

    return (
      <Card className="overflow-hidden shadow-xl border-none hover:shadow-2xl transition-all duration-500 rounded-3xl">
        <img src={displayPhoto} alt={displayTitle} className="w-full h-64 object-cover" />
        <CardContent className="p-8 space-y-6">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            {displayTitle}
          </h2>
          {displayUpdatedAt && (
            <p className="text-xs text-gray-500">
              {updatedLabel(lang)}: {formatDateTime(displayUpdatedAt, lang)}
            </p>
          )}
          {displayIncharge && (
            <p className="text-lg italic text-gray-700">
              <span className="font-semibold not-italic">{t("inCharge")}: </span> {displayIncharge}
            </p>
          )}
          {displayDescription && (
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {displayDescription}
            </p>
          )}
          <div>{content}</div>
        </CardContent>
      </Card>
    );
  };

  const renderList = (items: string[]) => (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-violet-600 flex-shrink-0 mt-1" />
          <span className="text-gray-800 text-base leading-relaxed">{t(item)}</span>
        </li>
      ))}
    </ul>
  );

  const FAQItem = ({
    title,
    image,
    content,
    value,
  }: {
    title: string;
    image?: string;
    content: ReactNode;
    value: string;
  }) => (
    <AccordionItem value={value} className="border-b border-gray-200">
      <AccordionTrigger className="text-left py-4 hover:no-underline">
        <div className="flex items-center gap-4">
          {image && (
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800">{t(title)}</h3>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4 pt-2">
        <div className="flex flex-col md:flex-row gap-6">
          {image && (
            <div className="md:w-1/3">
              <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg shadow-md" />
            </div>
          )}
          <div className={image ? "md:w-2/3" : "w-full"}>{content}</div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 px-6 py-12 sm:px-12 lg:px-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-32 left-40 w-96 h-96 bg-violet-400/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-32 right-40 w-[32rem] h-[32rem] bg-blue-400/20 blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-20">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-all duration-300 text-sm font-medium text-violet-700 mb-8 shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToHome")}
        </button>

        <h1 className="text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-violet-600 via-blue-600 to-teal-600 bg-clip-text text-transparent drop-shadow-md">
          {t("officersInHQ")}
        </h1>

        <SectionCard
          slug="administrative_office"
          title="administrativeOffice"
          img={imgAdmin}
          incharge="officeSuperintendent"
          content={
            <Accordion type="single" collapsible className="w-full">
              <FAQItem title="branchA" image={imgBranchA} value="a" content={renderList(["rti", "yearlyAdminReport", "budgetInspection", "bmiQuarters", "billPaymentOrder"])} />
              <FAQItem title="branchB" image={imgBranchB} value="b" content={renderList(["welfareIncomeTaxGST", "accountsPension"])} />
              <FAQItem title="branchE" image={imgBranchE} value="e" content={renderList(["matCases", "enquiriesWireless", "pcPsiGradation", "promotionsTransfers", "serviceSheets", "vacancyStatements", "classificationExams", "recruitmentRR"])} />
              <FAQItem title="branchD" image={imgBranchD} value="d" content={renderList(["procurementSpares", "tenderProcessWireless"])} />
            </Accordion>
          }
        />

        <SectionCard
          slug="technical_branch"
          title="technicalBranch"
          img={imgTech}
          incharge="dyspAdmin"
          content={
            <Accordion type="single" collapsible className="w-full">
              <FAQItem title="technicalBranchDetails" image={imgTechnical} value="technical" content={renderList(["supervisesDailyWork", "adminBranches", "technicalBranches", "bandobastBranch", "planningBranch", "homePI", "welfareBranch", "sssBranch"])} />
            </Accordion>
          }
        />

        <SectionCard
          slug="development_section"
          title="developmentSection"
          img={imgDev}
          content={
            <Accordion type="single" collapsible className="w-full">
              <FAQItem title="developmentSectionDetails" image={imgDevelopment} value="development" content={renderList(["computerSection", "radioCommunication", "lineCommunication", "electricalSection", "installationBranch", "storeSection"])} />
            </Accordion>
          }
        />

        <SectionCard
          slug="vsat_section"
          title="vsatSection"
          img={imgVSat}
          incharge="dysp"
          content={
            <Accordion type="single" collapsible className="w-full">
              <FAQItem title="vsatSectionDetails" image={imgVSatSub} value="vsat" content={renderList(["monitorPolnetStations", "guidancePolnetUnits", "smoothPolnetOperation", "specificationsPolnetCCTV"])} />
            </Accordion>
          }
        />

        <SectionCard
          slug="store_sections"
          title="storeSections"
          img={imgStore}
          content={
            <Accordion type="single" collapsible className="w-full">
              <FAQItem title="storeSectionsDetails" image={imgStoreSub} value="store" content={renderList(["storeSectionI", "storeSectionII", "storeSectionIII"])} />
            </Accordion>
          }
        />

        <SectionCard
          slug="committee_section"
          title="committeeSection"
          img={imgCommittee}
          content={
            <Accordion type="single" collapsible className="w-full">
              <FAQItem title="committeeSectionDetails" image={imgCommitteeSub} value="committee" content={renderList(["equipmentChecks", "testReceiptReports"])} />
            </Accordion>
          }
        />

        <SectionCard
          slug="test_cell"
          title="testCell"
          img={imgTest}
          content={
            <Accordion type="single" collapsible className="w-full">
              <FAQItem title="testCellDetails" image={imgTestCell} value="testcell" content={renderList(["testingWireless", "maintenanceCentralStore"])} />
            </Accordion>
          }
        />

        <SectionCard
          slug="central_store_admin"
          title="centralStoreAdmin"
          img={imgCentral}
          content={
            <Accordion type="single" collapsible className="w-full">
              <FAQItem title="centralStoreAdminDetails" image={imgCentralStore} value="centralstore" content={renderList(["inwardOutwardEntries", "recordKeeping", "assistStoreSections"])} />
            </Accordion>
          }
        />

        <SectionCard
          slug="cipher_branch"
          title="cipherBranch"
          img={imgCipher}
          incharge="dyspCipher"
          content={
            <Accordion type="single" collapsible className="w-full">
              <FAQItem title="cipherBranchDetails" image={imgCipherSub} value="cipher" content={renderList(["custodianCipher", "courierArrangements", "coordinationCryptoCenters", "cipherCourses", "maintenanceCipherDocs", "loadingCipherPrograms", "inspectionsCryptoCenters"])} />
            </Accordion>
          }
        />

        <SectionCard
          slug="license_branch"
          title="licenseBranch"
          img={imgLicense}
          incharge="dyspLicense"
          content={
            <Accordion type="single" collapsible className="w-full">
              <FAQItem title="licenseBranchDetails" image={imgLicenseSub} value="license" content={renderList(["applyRadioLicenses", "paySpectrumCharges", "applyFrequencies", "distributeNetworkLetters", "trafficReturns", "prepareCallSigns"])} />
            </Accordion>
          }
        />

        <SectionCard
          slug="traffic_branch"
          title="trafficBranch"
          img={imgTraffic}
          incharge="dyspTraffic"
          content={
            <Accordion type="single" collapsible className="w-full">
              <FAQItem title="trafficBranchDetails" image={imgTrafficSub} value="traffic" content={renderList(["inspectPolnetStations", "prepareCallSigns", "conductITExams", "superviseTrafficCases", "scrutinySecurityBreach"])} />
            </Accordion>
          }
        />
      </div>
    </div>
  );
}
