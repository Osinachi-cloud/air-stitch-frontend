"use client";

import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

/** Route -> Title map */
const ROUTE_TITLES: Record<string, string> = {
  "/": "Overview",
  "/Account-Overview": "Account Overview",
  "/Orders": "Orders",
  "/Pending-Reviews": "Pending Reviews",
  "/Liked-Items": "Liked Items",
  "/Cart": "Cart",
  "/Measurements": "Measurement",
  "/Account-Settings": "Account Settings",
  "/list/Inventory": "Inventory",
  "/list/settings": "Account Settings",
};

/** Fallback: prettify last URL segment */
function titleFromPath(pathname: string) {
  const seg =
    pathname.split("?")[0].split("#")[0].split("/").filter(Boolean).pop() ?? "";
  if (!seg) return "Overview";
  return seg.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

const Navbar = () => {
  const userDetails = useAppSelector((state) => state.authReducer.value);
  const pathname = usePathname();

  useEffect(() => {
    console.log(userDetails);
  }, [userDetails]);

  const pageTitle = useMemo(() => {
    if (!pathname) return "Overview";
    if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
    const match = Object.keys(ROUTE_TITLES).find((k) =>
      pathname.startsWith(k + "/")
    );
    return match ? ROUTE_TITLES[match] : titleFromPath(pathname);
  }, [pathname]);

  return (
    <div className="w-full">
      {/* Top Navbar */}
      <div className="grid grid-cols-4 p-4 items-center">
        {/* LEFT: Dynamic page title */}
        <div className="hidden md:flex items-center gap-2 text-[24px] px-2">
          <h1>{pageTitle}</h1>
        </div>

        {/* RIGHT: Icons & User */}
        <div className="flex items-center gap-6 justify-end w-full col-span-3">
          <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer border border-gray-200 hover:bg-gray-100">
            <Image src="/Notification.png" alt="" width={20} height={20} />
          </div>

          <Image
            src="/images/Michael.png"
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-md"
          />
        </div>
      </div>

      {/* Full-width underline */}
      <div className="border-t border-gray-200 w-full"></div>

      {/* Path display section */}
      <div className="flex items-center gap-2 px-6 py-2 bg-white text-gray-600 text-sm">
        <Image
            src="/images/Home-Icon.png"
            alt="Home"
            width={20}
            height={20}
            className="rounded-md"
          />
        <span className="text-gray-500">/</span>
        <span className="text-blue-600 font-medium">{pageTitle}</span>
      </div>
    </div>
  );
};

export default Navbar;
