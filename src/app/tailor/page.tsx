"use client"; 

import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
     const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      {/* Card container */}
      <div className="w-full max-w-7xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Account Overview
        </h1>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[190px_1fr_1fr]">
          {/* Left: Profile Image */}
          <div className="flex items-start justify-center md:justify-start">
            <img
              src="/images/Men.png"
              alt="Profile"
              width={160}
              height={160}
              className="h-40 w-40 rounded-full object-cover border-4 border-gray-200"
            />
          </div>

          {/* Middle: Contact Info + Address */}
          <div className="space-y-8">
            {/* Contact Information */}
            <section>
              <h2 className="text-base font-semibold text-gray-900">
                Personal Information
              </h2>
              <div className="mt-2 text-sm text-gray-700 leading-6">
                <div>Chidera John</div>
                <div>otitoluwachi@gmail.com</div>
                <div>08066550633</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => router.push("/list/settings")}
                  className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50"
                >
                  Edit
                </button>
                <button className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50">
                  Change Password
                </button>
              </div>
            </section>

            {/* Address Book */}
            <section>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">
                  Business Information
                </h2>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Johnny fashion World
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  johnnyfashionworld@gmail.com
                </p>
                <button className="mt-2 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50">
                  Edit Address
                </button>
              </div>
            </section>
          </div>

          {/* Right: Newsletters + Shipping */}
          <div className="space-y-8">
            {/* Newsletters */}
            <section>
              <h2 className="text-base font-semibold text-gray-900">
                Newsletters
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                You don&apos;t subscribe to our newsletter.
              </p>
              <button className="mt-3 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50">
                Edit
              </button>
            </section>

            {/* Default Shipping */}
            <section>
              <h2 className="text-base font-semibold text-gray-900">
                Business Address
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                No. 93 Skyfield Apartments, Yaba, Lagos.
              </p>
              <button className="mt-3 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50">
                Edit Address
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );};

export default page;
