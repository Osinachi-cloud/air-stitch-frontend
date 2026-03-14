"use client"
import Navbar from "@/components/navbar/Navbar";
// import Navbar from "@/components/Navbar";
import { HomePage } from "./homePage/HomePage";

export default function Home() {

  return (
    <main className="">
      <Navbar />
    <HomePage/>
      {/* <ToastContainer /> */}

    </main>
  );
}
