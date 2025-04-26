import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "0",
    items: [
      {
        icon: "/Vector.png",
        label: "Account Overview",
        href: "/Account-Overview",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/Bag.png",
        label: "Orders",
        href: "/Orders",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/folder.png",
        label: "Inventory",
        href: "/list/Inventory",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/Activity 2.png",
        label: "Analytics",
        href: "/Analytics",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/Setting 2.png",
        label: "Account Settings",
        href: "/list/settings",
        visible: ["admin"],
      },
    ],
  },
  {
    title: "1",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col" key={i.title}>
          <span className="hidden lg:block text-[#000] font-light my-4">
            {/* {i.title} */}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-[#000] border-b border-t-black-50 py-[1.5rem] md:px-2 rounded-md hover:bg-[#000] hover:text-[#fff]"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  {/* <i className= {`${item.icon} `}></i> */}
                  <i className= {`fa fa-user`}></i>
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;