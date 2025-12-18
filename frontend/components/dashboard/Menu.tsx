// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";

// const menuItems = [
//   { label: "Dashboard", href: "/dashboard" },
//   { label: "Orders", href: "/dashboard/orders" },
//   { label: "Holdings", href: "/dashboard/holdings" },
//   { label: "Positions", href: "/dashboard/positions" },
//   { label: "Funds", href: "/dashboard/funds" },
//   { label: "Apps", href: "/dashboard/apps" },
// ];

// export default function Menu() {
//   const pathname = usePathname();
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

//   return (
//     <aside className="w-64 h-screen border-r bg-white text-black flex flex-col px-4 py-6">
//       {/* Logo */}
//       <div className="mb-8">
//         <Image src="/logo.png" alt="Logo" width={50} height={50} />
//       </div>

//       {/* Menu */}
//       <nav className="flex-1">
//         <ul className="space-y-1">
//           {menuItems.map((item) => {
//             const isActive =
//               pathname === item.href || pathname.startsWith(item.href + "/");

//             return (
//               <li key={item.href}>
//                 <Link
//                   href={item.href}
//                   className={`block rounded-md px-3 py-2 text-sm font-medium transition
//                     ${
//                       isActive
//                         ? "bg-blue-50 text-blue-600"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }`}
//                 >
//                   {item.label}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       <hr className="my-4" />

//       {/* Profile */}
//       <button
//         onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
//         className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition"
//       >
//         <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-white text-sm font-semibold">
//           ZU
//         </div>
//         <span className="text-sm font-medium text-gray-800">USERID</span>
//       </button>

//       {/* Profile Dropdown */}
//       {isProfileDropdownOpen && (
//         <div className="mt-2 rounded-md border bg-white shadow-sm">
//           <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
//             Profile
//           </button>
//           <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
//             Logout
//           </button>
//         </div>
//       )}
//     </aside>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Summary", href: "/dashboard" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Holdings", href: "/dashboard/holdings" },
  { label: "Positions", href: "/dashboard/positions" },
  { label: "Funds", href: "/dashboard/funds" },
  { label: "Apps", href: "/dashboard/apps" },
];

export default function Menu() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-white">
      <div className="hidden md:flex">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition
                ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"  
                }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div className="flex md:hidden gap-6 px-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`py-4 text-sm font-medium border-b-2 transition
                ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
