"use client"
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";




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
    pathname.split("?")[0].split("#")[0].split("/").filter(Boolean).pop() ?? "";
  if (!seg) return "Overview";
  return seg.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

}

const Navbar = () => {
  const userDetails = useAppSelector((state) => state.auth.userDetails);
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
