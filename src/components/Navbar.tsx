// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown, Menu, X } from "lucide-react";
// import AshokStambhLogo from "@/assets/ashok-stambh.png";
// import WirelessLogo from "@/assets/wireless.png";
// import PoliceLogo from "@/assets/police-logo.png";
// import { Link, useNavigate } from "react-router-dom";
// import { useLanguage } from "@/contexts/LanguageContext";

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const [scrolled, setScrolled] = useState(false);
//   const navigate = useNavigate();
//   const { t } = useLanguage();

//   const navigationItems = [
//     {
//       name: t("nav.home"),
//       hasDropdown: false,
//       url: "/",
//       items: [{ name: t("nav.home"), url: "/" }],
//     },
//     {
//       name: t("nav.about"),
//       hasDropdown: true,
//       url: "/about",
//       items: [
//         { name: t("nav.directorDesk"), url: "/about/directors-desk" },
//         { name: t("nav.formerDirectors"), url: "/about/former-directors" },
//         { name: t("nav.hierarchy"), url: "/about/hierarchy" },
//         { name: t("nav.aboutDepartment"), url: "/about/department" },
//         { name: t("nav.ranks"), url: "/about/ranks" },
//         { name: t("nav.welfare"), url: "/about/welfare" },
//       ],
//     },
//     {
//       name: t("nav.citizens"),
//       hasDropdown: true,
//       url: "/resources",
//       items: [
//         { name: t("nav.pressRelease"), url: "/citizen/press-release" },
//         { name: t("nav.rti"), url: "/citizen/rti" },
//         { name: t("nav.tenders"), url: "/citizen/tender" },
//         { name: t("nav.recruitments"), url: "/citizen/recruitments" },
//       ],
//     },
//     {
//       name: t("nav.police_corner"),
//       hasDropdown: true,
//       url: "/opportunities",
//       items: [
//         { name: t("nav.gazette"), url: "/police/gazette" },
//         { name: t("nav.officersList"), url: "/police/officers" },
//         { name: t("nav.promotionOrders"), url: "/police/promotions" },
//         { name: t("nav.transfers"), url: "/police/transfers" },
//         { name: t("nav.gradationList"), url: "/police/gradation" },
//         { name: t("nav.positiveStories"), url: "/police/stories" },
//       ],
//     },
//     {
//       name: t("nav.gallery"),
//       hasDropdown: false,
//       url: "/gallery",
//       items: [{ name: t("nav.gallery"), url: "/gallery" }],
//     },
//     {
//       name: t("nav.contact"),
//       hasDropdown: false,
//       url: "/contact",
//       items: [{ name: t("nav.contactUs"), url: "/contact" }],
//     },
//   ];

//   const toggleDropdown = (itemName: string) => {
//     setOpenDropdown(openDropdown === itemName ? null : itemName);
//   };

//   const handleMobileNavigation = (url: string) => {
//     navigate(url);
//     setIsMobileMenuOpen(false);
//     setOpenDropdown(null);
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <nav className="w-full font-sans border-b border-gray-300 dark:border-gray-700 rounded-b-lg sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
//         <div className="flex justify-between items-center h-16 md:h-24 bg-white dark:bg-gray-900 transition-all duration-300">
//           {/* Left: Logos */}
//           <div className="flex items-center space-x-2 bg-white dark:bg-gray-900">
//             <Link to="/">
//               <div className="w-10 h-10 md:w-14 md:h-14 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
//                 <img src={AshokStambhLogo} className="rounded-full" alt="logo" />
//               </div>
//             </Link>

//             <Link to="/">
//   <div
//     className="w-24 h-14 rounded-lg flex items-center justify-center
//                bg-white dark:bg-gray-900 border dark:border-gray-700"
//   >
//     <img
//       src={WirelessLogo}
//       alt="Wireless Logo"
//       className="max-h-full max-w-full object-contain"
//     />
//   </div>
// </Link>


