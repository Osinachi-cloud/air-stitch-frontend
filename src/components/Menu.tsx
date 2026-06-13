"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// If you use NextAuth on the client, you can uncomment this:
// import { useSession } from "next-auth/react";

type Role = "customer" | "tailor";

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
        visible: ["customer", "tailor"],
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
        visible: ["tailor"],
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
        href: "/Analytics",
        visible: ["tailor"],
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

export default function Menu({
  // Pass this from parent if you have it; otherwise we'll fall back.
  role: roleProp,
}: {
  role?: Role;
}) {
  const pathname = usePathname();

  // If you're using NextAuth client-side, you can derive role like this:
  // const { data: session, status } = useSession();
  // const authRole = session?.user?.role as Role | undefined;

  // FINAL effective role with a safe fallback so the menu always renders:
  const role: Role = roleProp /* ?? authRole */ ?? "customer";

  if (process.env.NODE_ENV !== "production") {
    console.log("[Menu] effective role:", role);
  }

  const roleHrefOverrides: Partial<Record<string, Record<Role, string>>> = {
    "Account Overview": { customer: "/Account-Overview", tailor: "/tailor" },
    "Account Settings": { customer: "/list/settings", tailor: "/tailor/account-settings" },
    "Vendors Orders":   { customer: "/vendors-order",   tailor: "/tailor/vendors-order" },
    "Inventory":        { customer: "/list/Inventory",  tailor: "/tailor/inventory" },
    "Analytics":        { customer: "/Analytics",       tailor: "/tailor/analytics" },
    "Orders":           { customer: "/orders",          tailor: "/tailor/orders" },
    "Liked Items":      { customer: "/like",            tailor: "/tailor/like" },
    "Cart":             { customer: "/cart",            tailor: "/tailor/cart" },
    "Measurements":     { customer: "/Measurements",    tailor: "/tailor/measurements" },
  };

  const mainItems = (menuItems[0]?.items ?? []).filter(item => item.visible.includes(role));
  const logoutItem = menuItems[1]?.items[0];

  return (
    <div className="text-sm flex flex-col flex-1 overflow-y-auto">
      {/* Main nav items */}
      <div className="flex flex-col mt-14">
        {mainItems.map((item) => {
          const href = roleHrefOverrides[item.label]?.[role] ?? item.href;
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              href={href}
              key={item.label}
              className={`group flex items-center justify-center lg:justify-start gap-4 py-4 md:px-2 rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-[#000] text-[#fff]'
                  : 'text-[#000] hover:bg-gray-800 hover:text-[#fff]'
              }`}
            >
              <Image src={item.icon} alt="" width={20} height={20} className={isActive ? 'invert' : 'group-hover:invert'} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout pinned to bottom */}
      {logoutItem && (
        <div className="mt-auto mb-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="group flex items-center justify-center lg:justify-start gap-4 text-[#000] py-4 md:px-2 rounded-md hover:bg-[#000] hover:text-[#fff] w-full"
          >
            <Image src={logoutItem.icon} alt="" width={20} height={20} className="group-hover:invert" />
            <span className="hidden lg:block">{logoutItem.label}</span>
          </button>
        </div>
      )}
    </div>
  );
}
