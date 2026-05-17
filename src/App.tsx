// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Outlet,
//   useNavigate,
// } from "react-router-dom";
// import { LanguageProvider } from "@/contexts/LanguageContext"; // Make sure this exists

// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import DirectorsDesk from "./pages/about/DirectorsDesk";
// import FormerDirectors from "./pages/about/FormerDirectors";

// import Hierarchy from "./pages/about/Hierarchy";
// import AboutDepartment from "./pages/about/AboutDepartment";
// import OfficesHeadquarters from "./pages/about/OfficesHeadquarters";
// import Ranks from "./pages/about/Ranks";
// import WelfareActivities from "./pages/about/WelfareActivities";
// import RootLayout from "./layout/RootLayout";
// import PressRelease from "./pages/citizen/PressRelease";
// import RTI from "./pages/citizen/RTI";
// import Gazette from "./pages/police/Gazette";
// import ListOfOfficers from "./pages/police/ListOfOfficers";
// import PromotionOrders from "./pages/police/PromotionOrders";
// import Transfers from "./pages/police/Transfers";
// import GradationList from "./pages/police/GradationList";
// import PositiveStories from "./pages/police/PositiveStories";
// import Tender from "./pages/citizen/Tender";

// import Contact from "./pages/Contact";
// import Recruitments from "./pages/citizen/Recruitments";
// import PhotoGallery from "./pages/PhotoGallery";
// import PrivacyPolicy from "./pages/general/PrivacyPolicy";
// import TermsOfUse from "./pages/general/ terms-of-use";
// import AccessibilityPage from "./pages/general/AccessibilityPage";
// import FlashSection  from "./components/FlashSection";

// const queryClient = new QueryClient();

// const AppRoutes = () => (
//   <Routes>
//     <Route path="/" element={<RootLayout />}>
//       <Route index element={<Index />} />
//       <Route path="about/directors-desk" element={<DirectorsDesk />} />
//       <Route path="about/former-directors" element={<FormerDirectors />} />
//       <Route path="about/hierarchy" element={<Hierarchy />} />
//       <Route path="about/department" element={<AboutDepartment />} />
//       <Route path="about/offices" element={<OfficesHeadquarters />} />
//       <Route path="about/ranks" element={<Ranks />} />
//       <Route path="about/welfare" element={<WelfareActivities />} />
//       <Route path="/citizen/press-release" element={<PressRelease />} />
//       <Route path="/citizen/rti" element={<RTI />} />
//       {/* <Route path="/citizen/tender" element={<Tender />} /> */}
//       {/* <Route path="/citizen/recruitments" element={<Recruitments />} /> */}
//       <Route path="/police/gazette" element={<Gazette />} />

//       <Route path="/police/gazette" element={<Gazette />} />
//       <Route
//         path="/police/officers"
//         element={<ListOfOfficers goBack={undefined} />}
//       />
//       <Route path="/police/promotions" element={<PromotionOrders />} />
//       <Route path="/police/transfers" element={<Transfers />} />
//       <Route path="/police/gradation" element={<GradationList />} />
//       <Route path="/police/stories" element={<PositiveStories />} />
       
//       <Route path="/tender" element={<Tender />} />
//       <Route path="/recruitments" element={<Recruitments />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/gallery" element={<PhotoGallery />} />

//       <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//       <Route path="/terms-of-use" element={<TermsOfUse />} />
//       <Route path="/accessibility" element={<AccessibilityPage />} />
//       <Route path="*" element={<NotFound />} />

//        <Route path="/flashsection " element={<FlashSection />} />
//          {/* 🏠 Main Flash Page */}
//         {/* <Route path="/" element={<FlashSection />} /> */}

//         {/* 📄 Sub Pages */}
//         {/* <Route path="/gradation-list" element={<GradationList />} /> */}
//         {/* <Route path="/transfer-orders" element={<TransferOrders />} /> */}
//         {/* <Route path="/promotion-orders" element={<PromotionOrders />} /> */}
//         {/* <Route path="/press-release" element={<PressRelease />} /> */}
//         {/* <Route path="/other-flash" element={<OtherFlash />} /> */}
//     </Route>
//   </Routes>
// );

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <LanguageProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <AppRoutes />
//         </BrowserRouter>
//       </TooltipProvider>
//     </LanguageProvider>
//   </QueryClientProvider>
// );

// export default App;


import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

// 🧭 Layout and Pages
import RootLayout from "./layout/RootLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// 🧩 About Pages
import DirectorsDesk from "./pages/about/DirectorsDesk";
import FormerDirectors from "./pages/about/FormerDirectors";
import Hierarchy from "./pages/about/Hierarchy";
import AboutDepartment from "./pages/about/AboutDepartment";
import OfficesHeadquarters from "./pages/about/OfficesHeadquarters";
import Ranks from "./pages/about/Ranks";
import WelfareActivities from "./pages/about/WelfareActivities";