//             {/* Title: Hidden until scrolled */}
//             <Link to="/">
//               <span
//                 dangerouslySetInnerHTML={{ __html: t("title") }}
//                 className={`hidden sm:block text-gray-800 dark:text-white md:text-lg font-bold transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`}
//                 style={{ fontFamily: "Times New Roman, serif" }}
//               ></span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden xl:flex items-center space-x-4 pr-16 bg-white dark:bg-gray-900">
//             {navigationItems.map((item) => (
//               <div key={item.name} className="bg-white dark:bg-gray-900">
//                 {item.hasDropdown ? (
//                   <DropdownMenu modal={false}>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         className="text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
//                       >
//                         {item.name}
//                         <ChevronDown className="w-4 h-4 ml-1" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent
//                       align="start"
//                       className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg z-[60] min-w-[180px]"
//                     >
//                       {item.items.map((subItem) => (
//                         <DropdownMenuItem
//                           key={subItem.name}
//                           onClick={() => navigate(subItem.url)}
//                           className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
//                         >
//                           <Link to={subItem.url} className="w-full">
//                             {subItem.name}
//                           </Link>
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 ) : (
//                   <Button
//                     variant="ghost"
//                     className="text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
//                   >
//                     <Link to={item.url}>{item.name}</Link>
//                   </Button>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Police Logo */}
//           <div className="hidden xl:flex bg-white dark:bg-gray-900">
//             <div className="w-16 h-20 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center">
//               <img src={PoliceLogo} alt="logo" />
//             </div>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <div className="xl:hidden bg-white dark:bg-gray-900">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
//             >
//               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Dropdown Menu */}
//         {isMobileMenuOpen && (
//           <div className="xl:hidden absolute left-0 right-0 top-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-[55] max-h-[calc(100vh-4rem)] overflow-y-auto">
//             <div className="py-4 px-4 bg-white dark:bg-gray-900">
//               <div className="flex flex-col space-y-2">
//                 {navigationItems.map((item) => (
//                   <div key={item.name} className="py-2 bg-white dark:bg-gray-900">
//                     <div className="flex items-center justify-between bg-white dark:bg-gray-900">
//                       {item.hasDropdown ? (
//                         <button
//                           onClick={() => toggleDropdown(item.name)}
//                           className="flex items-center justify-between w-full text-left text-gray-800 dark:text-gray-100 font-bold hover:text-black dark:hover:text-white"
//                         >
//                           <span>{item.name}</span>
//                           <ChevronDown
//                             className={`w-4 h-4 transition-transform duration-200 ${
//                               openDropdown === item.name ? "rotate-180" : ""
//                             }`}
//                           />
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleMobileNavigation(item.url)}
//                           className="text-gray-800 dark:text-gray-100 font-bold hover:text-black dark:hover:text-white"
//                         >
//                           {item.name}
//                         </button>
//                       )}
//                     </div>
//                     {item.hasDropdown && openDropdown === item.name && (
//                       <div className="mt-2 pl-4 space-y-1">
//                         {item.items.map((subItem) => (
//                           <button
//                             key={subItem.name}
//                             onClick={() => handleMobileNavigation(subItem.url)}
//                             className="block w-full text-left py-2 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white"
//                           >
//                             {subItem.name}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                 <div className="w-full flex bg-white dark:bg-gray-900 rounded-lg items-center justify-center mt-4 p-2">
//                   <img src={PoliceLogo} className="w-14 h-14" alt="logo" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown, Menu, X } from "lucide-react";
// import AshokStambhLogo from "@/assets/ashok-stambh.png";
// import WirelessLogo from "@/assets/wireless.png";
// import PoliceLogo from "@/assets/police-logo.png";
// import { Link, useNavigate } from "react-router-dom";
// import { useLanguage } from "@/contexts/LanguageContext";

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const [scrolled, setScrolled] = useState(false);
//   const navigate = useNavigate();
//   const { t } = useLanguage();

//   const navigationItems = [
//     {
//       name: t("nav.home"),
//       hasDropdown: false,
//       url: "/",
//       items: [{ name: t("nav.home"), url: "/" }],
//     },
//     {
//       name: t("nav.about"),
//       hasDropdown: true,
//       url: "/about",
//       items: [
//         { name: t("nav.directorDesk"), url: "/about/directors-desk" },
//         { name: t("nav.formerDirectors"), url: "/about/former-directors" },
//         { name: t("nav.hierarchy"), url: "/about/hierarchy" },
//         { name: t("nav.aboutDepartment"), url: "/about/department" },
//         { name: t("nav.ranks"), url: "/about/ranks" },
//         { name: t("nav.welfare"), url: "/about/welfare" },
//       ],
//     },
//     {
//       name: t("nav.citizens"),
//       hasDropdown: true,
//       url: "/resources",
//       items: [
//         { name: t("nav.pressRelease"), url: "/citizen/press-release" },
//         { name: t("nav.rti"), url: "/citizen/rti" },
//         { name: t("nav.tenders"), url: "/citizen/tender" },
//         { name: t("nav.recruitments"), url: "/citizen/recruitments" },
//       ],
//     },
//     {
//       name: t("nav.police_corner"),
//       hasDropdown: true,
//       url: "/opportunities",
//       items: [
//         { name: t("nav.gazette"), url: "/police/gazette" },
//         { name: t("nav.officersList"), url: "/police/officers" },
//         { name: t("nav.promotionOrders"), url: "/police/promotions" },
//         { name: t("nav.transfers"), url: "/police/transfers" },
//         { name: t("nav.gradationList"), url: "/police/gradation" },
//         { name: t("nav.positiveStories"), url: "/police/stories" },
//       ],
//     },
//     {
//       name: t("nav.gallery"),
//       hasDropdown: false,
//       url: "/gallery",
//       items: [{ name: t("nav.gallery"), url: "/gallery" }],
//     },
//     {
//       name: t("nav.contact"),
//       hasDropdown: false,
//       url: "/contact",
//       items: [{ name: t("nav.contactUs"), url: "/contact" }],
//     },
//   ];

