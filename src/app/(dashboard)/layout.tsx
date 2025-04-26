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
      {/* LEFT */}
      <div className="w-[14%] fixed h-full md:w-[8%] lg:w-[20%] xl:w-[20%] p-4 bg-[#eff2f9]">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/images/T-Logo.png" alt="logo" width={150} height={90} />
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] absolute right-0 md:w-[92%] lg:w-[84%] xl:w-[80%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}