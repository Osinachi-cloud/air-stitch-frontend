"use client"
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { User } from "@/types/user";

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

type Notification = {
  id: number;
  message: string;
  time: string;
  read: boolean;
};

// Sample notifications — replace with real API data as needed
const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: 1, message: "Your order #1234 has been confirmed.", time: "2 mins ago", read: false },
  { id: 2, message: "Payment of ₦25,000 was successful.", time: "1 hour ago", read: false },
  { id: 3, message: "Your item is ready for pickup.", time: "3 hours ago", read: true },
];

const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const pathname = usePathname();
  const storageKey = pathname?.startsWith("/tailor") ? "tailorDetails" : "customerDetails";
  const { getUserDetails } = useLocalStorage<User>(storageKey as any);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Notification state
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

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

        {/* RIGHT: Notification Bell & User */}
        <div className="flex items-center gap-4">

          {/* Notification Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotificationOpen((prev) => !prev)}
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Image src="/Notification.png" alt="Notifications" width={22} height={22} />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center bg-red-500 text-white rounded-full text-[9px] font-bold leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Panel */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !n.read ? "bg-blue-50/60" : "bg-white"
                        }`}
                      >
                        {/* Unread dot */}
                        <div className="mt-1.5 flex-shrink-0">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              !n.read ? "bg-blue-500" : "bg-gray-200"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-4 py-2.5 text-center">
                  <span className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
                    View all notifications
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
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