//   const toggleDropdown = (itemName: string) => {
//     setOpenDropdown(openDropdown === itemName ? null : itemName);
//   };

//   const handleMobileNavigation = (url: string) => {
//     navigate(url);
//     setIsMobileMenuOpen(false);
//     setOpenDropdown(null);
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <nav className="w-full font-sans border-b border-blue-900 dark:border-blue-950 rounded-b-lg sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-blue-950 dark:from-gray-900 dark:to-blue-950 shadow-xl transition-colors duration-300">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8 bg-transparent">
//         <div className="flex justify-between items-center h-16 md:h-24 bg-transparent transition-all duration-300">
//           {/* Left: Logos */}
//           <div className="flex items-center space-x-2 bg-transparent">
//             <Link to="/">
//               <div className="w-10 h-10 md:w-14 md:h-14 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
//                 <img src={AshokStambhLogo} className="rounded-full" alt="logo" />
//               </div>
//             </Link>

//             <Link to="/">
//               <div className="w-24 h-14 rounded-lg flex items-center justify-center bg-white dark:bg-gray-800 border border-blue-800 dark:border-blue-700 shadow-lg">
//                 <img
//                   src={WirelessLogo}
//                   alt="Wireless Logo"
//                   className="max-h-full max-w-full object-contain"
//                 />
//               </div>
//             </Link>

//             {/* Title: Hidden until scrolled */}
//             <Link to="/">
//               <span
//                 dangerouslySetInnerHTML={{ __html: t("title") }}
//                 className={`hidden sm:block text-white md:text-lg font-bold transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`}
//                 style={{ fontFamily: "Times New Roman, serif" }}
//               ></span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden xl:flex items-center space-x-4 pr-16 bg-transparent">
//             {navigationItems.map((item) => (
//               <div key={item.name} className="bg-transparent">
//                 {item.hasDropdown ? (
//                   <DropdownMenu modal={false}>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         className="text-white bg-transparent hover:text-white hover:bg-blue-800 dark:hover:bg-blue-900 transition-all duration-200"
//                       >
//                         {item.name}
//                         <ChevronDown className="w-4 h-4 ml-1" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent
//                       align="start"
//                       className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg z-[60] min-w-[180px]"
//                     >
//                       {item.items.map((subItem) => (
//                         <DropdownMenuItem
//                           key={subItem.name}
//                           onClick={() => navigate(subItem.url)}
//                           className="text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer"
//                         >
//                           <Link to={subItem.url} className="w-full">
//                             {subItem.name}
//                           </Link>
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 ) : (
//                   <Button
//                     variant="ghost"
//                     className="text-white bg-transparent hover:text-white hover:bg-blue-800 dark:hover:bg-blue-900 transition-all duration-200"
//                   >
//                     <Link to={item.url}>{item.name}</Link>
//                   </Button>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Police Logo */}
//           <div className="hidden xl:flex bg-transparent">
//             <div className="w-16 h-20 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-lg">
//               <img src={PoliceLogo} alt="logo" />
//             </div>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <div className="xl:hidden bg-transparent">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="text-white bg-transparent hover:bg-blue-800 dark:hover:bg-blue-900"
//             >
//               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Dropdown Menu */}
//         {isMobileMenuOpen && (
//           <div className="xl:hidden absolute left-0 right-0 top-full bg-gradient-to-r from-blue-900 to-blue-950 dark:from-gray-900 dark:to-blue-950 border-t border-blue-800 dark:border-blue-900 shadow-xl z-[55] max-h-[calc(100vh-4rem)] overflow-y-auto">
//             <div className="py-4 px-4 bg-transparent">
//               <div className="flex flex-col space-y-2">
//                 {navigationItems.map((item) => (
//                   <div key={item.name} className="py-2 bg-transparent">
//                     <div className="flex items-center justify-between bg-transparent">
//                       {item.hasDropdown ? (
//                         <button
//                           onClick={() => toggleDropdown(item.name)}
//                           className="flex items-center justify-between w-full text-left text-white font-bold hover:text-blue-200"
//                         >
//                           <span>{item.name}</span>
//                           <ChevronDown
//                             className={`w-4 h-4 transition-transform duration-200 ${
//                               openDropdown === item.name ? "rotate-180" : ""
//                             }`}
//                           />
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleMobileNavigation(item.url)}
//                           className="text-white font-bold hover:text-blue-200"
//                         >
//                           {item.name}
//                         </button>
//                       )}
//                     </div>
//                     {item.hasDropdown && openDropdown === item.name && (
//                       <div className="mt-2 pl-4 space-y-1">
//                         {item.items.map((subItem) => (
//                           <button
//                             key={subItem.name}
//                             onClick={() => handleMobileNavigation(subItem.url)}
//                             className="block w-full text-left py-2 text-blue-200 hover:text-white"
//                           >
//                             {subItem.name}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                {/* Police Logo */}
// <div className="hidden xl:flex bg-transparent ">
//   <div className="w-16 h-20 bg-white bg-rounded-full dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-lg ml-">
//     <img src={PoliceLogo} alt="logo" />
//   </div>
// </div>

