// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

// // Country data with flags and codes
// interface CountryType {
//   name: string;
//   countryCode: string;
//   dialCode: string;
// }

// const AdminSettings: React.FC = () => {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [phoneNumber, setPhoneNumber] = useState("");

//   const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
//     null
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
//       <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-8xl border border-gray-200">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-semibold text-gray-800">
//             Account Settings
//           </h2>
//           <button className="bg-[#373636] text-white px-8 py-2 rounded-md hover:bg-[#2d2d2d] transition-colors">
//             Update
//           </button>
//         </div>

//         {/* Card Content */}
//         <div className="flex flex-wrap md:flex-nowrap gap-8">
//           <div className="flex-1 space-y-5">
//             {/* Full Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg
//                     className="w-5 h-5 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                     />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="OTITOLUWA"
//                   className="w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-[#EFF1F999]"
//                 />
//               </div>
//             </div>

//             {/* Username */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
//                 Username
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg
//                     className="w-5 h-5 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                     />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="CHINAZA"
//                   className="w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-[#EFF1F999]"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
//                 Email
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg
//                     className="w-5 h-5 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </div>
//                 <input
//                   type="email"
//                   placeholder="otittoluwachi@gmail.com"
//                   className="w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-[#EFF1F999]"
//                 />
//               </div>
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
//                 Phone Number
//               </label>

//               <div className="flex items-center space-x-2">
//                 {/* Country Code + Flag (fixed behavior) */}
//                 <div className="flex items-center border border-gray-300 rounded-md bg-[#EFF1F999] px-2 h-[40px]">
//                   <PhoneInput
//                     country={"ng"}
//                     value={""}
//                     onChange={(value: string, country: CountryType) => {
//                       setSelectedCountry(country);
//                       setPhoneNumber(value.replace(/^\+?\d*/, ""));
//                     }}
//                     inputStyle={{
//                       border: "none",
//                       background: "transparent",
//                       width: "75px",
//                       height: "38px",
//                     }}
//                     buttonStyle={{
//                       background: "transparent",
//                       border: "none",
//                     }}
//                     containerStyle={{
//                       width: "95px",
//                     }}
//                     disableCountryCode={true}
//                     disableDropdown={false}
//                     enableSearch={true}
//                   />
//                 </div>

//                 {/* Actual Number Input */}
//                 <input
//                   type="tel"
//                   value={phoneNumber}
//                   onChange={(e) =>
//                     setPhoneNumber(e.target.value.replace(/\D/g, ""))
//                   }
//                   placeholder="Enter phone number"
//                   className="w-72 rounded-md border border-gray-300 bg-[#EFF1F999] px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                   style={{
//                     height: "40px",
//                     border: "1px solid #D1D5DB",
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Address */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
//                 Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg
//                     className="w-5 h-5 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="No. 93 Skyfield Apartments"
//                   className="w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-[#EFF1F999]"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
//                 City
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg
//                     className="w-5 h-5 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Yaba"
//                   className="w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-[#EFF1F999]"
//                 />
//               </div>
//             </div>
//             {/* Country & State */}
//             <div className="flex gap-2">
//               {/* Country */}
//               <div className="flex-none">
//                 <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
//                   Country
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg
//                       className="w-5 h-5 text-gray-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                       />
//                     </svg>
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Nigeria"
//                     className="w-[200px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-[#EFF1F999]"
//                   />
//                 </div>
//               </div>

//               {/* State */}
//               <div className="flex-none">
//                 <label className="block text-sm font-medium text-gray-600 mb-1 px-3 py-1.5 rounded-t-md w-full">
//                   State
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg
//                       className="w-5 h-5 text-gray-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                       />
//                     </svg>
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Lagos"
//                     className="w-[200px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-[#EFF1F999]"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right: Profile Image */}
//           <div className="flex flex-col items-center justify-start">
//             <div className="relative">
//               <div className="relative w-40 h-40">
//                 <img
//                   src={selectedImage || "/images/Men.png"}
//                   alt="Profile"
//                   width={160}
//                   height={160}
//                   className="w-full h-full rounded-full object-cover border-4 border-gray-200"
//                 />

//                 {/* Upload Button - Embedded on the border using your custom icon */}
//                 <label
//                   htmlFor="profile-upload"
//                   className="absolute -bottom-1 -right-1 w-10 h-10 cursor-pointer bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors"
//                 >
//                   {/* Your custom upload icon */}
//                   <img
//                     src="/icons/fi_upload-cloud.png"
//                     alt="Upload"
//                     width={20}
//                     height={20}
//                     className="object-contain"
//                   />

//                   <input
//                     id="profile-upload"
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (file) {
//                         const reader = new FileReader();
//                         reader.onload = () => {
//                           if (typeof reader.result === "string") {
//                             setSelectedImage(reader.result);
//                           }
//                         };
//                         reader.readAsDataURL(file);
//                       }
//                     }}
//                   />
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSettings;
