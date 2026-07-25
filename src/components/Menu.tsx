"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// If you use NextAuth on the client, you can uncomment this:
// import { useSession } from "next-auth/react";

type Role = "customer" | "tailor" | "vendor";

type MenuItem = {
  icon: string;
  label: string;
  href: string;
  visible: Role[];
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const menuItems: MenuSection[] = [
  {
    title: "0",
    items: [
      {
        icon: "/Vector.png",
        label: "Account Overview",
        href: "/Account-Overview",
        visible: ["customer", "tailor", "vendor"],
      },
      {
        icon: "/Bag.png",
        label: "Orders",
        href: "/orders",
        visible: ["customer"],
      },
      {
        icon: "/Bag.png",
        label: "Vendors Orders",
        href: "/vendors-order",
        visible: ["tailor", "vendor"],
      },
      {
        icon: "/Heart.png",
        label: "Liked Items",
        href: "/like",
        visible: ["customer"],
      },
      {
        icon: "/productCart.png",
        label: "Cart",
        href: "/cart",
        visible: ["customer"],
      },
      {
        icon: "/folder.png",
        label: "Inventory",
        href: "/list/Inventory",
        visible: ["tailor"],
      },
      {
        icon: "/Activity 2.png",
        label: "Analytics",
        href: "/analytics",
        visible: ["tailor", "vendor"],
      },
      {
        icon: "/Activity 2.png",
        label: "Measurements",
        href: "/Measurements",
        visible: ["customer"],
      },
      {
        icon: "/Setting 2.png",
        label: "Account Settings",
        href: "/list/settings",
        visible: ["customer", "tailor"],
      },
    ],
  },
  {
    title: "1",
    items: [
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["customer", "tailor"],
      },
    ],
  },
];

function getRoleFromStorage(): Role {
  if (typeof window === "undefined") return "customer";

  const keys = ["tailorDetails", "customerDetails", "userDetails"];
  for (const key of keys) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      const data = JSON.parse(raw);
      const roleVal =
        data?.role ||
        data?.roleDto?.name ||
        data?.data?.role ||
        data?.data?.roleDto?.name;
      if (typeof roleVal === "string") {
        const normalized = roleVal.toUpperCase().replace("ROLE_", "");
        if (normalized === "VENDOR" || normalized === "TAILOR") return "tailor";
        if (normalized === "CUSTOMER") return "customer";
      }
    } catch {
      /* ignore parse errors */
    }
  }
  return "customer";
}

export default function Menu({
  // Pass this from parent if you have it; otherwise we'll read from localStorage.
  role: roleProp,
}: {
  role?: Role;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If you're using NextAuth client-side, you can derive role like this:
  // const { data: session, status } = useSession();
  // const authRole = session?.user?.role as Role | undefined;

  // Use prop if provided, otherwise read from localStorage after mount
  const role: Role = roleProp ?? (mounted ? getRoleFromStorage() : "customer");

  if (process.env.NODE_ENV !== "production") {
    console.log("[Menu] effective role:", role);
  }

  const roleHrefOverrides: Partial<Record<string, Record<Role, string>>> = {
    "Account Overview": { customer: "/Account-Overview", tailor: "/Account-Overview",  vendor: "/tailor" },
    "Account Settings": { customer: "/list/settings", tailor: "/list/settings", vendor: "/tailor/account-settings" },
    "Vendors Orders":   { customer: "/vendors-order",   tailor: "/vendors-order", vendor: "/tailor/vendors-order" },
    "Inventory":        { customer: "/inventory",  tailor: "/inventory", vendor: "/inventory" },
    "Analytics":        { customer: "/analytics",       tailor: "/analytics", vendor: "/analytics" },
    "Orders":           { customer: "/orders",          tailor: "/orders", vendor: "/tailor/orders" },
    "Liked Items":      { customer: "/like",            tailor: "/like", vendor: "/tailor/like" },
    "Cart":             { customer: "/cart",            tailor: "/cart", vendor: "/tailor/cart" },
    "Measurements":     { customer: "/Measurements",    tailor: "/measurements", vendor: "/tailor/measurements" },
  };

  const mainItems = (menuItems[0]?.items ?? []).filter(item => item.visible.includes(role));
  const logoutItem = menuItems[1]?.items[0];

  return (
    <div className="text-sm flex flex-col flex-1 overflow-y-auto">
      {/* Main nav items */}
      <div className="flex flex-col mt-10 gap-1.5">
        {mainItems.map((item) => {
          const href = roleHrefOverrides[item.label]?.[role] ?? item.href;
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              href={href}
              key={item.label}
              className={`group flex items-center justify-center lg:justify-start gap-3 py-2.5 px-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-md'
                  : 'text-gray-800 hover:bg-gray-200 hover:text-black'
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-md ${isActive ? 'bg-white/15' : 'bg-transparent group-hover:bg-gray-300'} transition-colors`}>
                <Image src={item.icon} alt="" width={18} height={18} className={isActive ? 'brightness-0 invert' : ''} />
              </div>
              <span className="hidden lg:block text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout pinned to bottom */}
      {logoutItem && (
        <div className="mt-auto mb-4 pt-3 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="group flex items-center justify-center lg:justify-start gap-3 text-gray-800 py-2.5 px-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 w-full transition-all duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md group-hover:bg-red-100 transition-colors">
              <Image src={logoutItem.icon} alt="" width={18} height={18} />
            </div>
            <span className="hidden lg:block text-sm font-medium">{logoutItem.label}</span>
          </button>
        </div>
      )}
    </div>
  );
}