//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown, Menu, X } from "lucide-react";
// import AshokStambhLogo from "@/assets/ashok-stambh.png";
// import WirelessLogo from "@/assets/wireless.png";
// import PoliceLogo from "@/assets/police-logo.png";
// import { Link, useNavigate } from "react-router-dom";
// import { useLanguage } from "@/contexts/LanguageContext";

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const { t } = useLanguage();

//   const navigationItems = [
//     {
//       name: t("nav.home"),
//       hasDropdown: false,
//       url: "/",
//       items: [{ name: t("nav.home"), url: "/" }],
//     },
//     {
//       name: t("nav.about"),
//       hasDropdown: true,
//       url: "/about ",
//       items: [
//         { name: t("nav.directorDesk"), url: "/about/directors-desk" },
//         { name: t("nav.formerDirectors"), url: "/about/former-directors" },
//         { name: t("nav.hierarchy"), url: "/about/hierarchy" },
//         { name: t("nav.aboutDepartment"), url: "/about/department" },
//         { name: t("nav.offices"), url: "/about" },
//         { name: t("nav.ranks"), url: "/about/ranks" },
//         { name: t("nav.welfare"), url: "/about/welfare" },
//       ],
//     },
//     {
//       name: t("nav.citizens"),
//       hasDropdown: true,
//       url: "/resources",
//       items: [
//         { name: t("nav.pressRelease"), url: "/citizen/press-release" },
//         { name: t("nav.rti"), url: "/citizen/rti" },
//         // { name: t("nav.tenders"), url: "/citizen/tender" },
//         // { name: t("nav.recruitments"), url: "/citizen/recruitments" },
//       ],
//     },
//     {
//       name: t("nav.police_corner"),
//       hasDropdown: true,
//       url: "/opportunities",
//       items: [
//         { name: t("nav.gazette"), url: "/police/gazette" },
//         { name: t("nav.flash"), url: "/flashsection" },
//         { name: t("nav.officersList"), url: "/police/officers" },
//         { name: t("nav.promotionOrders"), url: "/police/promotions" },
//         { name: t("nav.transfers"), url: "/police/transfers" },
//         { name: t("nav.gradationList"), url: "/police/gradation" },
//         { name: t("nav.strategySupport"), url: "/police" },
//         { name: t("nav.positiveStories"), url: "/police/stories" },
//       ],
//     },
//      {
//       name: t("nav.tenders"),
//       hasDropdown: false,
//       url: "/tender",
//       items: [{ name: t("nav.tenders"), url: "/tender" }],
//     },
//      {
//       name: t("nav.recruitments"),
//       hasDropdown: false,
//     url: "/recruitments",
//       items: [{ name: t("nav.recruitments"), url: "/recruitments" }],
//     },
//     {
//       name: t("nav.gallery"),
//       hasDropdown: false,
//       url: "/gallery",
//       items: [{ name: t("nav.gallery"), url: "/gallery" }],
//     },
//     {
//       name: t("nav.contact"),
//       hasDropdown: false,
//       url: "/contact",
//       items: [{ name: t("nav.contactUs"), url: "/contact" }],
//     },
//   ];

//   const toggleDropdown = (itemName: string) => {
//     setOpenDropdown(openDropdown === itemName ? null : itemName);
//   };

//   const handleMobileNavigation = (url: string) => {
//     navigate(url);
//     setIsMobileMenuOpen(false);
//     setOpenDropdown(null);
//   };

//   return (
//     <nav className="w-full font-sans border-b border-blue-900 dark:border-blue-950 rounded-b-lg sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-blue-950 dark:from-gray-900 dark:to-blue-950 shadow-xl transition-colors duration-300 ">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8 bg-transparent">
//         <div className="flex justify-between items-center h-16 md:h-24 bg-transparent transition-all duration-300">
          
//           {/* Left Logos */}
//           <div className="flex items-center space-x-2 md:space-x-4">
//             <Link to="/">
//               <div className="w-10 h-10 md:w-14 md:h-14 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
//                 <img src={AshokStambhLogo} className="rounded-full" alt="logo" />
//               </div>
//             </Link>

//             <Link to="/">
//               <div className="w-24 h-14 rounded-lg flex items-center justify-center bg-white dark:bg-gray-800 border border-blue-800 dark:border-blue-700 shadow-lg">
//                 <img
//                   src={WirelessLogo}
//                   alt="Wireless Logo"
//                   className="max-h-full max-w-full object-contain"
//                 />
//               </div>
//             </Link>
//           </div>

