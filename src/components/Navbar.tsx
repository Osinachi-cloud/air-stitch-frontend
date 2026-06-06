"use client"
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { User } from "@/types/user";




  // const userDetails = useAppSelector((state) => state.auth.userDetails);

  // useEffect(()=>{
  //   console.log("Navbar userDetails:", userDetails);
  // },[userDetails])

  // return (
  //   <div className='grid grid-cols-4 p-4'>
  //     <div className='hidden md:flex items-center gap-2 text-[24px]  px-2'>
  //       <h1>Overview</h1>
  //     </div>

  //     {/* SEARCH BAR */}
  //     <div className='hidden col-span-2 md:flex items-center gap-2 text-xs rounded-[8px] ring-[1.5px] ring-gray-300 px-2'>
  //       <Image src="/search.png" alt="" width={14} height={14} />
  //       <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
  //     </div>
  //     {/* ICONS AND USER */}
  //     <div className='flex items-center gap-6 justify-end w-full'>
  //       <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
  //         <Image src="/message.png" alt="" width={20} height={20} />
  //       </div>
  //       <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
  //         <Image src="/announcement.png" alt="" width={20} height={20} />
  //         <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs'>1</div>
  //       </div>
  //       <div className='flex flex-col'>
  //         <span className="text-xs leading-3 font-medium">{userDetails?.roles[0] && userDetails.roles[0]?.split("_")[0] + " " + userDetails.roles[0]?.split("_")[1]}</span>
  //         <span className="text-[10px] text-gray-500 text-right">Admin</span>
  //       </div>
  //       <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full" />
  //     </div>
  //   </div>
  // )




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
    pathname?.split("?")[0]?.split("#")[0]?.split("/").filter(Boolean).pop() ?? "";
  if (!seg) return "Overview";
  return seg.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

}

const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const pathname = usePathname();
  const storageKey = pathname?.startsWith("/tailor") ? "tailorDetails" : "customerDetails";
  const { getUserDetails } = useLocalStorage<User>(storageKey as any);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      const stored = getUserDetails();
      setProfileImage(stored?.profileImage ?? null);
    };
    load();
    window.addEventListener("userDetailsUpdated", load);
    return () => window.removeEventListener("userDetailsUpdated", load);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pageTitle = useMemo(() => {
    if (!pathname) return "Overview";
    if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
    const match = Object.keys(ROUTE_TITLES).find((k) =>
      pathname.startsWith(k + "/")
    );
    return match ? ROUTE_TITLES[match] : titleFromPath(pathname);
  }, [pathname]);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* LEFT: Hamburger (mobile) + page title */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
              onClick={onMenuClick}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <h1 className="text-[20px] font-medium text-gray-800">{pageTitle}</h1>
        </div>

        {/* RIGHT: Icons & User */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center cursor-pointer">
            <Image src="/Notification.png" alt="Notifications" width={22} height={22} />
          </div>

          <Image
            src={profileImage || "/images/Michael.png"}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-md object-cover w-8 h-8 min-w-[32px] min-h-[32px]"
            unoptimized={!!profileImage?.startsWith("data:image")}
          />
        </div>
      </div>

      {/* Full-width underline */}
      <div className="border-t border-gray-200 w-full"></div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-6 py-2 bg-white text-gray-500 text-sm">
        <Image
          src="/images/Home-Icon.png"
          alt="Home"
          width={16}
          height={16}
        />
        <span>/</span>
        <span className="text-gray-500">{pageTitle}</span>
      </div>
    </div>
  );
};

export default Navbar;