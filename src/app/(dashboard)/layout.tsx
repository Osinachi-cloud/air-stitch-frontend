import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT SIDEBAR */}
      <div className="w-[14%] fixed h-full md:w-[8%] lg:w-[20%] xl:w-[20%] p-4 bg-[#eff2f9]">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/images/T-Logo.png" alt="logo" width={150} height={90} />
        </Link>
        <Menu />
      </div>
      
      {/* RIGHT CONTENT AREA */}
      <div className="w-[86%] absolute right-0 md:w-[92%] lg:w-[84%] xl:w-[80%] bg-[#eff2f9] flex flex-col">
        {/* FIXED NAVBAR */}
        <div className="fixed top-0 right-0 w-[86%] md:w-[92%] lg:w-[84%] xl:w-[80%] z-10 bg-[#eff2f9]">
          <Navbar />
        </div>
        
        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 mt-16 overflow-auto"> {/* mt-16 accounts for navbar height */}
          {children}
        </div>
      </div>
    </div>
  );
}