//           {/* Center Navigation */}
//           <div className="hidden xl:flex flex-1 justify-center items-center">
//             {navigationItems.map((item) => (
//               <div
//                 key={item.name}
//                 className={`flex items-center ${
//                   item.url === "/contact" ? "ml-6" : "mx-2"
//                 }`}
//               >
//                 {item.hasDropdown ? (
//                   <DropdownMenu modal={false}>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         className="text-white md:text-[18px] bg-transparent hover:text-white hover:bg-blue-800 dark:hover:bg-blue-900 transition-all duration-200"
//                       >
//                         {item.name}
//                         <ChevronDown className="w-4 h-4 ml-1" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent
//                       align="start"
//                       className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg z-[60] min-w-[180px]"
//                     >
//                       {item.items.map((subItem) => (
//                         <DropdownMenuItem
//                           key={subItem.name}
//                           onClick={() => navigate(subItem.url)}
//                           className="text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer"
//                         >
//                           <Link to={subItem.url} className="w-full">
//                             {subItem.name}
//                           </Link>
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 ) : (
//                   <Button
//                     variant="ghost"
//                     className="text-white md:text-[18px] bg-transparent hover:text-white hover:bg-blue-800 dark:hover:bg-blue-900 transition-all duration-200 flex items-center"
//                   >
//                     <Link to={item.url}>{item.name}</Link>
//                   </Button>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Right Police Logo */}
//          {/* Right Police Logo */}  
// <div className="hidden xl:flex items-center justify-center">
//   <div className="w-14 h-18 md:w-16 md:h-20 flex items-center justify-center  hover:scale-110 hover:shadow-blue-400/50 transition-transform duration-300 mr-20">
//     <img src={PoliceLogo} alt="Police Logo" className="object-contain" />
//   </div>
// </div>


//           {/* Mobile Menu Toggle */}
//           <div className="xl:hidden bg-transparent">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="text-white bg-transparent hover:bg-blue-800 dark:hover:bg-blue-900"
//             >
//               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="xl:hidden absolute left-0 right-0 top-full bg-gradient-to-r from-blue-900 to-blue-950 dark:from-gray-900 dark:to-blue-950 border-t border-blue-800 dark:border-blue-900 shadow-xl z-[55] max-h-[calc(100vh-4rem)] overflow-y-auto px-4">
//             <div className="py-4 px-4 bg-transparent">
//               <div className="flex flex-col space-y-2">
//                 {navigationItems.map((item) => (
//                   <div key={item.name} className="py-2 bg-transparent">
//                     <div className="flex items-center justify-between bg-transparent">
//                       {item.hasDropdown ? (
//                         <button
//                           onClick={() => toggleDropdown(item.name)}
//                           className="flex items-center justify-between w-full text-left text-white text-xl font-bold hover:text-blue-200"
//                         >
//                           <span>{item.name}</span>
//                           <ChevronDown
//                             className={`w-4 h-4 transition-transform duration-200 ${
//                               openDropdown === item.name ? "rotate-180" : ""
//                             }`}
//                           />
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleMobileNavigation(item.url)}
//                           className="text-white text-xl font-bold hover:text-blue-200"
//                         >
//                           {item.name}
//                         </button>
//                       )}
//                     </div>
//                     {item.hasDropdown && openDropdown === item.name && (
//                       <div className="mt-2 pl-4 space-y-1">
//                         {item.items.map((subItem) => (
//                           <button
//                             key={subItem.name}
//                             onClick={() => handleMobileNavigation(subItem.url)}
//                             className="block w-full text-left py-2 text-blue-200 hover:text-white text-lg"
//                           >
//                             {subItem.name}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {/* Police Logo in mobile */}
//                 <div className="w-full flex bg-white dark:bg-gray-800 rounded-lg items-center justify-center mt-4 p-2 shadow-lg">
//                   <img src={PoliceLogo} className="w-16 h-20" alt="logo" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown, Menu, X } from "lucide-react";
// import AshokStambhLogo from "@/assets/ashok-stambh.png";
// import WirelessLogo from "@/assets/wireless.png";
// import PoliceLogo from "@/assets/police-logo.png";
// import { Link, useNavigate } from "react-router-dom";
// import { useLanguage } from "@/contexts/LanguageContext";

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const navigate = useNavigate();
//   const { t } = useLanguage();

