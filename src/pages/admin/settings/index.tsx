"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { baseUrL } from '@/env/URLs';
import { User } from '@/types/user';
import { useRouter } from "next/navigation";

interface CountryType {
  name: string;
  countryCode: string;
  dialCode: string;
}

interface CustomerData {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  country?: string;
  profileImage?: string | null;
  address?: string;
  city?: string;
  state?: string;
}

const AdminSettings: React.FC = () => {
  const router = useRouter();
  const { getUserDetails, setValue } = useLocalStorage<User>('userDetails');
  
  // State
  const [customer, setCustomer] = useState<CustomerData>({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    country: "",
    address: "",
    city: "",
    state: "",
    profileImage: null,
  });
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Refs for all inputs
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  
  // Track if data has been loaded
  const dataLoadedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Load customer data - ONLY ONCE
  useEffect(() => {
    isMountedRef.current = true;
    
    const loadCustomerData = async () => {
      // Prevent double loading
      if (dataLoadedRef.current) {
        console.log("Data already loaded, skipping...");
        return;
      }

      try {
        const stored = getUserDetails();
        console.log("Loading customer data...");
        
        const email = stored?.emailAddress;
        const token = stored?.accessToken;

        if (!email) {
          if (isMountedRef.current) {
            setMessage({ text: "No email found. Please login again.", type: 'error' });
          }
          return;
        }

        const url = `${baseUrL}/customer-details?emailAddress=${encodeURIComponent(email)}`;
        
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        
        if (res.ok && isMountedRef.current) {
          const data = await res.json();
          console.log("Customer data loaded successfully");
          
          // Mark as loaded
          dataLoadedRef.current = true;
          
          // Update state
          setCustomer({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            emailAddress: data.emailAddress || "",
            phoneNumber: data.phoneNumber || "",
            country: data.country || "",
            address: data.address || "No. 93 Skyfield Apartments",
            city: data.city || "Yaba",
            state: data.state || "Lagos",
            profileImage: data.profileImage || null,
          });
          
          // Update ref values (for uncontrolled inputs)
          if (firstNameRef.current) firstNameRef.current.value = data.firstName || "";
          if (lastNameRef.current) lastNameRef.current.value = data.lastName || "";
          if (emailRef.current) emailRef.current.value = data.emailAddress || "";
          if (addressRef.current) addressRef.current.value = data.address || "No. 93 Skyfield Apartments";
          if (cityRef.current) cityRef.current.value = data.city || "Yaba";
          if (stateRef.current) stateRef.current.value = data.state || "Lagos";
          if (countryRef.current) countryRef.current.value = data.country || "";
          
          if (data.phoneNumber) {
            setPhoneNumber(data.phoneNumber);
          }
          
          if (data.profileImage) {
            setSelectedImage(data.profileImage);
          }
        }
      } catch (err) {
        console.error("Failed to load customer data", err);
        if (isMountedRef.current) {
          setMessage({ 
            text: err instanceof Error ? err.message : "Failed to load customer data", 
            type: 'error' 
          });
        }
      }
    };

    loadCustomerData();

    // Cleanup
    return () => {
      isMountedRef.current = false;
    };
  }, []); // Empty dependency array - only runs once

  // Show message helper
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Dispatch update event
  const dispatchUpdateEvent = (updatedData: any) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('userDetailsUpdated', { 
        detail: updatedData 
      }));
    }
  };

  // Collect form values from refs
  const collectFormValues = () => {
    return {
      firstName: firstNameRef.current?.value || '',
      lastName: lastNameRef.current?.value || '',
      emailAddress: emailRef.current?.value || '',
      phoneNumber: phoneNumber,
      country: countryRef.current?.value || '',
      address: addressRef.current?.value || '',
      city: cityRef.current?.value || '',
      state: stateRef.current?.value || '',
      profileImage: selectedImage || null,
    };
  };

  // Handle update
  const handleUpdate = async () => {
    setLoading(true);
    
    try {
      const stored = getUserDetails();
      const token = stored?.accessToken;
      const email = emailRef.current?.value || stored?.emailAddress;

      if (!email) {
        showMessage("No email found", 'error');
        return;
      }

      const updateData = collectFormValues();
      console.log("Sending update data:", updateData);

      const url = `${baseUrL}/update-customer?emailAddress=${encodeURIComponent(email)}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Update failed: ${res.status} - ${errorText}`);
      }

      const updated = await res.json();
      console.log("Update successful:", updated);
      
      // Update localStorage
      const currentStored = getUserDetails();
      const updatedUser = {
        ...currentStored,
        ...updated,
        accessToken: currentStored?.accessToken,
        refreshToken: currentStored?.refreshToken,
      };
      
      setValue(updatedUser as User);
      dispatchUpdateEvent(updated);
      
      showMessage("Profile updated successfully!", 'success');
      
      setTimeout(() => {
        router.push("/Account-Overview");
      }, 1500);
      
    } catch (err) {
      console.error("Update error:", err);
      showMessage(err instanceof Error ? err.message : "Update failed. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image size should be less than 5MB", 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showMessage("Please upload an image file", 'error');
      return;
    }

    setImageUploading(true);
    
    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const stored = getUserDetails();
      const token = stored?.accessToken;
      const email = emailRef.current?.value || stored?.emailAddress;

      if (!email) {
        showMessage("No email found", 'error');
        return;
      }

      const url = `${baseUrL}/update-customer-profile-image?emailAddress=${encodeURIComponent(email)}&profileImage=${encodeURIComponent(imageData)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        throw new Error(`Image upload failed: ${res.status}`);
      }

      const data = await res.json();
      
      setSelectedImage(imageData);
      setCustomer(prev => ({ ...prev, profileImage: imageData }));
      
      const currentStored = getUserDetails();
      const updatedUser = {
        ...currentStored,
        profileImage: imageData,
        ...data,
      };
      
      setValue(updatedUser as User);
      dispatchUpdateEvent({ profileImage: imageData, ...data });
      
      showMessage("Profile image updated successfully!", 'success');
    } catch (err) {
      console.error("Failed to upload image", err);
      showMessage("Image upload failed. Please try again.", 'error');
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-8xl border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">
              Account Settings
            </h2>
            <p className="text-gray-600 mt-1">Update your profile information</p>
          </div>
          
          <div className="flex items-center gap-4">
            {message && (
              <div className={`px-4 py-2 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}
            
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-[#373636] text-white px-8 py-2 rounded-md hover:bg-[#2d2d2d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="flex flex-wrap md:flex-nowrap gap-8">
          <div className="flex-1 space-y-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  ref={firstNameRef}
                  type="text"
                  placeholder="Enter first name"
                  defaultValue={customer.firstName || ""}
                  className="w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  ref={lastNameRef}
                  type="text"
                  placeholder="Enter last name"
                  defaultValue={customer.lastName || ""}
                  className="w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Enter email address"
                  defaultValue={customer.emailAddress || ""}
                  className="w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
                Phone Number
              </label>

              <div className="flex items-center space-x-2">
                <div className="flex items-center border border-gray-300 rounded-md bg-[#EFF1F999] px-2 h-[40px]">
                  <PhoneInput
                    country={"ng"}
                    value={phoneNumber ? `+234${phoneNumber}` : ""}
                    onChange={(value: string, country: CountryType) => {
                      setSelectedCountry(country);
                      const cleaned = value.replace(/\D/g, "").replace("234", "");
                      setPhoneNumber(cleaned);
                    }}
                    inputStyle={{
                      border: "none",
                      background: "transparent",
                      width: "75px",
                      height: "38px",
                    }}
                    buttonStyle={{
                      background: "transparent",
                      border: "none",
                    }}
                    containerStyle={{
                      width: "95px",
                    }}
                    disableCountryCode={true}
                    disableDropdown={false}
                    enableSearch={true}
                  />
                </div>

                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter phone number"
                  className="w-72 rounded-md border border-gray-300 bg-[#EFF1F999] px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  ref={addressRef}
                  type="text"
                  placeholder="No. 93 Skyfield Apartments"
                  defaultValue={customer.address || ""}
                  className="w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
                />
              </div>
            </div>
            
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
                City
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  ref={cityRef}
                  type="text"
                  placeholder="Yaba"
                  defaultValue={customer.city || ""}
                  className="w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
                />
              </div>
            </div>
            
            {/* Country & State */}
            <div className="flex gap-2">
              {/* Country */}
              <div className="flex-none">
                <label className="block text-sm font-medium text-gray-600 mb-1 py-1.5 rounded-t-md w-full">
                  Country
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </div>
                  <input
                    ref={countryRef}
                    type="text"
                    placeholder="Nigeria"
                    defaultValue={customer.country || ""}
                    className="w-[200px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
                  />
                </div>
              </div>

              {/* State */}
              <div className="flex-none">
                <label className="block text-sm font-medium text-gray-600 mb-1 px-3 py-1.5 rounded-t-md w-full">
                  State
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </div>
                  <input
                    ref={stateRef}
                    type="text"
                    placeholder="Lagos"
                    defaultValue={customer.state || ""}
                    className="w-[200px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Profile Image */}
          <div className="flex flex-col items-center justify-start">
            <div className="relative">
              <div className="relative w-40 h-40">
                <Image
                  src={selectedImage || "/images/Men.png"}
                  alt="Profile"
                  width={160}
                  height={160}
                  className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                  unoptimized={selectedImage?.startsWith('data:image')}
                />

                {/* Upload Button */}
                <label
                  htmlFor="profile-upload"
                  className={`absolute -bottom-1 -right-1 w-10 h-10 cursor-pointer bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors ${
                    imageUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {imageUploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                  ) : (
                    <Image
                      src="/icons/fi_upload-cloud.png"
                      alt="Upload"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  )}

                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                </label>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 text-center mt-4">
              Click the upload icon to change profile picture
              <br />
              Max size: 5MB
            </p>
            
            <button
              type="button"
              onClick={() => router.push("/admin/account-overview")}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Account Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;