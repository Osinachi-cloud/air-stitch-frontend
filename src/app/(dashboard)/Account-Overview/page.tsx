"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { baseUrL } from '@/env/URLs';
import { User } from '@/types/user';

interface CustomerOverview {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  profileImage?: string | null;
  country?: string;
}

export default function AccountOverviewPage() {
  const router = useRouter();
  const { getUserDetails } = useLocalStorage<User>('userDetails');
  const [customer, setCustomer] = useState<CustomerOverview>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stored = getUserDetails();
      console.log("Stored user details:", stored);
      
      const email = stored?.emailAddress;
      const token = stored?.accessToken;

      if (!email) {
        throw new Error('No email found in localStorage. Please login again.');
      }

      const url = `${baseUrL}/customer-details?emailAddress=${encodeURIComponent(email)}`;
      console.log("Fetching from URL:", url);
      
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: 'no-cache'
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch customer details: ${res.status}`);
      }

      const data = await res.json();
      console.log("Received customer data:", data);
      
      setCustomer({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.emailAddress,
        phoneNumber: data.phoneNumber,
        profileImage: data.profileImage,
        country: data.country,
      });
    } catch (err) {
      console.error('Failed to load customer details', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();

    // Listen for updates from settings page
    const handleUserDetailsUpdated = () => {
      console.log("User details updated event received");
      fetchCustomerData();
    };

    window.addEventListener('userDetailsUpdated', handleUserDetailsUpdated);
    
    return () => {
      window.removeEventListener('userDetailsUpdated', handleUserDetailsUpdated);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => fetchCustomerData()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '—';
  const email = customer.emailAddress || '—';
  const phone = customer.phoneNumber ? `+234 ${customer.phoneNumber}` : '—';
  const address = customer.country 
    ? `No. 93 Skyfield Apartments, Yaba, ${customer.country}`
    : 'No. 93 Skyfield Apartments, Yaba, Lagos';

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-7xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Account Overview
        </h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[190px_1fr_1fr]">
          {/* Left: Profile Image */}
          <div className="flex items-start justify-center md:justify-start">
            <Image
              src={customer.profileImage || "/images/Men.png"}
              alt="Profile"
              width={160}
              height={160}
              className="h-40 w-40 rounded-full object-cover border-4 border-gray-200"
              unoptimized={customer.profileImage?.startsWith('data:image')}
            />
          </div>

          {/* Middle: Contact Info + Address */}
          <div className="space-y-8">
            {/* Contact Information */}
            <section>
              <h2 className="text-base font-semibold text-gray-900">
                Contact Information
              </h2>
              <div className="mt-2 text-sm text-gray-700 leading-6">
                <div className="font-medium">{fullName}</div>
                <div className="text-gray-600">{email}</div>
                <div className="text-gray-600">{phone}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => router.push("/list/settings")}
                  className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Edit Profile
                </button>
                <button className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
              </div>
            </section>

            {/* Address Book */}
            <section>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">
                  Address Book
                </h2>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Default Billing Address
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {address}
                </p>
                <button className="mt-2 inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors">
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
              <button className="mt-3 inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors">
                Edit
              </button>
            </section>

            {/* Default Shipping */}
            <section>
              <h2 className="text-base font-semibold text-gray-900">
                Default Shipping Address
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                You have not set a default shipping address.
              </p>
              <button className="mt-3 inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors">
                Edit Address
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}