//   const navigationItems = [
//     {
//       name: t("nav.home"),
//       hasDropdown: false,
//       url: "/",
//       items: [{ name: t("nav.home"), url: "/" }],
//     },
//     {
//       name: t("nav.about"),
//       hasDropdown: true,
//       url: "/about",
//       items: [
//         { name: t("nav.directorDesk"), url: "/about/directors-desk" },
//         { name: t("nav.formerDirectors"), url: "/about/former-directors" },
//         { name: t("nav.hierarchy"), url: "/about/hierarchy" },
//         { name: t("nav.aboutDepartment"), url: "/about/department" },
//         { name: t("nav.offices"), url: "/about" },
//         { name: t("nav.ranks"), url: "/about/ranks" },
//         { name: t("nav.welfare"), url: "/about/welfare" },
//       ],
//     },
//     {
//       name: t("nav.citizens"),
//       hasDropdown: true,
//       url: "/resources",
//       items: [
//         { name: t("nav.pressRelease"), url: "/citizen/press-release" },
//         { name: t("nav.rti"), url: "/citizen/rti" },
//       ],
//     },
//     {
//       name: t("nav.police_corner"),
//       hasDropdown: true,
//       url: "/opportunities",
//       items: [
//         { name: t("nav.gazette"), url: "/police/gazette" },
//         { name: t("nav.flash"), url: "/flashsection" },
//         { name: t("nav.officersList"), url: "/police/officers" },
//         { name: t("nav.promotionOrders"), url: "/police/promotions" },
//         { name: t("nav.transfers"), url: "/police/transfers" },
//         { name: t("nav.gradationList"), url: "/police/gradation" },
//         // ✅ external link (opens in new tab)
//         { name: t("nav.strategySupport"), url: "https://117.222.38.165/SSS/" },
//         { name: t("nav.positiveStories"), url: "/police/stories" },
//       ],
//     },
//     {
//       name: t("nav.tenders"),
//       hasDropdown: false,
//       url: "/tender",
//       items: [{ name: t("nav.tenders"), url: "/tender" }],
//     },
//     {
//       name: t("nav.recruitments"),
//       hasDropdown: false,
//       url: "/recruitments",
//       items: [{ name: t("nav.recruitments"), url: "/recruitments" }],
//     },
//     {
//       name: t("nav.gallery"),
//       hasDropdown: false,
//       url: "/gallery",
//       items: [{ name: t("nav.gallery"), url: "/gallery" }],
//     },
//     {
//       name: t("nav.contact"),
//       hasDropdown: false,
//       url: "/contact",
//       items: [{ name: t("nav.contactUs"), url: "/contact" }],
//     },
//   ];

//   const toggleDropdown = (itemName) => {
//     setOpenDropdown(openDropdown === itemName ? null : itemName);
//   };

//   // ✅ Handles internal vs external navigation
//   const handleNavigation = (url) => {
//     if (url.startsWith("http")) {
//       window.open(url, "_blank", "noopener,noreferrer");
//     } else {
//       navigate(url);
//     }
//     setOpenDropdown(null);
//   };

//   const handleMobileNavigation = (url) => {
//     if (url.startsWith("http")) {
//       window.open(url, "_blank", "noopener,noreferrer");
//     } else {
//       navigate(url);
//     }
//     setIsMobileMenuOpen(false);
//     setOpenDropdown(null);
//   };

//   return (
//     <nav className="w-full font-sans border-b border-blue-900 dark:border-blue-950 rounded-b-lg sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-blue-950 dark:from-gray-900 dark:to-blue-950 shadow-xl transition-colors duration-300">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8 bg-transparent">
//         <div className="flex justify-between items-center h-16 md:h-24 bg-transparent transition-all duration-300">
//           {/* Left Logos */}
//           <div className="flex items-center space-x-2 md:space-x-4">
//             <Link to="/">
//               <div className="w-10 h-10 md:w-14 md:h-14 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
//                 <img src={AshokStambhLogo} className="rounded-full" alt="logo" />
//               </div>
//             </Link>

//             <Link to="/">
//               <div className="w-24 h-14 rounded-lg flex items-center justify-center bg-white dark:bg-gray-800 border border-blue-800 dark:border-blue-700 shadow-lg">
//                 <img
//                   src={WirelessLogo}
//                   alt="Wireless Logo"
//                   className="max-h-full max-w-full object-contain"
//                 />
//               </div>
//             </Link>
//           </div>

//           {/* Center Navigation */}
//           <div className="hidden xl:flex flex-1 justify-center items-center">
//             {navigationItems.map((item) => (
//               <div
//                 key={item.name}
//                 className={`flex items-center ${
//                   item.url === "/contact" ? "ml-6" : "mx-2"
//                 }`}
//               >
//                 {item.hasDropdown ? (
//                   <DropdownMenu modal={false}>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         className="text-white md:text-[18px] bg-transparent hover:text-white hover:bg-blue-800 dark:hover:bg-blue-900 transition-all duration-200"
//                       >
//                         {item.name}
//                         <ChevronDown className="w-4 h-4 ml-1" />
//                       </Button>
//                     </DropdownMenuTrigger>

