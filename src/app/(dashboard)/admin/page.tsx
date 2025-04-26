"use client"


import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import { TransactionTable } from "@/components/TransactionTable";
import UserCard from "@/components/UserCard";
import Image from "next/image";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="grid md:grid-cols-5 gap-4">
          <UserCard country="Total" customerCount={120000} />
          <UserCard country="Nigeria" customerCount={12} />
          <UserCard country="Canada" customerCount={1000} />
          <UserCard country="China" customerCount={2000} />
          <UserCard country="UK" customerCount={3000} />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          {/* <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div> */}
          {/* ATTENDANCE CHART */}
          {/* <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div> */}
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[350px] grid md:grid-cols-5 gap-[2rem]">
          <div className="col-span-2 px-[2rem] py-[2rem] h-fit bg-[#fff] rounded-[8px]">
            <div className="flex justify-between">
              <div className="flex items-center">
                <Image src="/trans-icon.png" height={10} width={30} alt="Transaction Icon" />
                <p>Total Transaction</p>
              </div>
              <div>
                <select className="bg-[#F6F8FF]" name="" id="">
                  <option value="">Month</option>
                  <option value="">Year</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between mt-[3rem]">
              <h1 className="text-[40px] font-bold">N5,000,000</h1>
              <Image src="/trans-icon.png" height={50} width={150} alt="Transaction Icon" />
            </div>
          </div>
          <div className="col-span-3">
            <FinanceChart />
          </div>
        </div>
        <div>
          <TransactionTable />
        </div>

      </div>
      {/* RIGHT */}
      {/* <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements/>
      </div> */}
    </div>
  );
};

export default AdminPage;