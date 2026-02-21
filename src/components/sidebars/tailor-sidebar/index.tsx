"use client";

import Image from "next/image";
import Link from "next/link";
// If you use NextAuth on the client, you can uncomment this:
// import { useSession } from "next-auth/react";

type Role = "customer" | "tailor";

type MenuItem = {
  icon: string;
  label: string;
  href: string;
  //   visible: Role[];
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
        href: "/tailor",
      },
       {
        icon: "/Bag.png",
        label: "Orders",
        href: "/Orders",
      },
      {
        icon: "/folder.png",
        label: "Inventory",
        href: "/list/Inventory",
      },
      {
        icon: "/Activity 2.png",
        label: "Analytics",
        href: "/Analytics",
      },
      {
        icon: "/Setting 2.png",
        label: "Account Settings",
        href: "/tailor/account-settings",
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
      },
    ],
  },
];

export default function TailorMenu({
  // Pass this from parent if you have it; otherwise we’ll fall back.
  role: roleProp,
}: {
  role?: Role;
}) {
  // If you’re using NextAuth client-side, you can derive role like this:
  // const { data: session, status } = useSession();
  // const authRole = session?.user?.role as Role | undefined;

  // FINAL effective role with a safe fallback so the menu always renders:
  const role: Role = roleProp /* ?? authRole */ ?? "customer";

  if (process.env.NODE_ENV !== "production") {
    console.log("[Menu] effective role:", role);
  }

  return (
    <div className="text-sm">
      {menuItems.map((section) => {
        const visibleItems = section.items;
        if (visibleItems.length === 0) return null;

        return (
          <div className="flex flex-col" key={section.title}>
            <span className="hidden lg:block text-black font-light my-4" />
            {visibleItems.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className="group flex items-center justify-center lg:justify-start gap-4 rounded-md py-[1.5rem] md:px-2 text-black hover:bg-black hover:text-white transition-colors"
              >
                <Image
                  src={item.icon}
                  alt={`${item.label} icon`}
                  width={20}
                  height={20}
                  className="transition group-hover:invert"
                />
                <span className="hidden lg:block transition-colors group-hover:text-white">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        );
      })}
    </div>
  );
}
