"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { baseUrL } from "@/env/URLs";
import { User } from "@/types/user";
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
  const { getUserDetails, setValue } = useLocalStorage<User>("customerDetails");

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
    profileImage: null
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

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
      if (dataLoadedRef.current) {
        return;
      }

      try {
        const stored = getUserDetails();
        const email = stored?.emailAddress;
        const token = stored?.accessToken;

        if (!email) {
          if (isMountedRef.current) {
            setMessage({
              text: "No email found. Please login again.",
              type: "error"
            });
          }
          return;
        }

        const url = `${baseUrL}/customer-details?emailAddress=${encodeURIComponent(email)}`;

        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });

        if (res.ok && isMountedRef.current) {
          const data = await res.json();
          dataLoadedRef.current = true;

          setCustomer({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            emailAddress: data.emailAddress || "",
            phoneNumber: data.phoneNumber || "",
            country: data.country || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            profileImage: data.profileImage || null
          });

          if (firstNameRef.current)
            firstNameRef.current.value = data.firstName || "";
          if (lastNameRef.current)
            lastNameRef.current.value = data.lastName || "";
          if (emailRef.current)
            emailRef.current.value = data.emailAddress || "";
          if (countryRef.current) countryRef.current.value = data.country || "";

          if (data.phoneNumber) {
            setPhoneNumber(data.phoneNumber);
          }

          if (data.profileImage) {
            setSelectedImage(data.profileImage);
          }

          loadAddressData(token);
        }
      } catch (err) {
        console.error("Failed to load customer data", err);
        if (isMountedRef.current) {
          setMessage({
            text:
              err instanceof Error
                ? err.message
                : "Failed to load customer data",
            type: "error"
          });
        }
      }
    };

    loadCustomerData();

    // Cleanup
    return () => {
      isMountedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load address data from dedicated endpoint
  const loadAddressData = async (token: string | undefined) => {
    if (!token) return;
    try {
      const res = await fetch(`${baseUrL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok && isMountedRef.current) {
        const data = await res.json();
        const addressItem = Array.isArray(data) ? data[0] : data;
        if (addressItem) {
          if (addressRef.current)
            addressRef.current.value = addressItem.fullAddress || "";
          if (cityRef.current) cityRef.current.value = addressItem.city || "";
          if (stateRef.current)
            stateRef.current.value = addressItem.state || "";
        }
      }
    } catch (err) {
      console.error("Failed to load address data", err);
    }
  };

  // Show message helper
  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Dispatch update event
  const dispatchUpdateEvent = (updatedData: any) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("userDetailsUpdated", {
          detail: updatedData
        })
      );
    }
  };

  // Collect form values from refs (excluding address)
  const collectFormValues = () => {
    return {
      firstName: firstNameRef.current?.value || "",
      lastName: lastNameRef.current?.value || "",
      emailAddress: emailRef.current?.value || "",
      phoneNumber: phoneNumber,
      country: countryRef.current?.value || "",
      city: cityRef.current?.value || "",
      state: stateRef.current?.value || "",
      profileImage: selectedImage || null
    };
  };

  // Handle address update via dedicated endpoint
  const handleAddressUpdate = async (token: string | undefined) => {
    try {
      const address = addressRef.current?.value || "";
      const city = cityRef.current?.value || "";
      const state = stateRef.current?.value || "";
      const country = countryRef.current?.value || "";

      if (!address && !city && !state) {
        console.log("No address fields to update");
        return;
      }

      const addressData = {
        fullAddress: address || "",
        city: city || "",
        state: state || "",
        country: country || ""
      };

      const url = `${baseUrL}/addresses`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(addressData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Address update failed:", errorText);
        return null;
      }

      const addressResponse = await res.json();
      return addressResponse;
    } catch (err) {
      console.error("Address update error:", err);
      return null;
    }
  };

  // Handle update
  const handleUpdate = async () => {
    setLoading(true);

    try {
      const stored = getUserDetails();
      const token = stored?.accessToken;
      const email = emailRef.current?.value || stored?.emailAddress;

      if (!email) {
        showMessage("No email found", "error");
        return;
      }

      const updateData = collectFormValues();

      const profileUrl = `${baseUrL}/update-customer?emailAddress=${encodeURIComponent(email)}`;
      const profileRes = await fetch(profileUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updateData)
      });

      if (!profileRes.ok) {
        const errorText = await profileRes.text();
        throw new Error(
          `Profile update failed: ${profileRes.status} - ${errorText}`
        );
      }

      const updated = await profileRes.json();

      // Update address separately via dedicated endpoint
      await handleAddressUpdate(token);

      // Update localStorage with profile data
      const currentStored = getUserDetails();
      const updatedUser = {
        ...currentStored,
        ...updated,
        accessToken: currentStored?.accessToken,
        refreshToken: currentStored?.refreshToken
      };

      setValue(updatedUser as User);
      dispatchUpdateEvent(updated);

      showMessage("Profile updated successfully!", "success");

      setTimeout(() => {
        router.push("/Account-Overview");
      }, 1500);
    } catch (err) {
      console.error("Update error:", err);
      showMessage(
        err instanceof Error ? err.message : "Update failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image size should be less than 5MB", "error");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showMessage("Please upload an image file", "error");
      return;
    }

    setImageUploading(true);

    try {
      const stored = getUserDetails();
      const token = stored?.accessToken;
      const email = emailRef.current?.value || stored?.emailAddress;

      if (!email) {
        showMessage("No email found", "error");
        return;
      }

      // Compress + resize image to keep base64 small enough for DB column
      const imageData = await new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
          const MAX = 300;
          const scale = Math.min(MAX / img.width, MAX / img.height, 1);
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      const url = `${baseUrL}/update-customer-profile-image?emailAddress=${encodeURIComponent(email)}`;
      // Strip data URL prefix — backend expects raw base64 only
      const rawBase64 = imageData.split(",")[1] ?? imageData;

      const body = new URLSearchParams();
      body.append("profileImage", rawBase64);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: body.toString()
      });

      if (!res.ok) {
        throw new Error(`Image upload failed: ${res.status}`);
      }

      const data = await res.json();

      setSelectedImage(imageData);
      setCustomer((prev) => ({ ...prev, profileImage: imageData }));

      const currentStored = getUserDetails();
      const updatedUser = {
        ...currentStored,
        profileImage: imageData,
        ...data
      };

      setValue(updatedUser as User);
      dispatchUpdateEvent({ profileImage: imageData, ...data });

      showMessage("Profile image updated successfully!", "success");
    } catch (err) {
      console.error("Failed to upload image", err);
      showMessage("Image upload failed. Please try again.", "error");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-10 w-full border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-500 text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h2 className="text-3xl font-semibold text-gray-800">Account Settings</h2>
            </div>
            <p className="text-gray-600 mt-1">
              Update your profile information
            </p>
          </div>

          <div className="flex items-center gap-4">
            {message && (
              <div
                className={`px-4 py-2 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
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
                  className="w-full max-w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
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
                  className="w-full max-w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
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
                  className="w-full max-w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
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
                      const cleaned = value
                        .replace(/\D/g, "")
                        .replace("234", "");
                      setPhoneNumber(cleaned);
                    }}
                    inputStyle={{
                      border: "none",
                      background: "transparent",
                      width: "75px",
                      height: "38px"
                    }}
                    buttonStyle={{
                      background: "transparent",
                      border: "none"
                    }}
                    containerStyle={{
                      width: "95px"
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
                  className="w-full max-w-[288px] rounded-md border border-gray-300 bg-[#EFF1F999] px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  placeholder="Enter address"
                  defaultValue={customer.address || ""}
                  className="w-full max-w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
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
                  placeholder="Enter city"
                  defaultValue={customer.city || ""}
                  className="w-full max-w-[410px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
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
                    placeholder="Enter country"
                    defaultValue={customer.country || ""}
                    className="w-full max-w-[200px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
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
                    placeholder="Enter state"
                    defaultValue={customer.state || ""}
                    className="w-full max-w-[200px] border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999]"
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
                  unoptimized={selectedImage?.startsWith("data:image")}
                />

                {/* Upload Button */}
                <label
                  htmlFor="profile-upload"
                  className={`absolute -bottom-1 -right-1 w-10 h-10 cursor-pointer bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors ${
                    imageUploading ? "opacity-50 cursor-not-allowed" : ""
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

            <button
              type="button"
              onClick={() => router.push("/admin/account-overview")}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
