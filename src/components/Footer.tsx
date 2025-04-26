import React from 'react';
// import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Heart } from "lucide-react"
// import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1D1D1D] text-white px-6 py-10 border-t-4 mt-[2rem]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-10">
          <div className="col-span-3">
            <Image src="/images/airStichLogo.png" alt="Stitch Logo" width={100} height={100}  className="h-10 mb-8" />
            <p className="text-lg font-semibold mb-2">Follow us on</p>
            <div className="flex space-x-4">
              <a href="#" className="bg-[#fff] rounded-[0.5rem] p-[0.5rem]" aria-label="Facebook"><Facebook color={"blue"} className="text-xl" /></a>
              <a href="#" className="bg-[#fff] rounded-[0.5rem] p-[0.5rem]" aria-label="Twitter"><Twitter color="black" /></a>
              <a href="#" className="bg-[#fff] rounded-[0.5rem] p-[0.5rem]" aria-label="Instagram"><Instagram color='purple' className="text-xl" /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm col-span-7">
            <div>
              <h4 className="font-semibold mb-8">Main</h4>
              <ul className="space-y-4 font-extralight">
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Categories</a></li>
                <li><a href="#">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-8">Categories</h4>
              <ul className="space-y-4 font-extralight ">
                <li><a href="#">Natives</a></li>
                <li><a href="#">Casuals</a></li>
                <li><a href="#">Corporate</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-8">Account</h4>
              <ul className="space-y-4 font-extralight ">
                <li><a href="#">Profile</a></li>
                <li><a href="#">Orders</a></li>
                <li><a href="#">Measurements</a></li>
                <li><a href="#">Login & Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-8">Business</h4>
              <ul className="space-y-4 font-extralight ">
                <li><a href="#">Create an Acount for Tailors</a></li>
                <li><a href="#">Our policies</a></li>
                <li><a href="#">Complaints</a></li>
                <li><a href="#">Refund</a></li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-600" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-sm">
          <div className="space-y-2">
            <p className="font-semibold">Contact us <span className="font-normal">help@stitch.com &nbsp; +2348010101010</span></p>
          </div>

          <div className="flex items-center w-full lg:w-auto bg-[#fff] rounded-[20px]">
            <input
              type="email"
              placeholder="Subscribe to our newsletter"
              className="px-4 py-2 rounded-l-full w-full lg:w-80 text-black focus:outline-none"
            />
            <button className="bg-white text-black px-4 py-2 rounded-r-full">
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col lg:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2023 Stitch Copyright. All rights reserved</p>
          <div className="flex space-x-4 mt-2 lg:mt-0">
            <a href="#">Private Policy</a>
            <a href="#">Terms of use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;