//                     <DropdownMenuContent
//                       align="start"
//                       className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg z-[60] min-w-[180px]"
//                     >
//                       {item.items.map((subItem) => (
//                         <DropdownMenuItem
//                           key={subItem.name}
//                           onClick={() => handleNavigation(subItem.url)} // ✅ external handled
//                           className="text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer"
//                         >
//                           {subItem.name}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 ) : (
//                   <Button
//                     variant="ghost"
//                     onClick={() => handleNavigation(item.url)} // ✅ unified logic
//                     className="text-white md:text-[18px] bg-transparent hover:text-white hover:bg-blue-800 dark:hover:bg-blue-900 transition-all duration-200 flex items-center"
//                   >
//                     {item.name}
//                   </Button>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Right Police Logo */}
//           <div className="hidden xl:flex items-center justify-center">
//             <div className="w-14 h-18 md:w-16 md:h-20 flex items-center justify-center hover:scale-110 hover:shadow-blue-400/50 transition-transform duration-300 mr-20">
//               <img src={PoliceLogo} alt="Police Logo" className="object-contain" />
//             </div>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <div className="xl:hidden bg-transparent">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="text-white bg-transparent hover:bg-blue-800 dark:hover:bg-blue-900"
//             >
//               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="xl:hidden absolute left-0 right-0 top-full bg-gradient-to-r from-blue-900 to-blue-950 dark:from-gray-900 dark:to-blue-950 border-t border-blue-800 dark:border-blue-900 shadow-xl z-[55] max-h-[calc(100vh-4rem)] overflow-y-auto px-4">
//             <div className="py-4 px-4 bg-transparent">
//               <div className="flex flex-col space-y-2">
//                 {navigationItems.map((item) => (
//                   <div key={item.name} className="py-2 bg-transparent">
//                     <div className="flex items-center justify-between bg-transparent">
//                       {item.hasDropdown ? (
//                         <button
//                           onClick={() => toggleDropdown(item.name)}
//                           className="flex items-center justify-between w-full text-left text-white text-xl font-bold hover:text-blue-200"
//                         >
//                           <span>{item.name}</span>
//                           <ChevronDown
//                             className={`w-4 h-4 transition-transform duration-200 ${
//                               openDropdown === item.name ? "rotate-180" : ""
//                             }`}
//                           />
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleMobileNavigation(item.url)} // ✅ handles external links too
//                           className="text-white text-xl font-bold hover:text-blue-200"
//                         >
//                           {item.name}
//                         </button>
//                       )}
//                     </div>
//                     {item.hasDropdown && openDropdown === item.name && (
//                       <div className="mt-2 pl-4 space-y-1">
//                         {item.items.map((subItem) => (
//                           <button
//                             key={subItem.name}
//                             onClick={() => handleMobileNavigation(subItem.url)} // ✅ unified
//                             className="block w-full text-left py-2 text-blue-200 hover:text-white text-lg"
//                           >
//                             {subItem.name}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {/* Police Logo in mobile */}
//                 <div className="w-full flex bg-white dark:bg-gray-800 rounded-lg items-center justify-center mt-4 p-2 shadow-lg">
//                   <img src={PoliceLogo} className="w-16 h-20" alt="logo" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import AshokStambhLogo from "@/assets/ashok-stambh.png";
import WirelessLogo from "@/assets/wireless.png";
import PoliceLogo from "@/assets/police-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navigationItems = [
    { name: t("nav.home"), url: "/" },
    {
      name: t("nav.about"),
      items: [
        { name: t("nav.directorDesk"), url: "/about/directors-desk" },
        { name: t("nav.formerDirectors"), url: "/about/former-directors" },
        { name: t("nav.hierarchy"), url: "/about/hierarchy" },
        { name: t("nav.aboutDepartment"), url: "/about/department" },
        { name: t("nav.offices"), url: "/about" },
        { name: t("nav.ranks"), url: "/about/ranks" },
      ],
    },
    {
      name: t("nav.citizens"),
      items: [
        { name: t("nav.pressRelease"), url: "/citizen/press-release" },
        { name: t("nav.rti"), url: "/citizen/rti" },
      ],
    },
    {
      name: t("nav.police_corner"),
      items: [
        { name: t("nav.gazette"), url: "/police/gazette" },
        { name: t("nav.flash"), url: "/flashsection" },
        { name: t("nav.officersList"), url: "/police/officers" },
        { name: t("nav.promotionOrders"), url: "/police/promotions" },
        { name: t("nav.transfers"), url: "/police/transfers" },
        { name: t("nav.gradationList"), url: "/police/gradation" },
        { name: t("nav.strategySupport"), url: "https://117.222.38.165/SSS/" },
        { name: t("nav.positiveStories"), url: "/police/stories" },
        { name: t("nav.welfare"), url: "/about/welfare" },
      ],
    },
    {
      name: t("nav.training"),
      items: [
        { name: t("nav.introduction"), url: "/training/introduction" },
        { name: t("nav.trainingCalendar"), url: "/training-calendar" },
        { name: t("nav.library"), url: "/library" },
        {
          name: t("nav.traininggallery"),
          items: [
            { name: t("nav.videos"), url: "/training/traininggallery/videos" },
            { name: t("nav.photos"), url: "/training/traininggallery/photos" },
          ],
        },
        { name: t("nav.notificationCircular"), url: "/training/notification" },
        {
          name: t("nav.museum"),
          items: [
            { name: t("nav.videos"), url: "/training/museum/videos" },
            { name: t("nav.photos"), url: "/training/museum/photos" },
          ],
        },
        { name: t("nav.faculties"), url: "/faculty" },
      ],
    },
    { name: t("nav.tenders"), url: "/tender" },
    { name: t("nav.recruitments"), url: "/recruitments" },
    { name: t("nav.gallery"), url: "/gallery" },
    { name: t("nav.contact"), url: "/contact" },
    { name: t("nav.admin"), url: "/admin" },
  ];

  const handleNavigation = (url: string) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank");
    } else {
      navigate(url);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-full border-b border-blue-900 sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-blue-950 shadow-lg">
      <div className="mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Left Logos */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img src={AshokStambhLogo} className="w-10 h-10 object-contain" alt="Ashok Stambh" />
              </div>
            </Link>
            <Link to="/">
              <div className="w-20 h-16 flex items-center justify-center">
                <img src={PoliceLogo} className="max-h-full" alt="Police Logo" />
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:flex flex-1 justify-center items-center space-x-1">
            {navigationItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredMenu(item.name)}
                onMouseLeave={() => {
                  setHoveredMenu(null);
                  setHoveredSubmenu(null);
                }}
              >
                {/* MAIN NAV ITEM - WHITE BG ON HOVER */}
                <Button
                  variant="ghost"
                  className="text-white text-[15px] hover:bg-white hover:text-blue-900 px-4 py-6 font-medium transition-all duration-200"
                  onClick={() => !item.items && handleNavigation(item.url!)}
                >
                  {item.name}
                  {item.items && <ChevronDown className="w-4 h-4 ml-1" />}
                </Button>

                {/* DROPDOWN - थोड़ा सा gap (2px) ताकि mouse आसानी से जाए */}
                {hoveredMenu === item.name && item.items && (
                  <div className="absolute left-0 top-full mt-[2px] w-64 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-2xl rounded-md">
                    {item.items.map((sub) => (
                      <div
                        key={sub.name}
                        className="relative"
                        onMouseEnter={() => setHoveredSubmenu(sub.name)}
                        onMouseLeave={() => setHoveredSubmenu(null)}
                      >
                        <div
                          className="px-5 py-3 text-gray-800 hover:bg-white hover:text-blue-900 cursor-pointer flex justify-between items-center font-medium transition-all"
                          onClick={() => !sub.items && handleNavigation(sub.url!)}
                        >
                          {sub.name}
                          {sub.items && <ChevronDown className="w-4 h-4" />}
                        </div>

                        {/* SUB DROPDOWN - भी 2px gap */}
                        {hoveredSubmenu === sub.name && sub.items && (
                          <div className="absolute left-full top-0 mt-[2px] ml-[-2px] w-56 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-2xl rounded-md">
                            {sub.items.map((child) => (
                              <div
                                key={child.name}
                                className="px-5 py-3 text-gray-800 hover:bg-white hover:text-blue-900 cursor-pointer font-medium transition-all"
                                onClick={() => handleNavigation(child.url)}
                              >
                                {child.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Logo */}
          <div className="hidden xl:flex items-center">
            <div className="w-14 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg mr-10">
              <img src={WirelessLogo} className="max-h-full" alt="Wireless Logo" />
            </div>
          </div>

          {/* Mobile Button */}
          <div className="xl:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:bg-blue-800">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - unchanged */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-blue-900 border-t border-blue-800">
            <div className="py-3 px-4 text-white">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <button
                    className="w-full flex justify-between text-left text-lg font-medium py-3 hover:bg-white hover:text-blue-900 rounded transition-all"
                    onClick={() => item.items ? setHoveredMenu(hoveredMenu === item.name ? null : item.name) : handleNavigation(item.url!)}
                  >
                    {item.name}
                    {item.items && <ChevronDown className={`w-5 h-5 transition-transform ${hoveredMenu === item.name ? "rotate-180" : ""}`} />}
                  </button>

                  {hoveredMenu === item.name && item.items && (
                    <div className="bg-blue-800">
                      {item.items.map((sub) => (
                        <div key={sub.name}>
                          <button
                            className="w-full flex justify-between text-left py-2.5 pl-8 pr-4 text-blue-100 hover:bg-white hover:text-blue-900 transition-all"
                            onClick={() => sub.items ? setHoveredSubmenu(hoveredSubmenu === sub.name ? null : sub.name) : handleNavigation(sub.url!)}
                          >
                            {sub.name}
                            {sub.items && <ChevronDown className={`w-4 h-4 transition-transform ${hoveredSubmenu === sub.name ? "rotate-180" : ""}`} />}
                          </button>

                          {hoveredSubmenu === sub.name && sub.items && (
                            <div className="bg-blue-700">
                              {sub.items.map((child) => (
                                <button
                                  key={child.name}
                                  onClick={() => handleNavigation(child.url)}
                                  className="block w-full text-left py-2 pl-12 text-blue-200 hover:bg-white hover:text-blue-900"
                                  >
                                  {child.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;