// 👮 Police Pages
import Gazette from "./pages/police/Gazette";
import ListOfOfficers from "./pages/police/ListOfOfficers";
import PromotionOrders from "./pages/police/PromotionOrders";
import Transfers from "./pages/police/Transfers";
import GradationList from "./pages/police/GradationList";
import PositiveStories from "./pages/police/PositiveStories";

// 👥 Citizen Pages
import PressRelease from "./pages/citizen/PressRelease";
import RTI from "./pages/citizen/RTI";
import Tender from "./pages/citizen/Tender";
import Recruitments from "./pages/citizen/Recruitments";

// 📞 General Pages
import Contact from "./pages/Contact";
import PhotoGallery from "./pages/PhotoGallery";
import PrivacyPolicy from "./pages/general/PrivacyPolicy";
import TermsOfUse from "./pages/general/ terms-of-use";
import AccessibilityPage from "./pages/general/AccessibilityPage";
import OtherFlash from "./pages/OtherFlash";
import TransferOrders from "./pages/TransferOrders";
import i18 from "./i18n";

        {/* ✅ Faculty Route */}
import Faculty from "./pages/Faculty";


// ⚡ Flash Section
import FlashSection from "./components/FlashSection";

// 🔐 Admin
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "./layout/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminResource from "./pages/admin/Resource";


       {/* Training Calendar route */}
      //  import TrainingCalendar from ';
      import TrainingCalender from "./pages/TrainingCalender";
       


// (Optional) Flash Sub Pages
// import TransferOrders from "./pages/TransferOrders";
// import OtherFlash from "./pages/OtherFlash"; // if exists

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* 🌐 Main Layout */}
    <Route path="/" element={<RootLayout />}>
      {/* 🏠 Home */}
      <Route index element={<Index />} />

      {/* ℹ️ About Section */}
      <Route path="about/directors-desk" element={<DirectorsDesk />} />
      <Route path="about/former-directors" element={<FormerDirectors />} />
      <Route path="about/hierarchy" element={<Hierarchy />} />
      <Route path="about/department" element={<AboutDepartment />} />
      <Route path="about/offices" element={<OfficesHeadquarters />} />
      <Route path="about/ranks" element={<Ranks />} />
      <Route path="about/welfare" element={<WelfareActivities />} />


      {/* 👥 Citizen Section */}
      <Route path="citizen/press-release" element={<PressRelease />} />
      <Route path="citizen/rti" element={<RTI />} />
      <Route path="tender" element={<Tender />} />
      <Route path="recruitments" element={<Recruitments />} />

      {/* 👮 Police Section */}
      <Route path="police/gazette" element={<Gazette />} />
      <Route path="police/officers" element={<ListOfOfficers />} />
      <Route path="police/promotions" element={<PromotionOrders />} />
      <Route path="police/transfers" element={<Transfers />} />
      <Route path="police/gradation" element={<GradationList />} />
      <Route path="police/stories" element={<PositiveStories />} />

 

  
       {/* Training Calendar route */}
     {/* <Route path="/training-calendar" element={<TrainingCalendar />} /> */}
       {/* <Route path="/" element={<Navigate to="/training-calendar" replace />} /> */}
        {/* <Route path="/training-calendar" element={<TrainingCalendar />} /> */}
      {/* <Route path="/training-calender" element={<TrainingCalender />} /> */}
              {/* <Route path="/training-calendar" element={<TrainingCalender />} /> */}
                  {/* <TrainingCalendar language={language} /> */}
                  <Route path="/training-calendar" element={<TrainingCalender />} />



      {/* ⚡ Flash Section */}
    <Route path="/flashsection" element={<FlashSection />} />
<Route path="/gradation-list" element={<GradationList />} />
<Route path="/transfer-orders" element={<Transfers />} />
<Route path="/promotion-orders" element={<PromotionOrders />} />
<Route path="/press-release" element={<PressRelease />} />
<Route path="/other-flash" element={<OtherFlash />} />


      {/* 📞 General Pages */}
      <Route path="contact" element={<Contact />} />
      <Route path="gallery" element={<PhotoGallery />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="terms-of-use" element={<TermsOfUse />} />
      <Route path="accessibility" element={<AccessibilityPage />} />

              {/* ✅ Faculty Route */}
        <Route path="/faculty" element={<Faculty />} />



      {/* 🚫 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Route>

    {/* 🔐 Admin (no public navbar/footer) */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin" element={<ProtectedAdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path=":slug" element={<AdminResource />} />
      </Route>
    </Route>
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
