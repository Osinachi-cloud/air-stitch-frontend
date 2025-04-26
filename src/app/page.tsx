import { Header } from "@/components/Header/Header";

import Image from "next/image";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { HomePage } from "./homePage/HomePage";

export default function Home() {

  // useEffect(() => {
  //   toast("Page loaded successfully!");
  // }, []);


  return (
    <main className="">
    <HomePage/>
      {/* <ToastContainer /> */}

    </main>
  );
}
