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

type TabKey = "personal" | "business";

export default function TailorSettingsPage() {
  const [tab, setTab] = useState<TabKey>("personal");
  const router = useRouter();
  const { getUserDetails, setValue } = useLocalStorage<User>("tailorDetails");

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    country: "",
    address: "",
    city: "",
    state: "",
    profileImage: null as string | null,
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const bizNameRef = useRef<HTMLInputElement>(null);
  const bizAddressRef = useRef<HTMLInputElement>(null);
  const bizCityRef = useRef<HTMLInputElement>(null);
  const bizStateRef = useRef<HTMLInputElement>(null);
  const bizCountryRef = useRef<HTMLInputElement>(null);

  const dataLoadedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const loadData = async () => {
      if (dataLoadedRef.current) return;
      try {
        const stored = getUserDetails();
        const email = stored?.emailAddress;
        const token = stored?.accessToken;
        if (!email) return;

        const res = await fetch(
          `${baseUrL}/customer-details?emailAddress=${encodeURIComponent(email)}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );

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
            profileImage: data.profileImage || null,
          });

          if (firstNameRef.current) firstNameRef.current.value = data.firstName || "";
          if (lastNameRef.current) lastNameRef.current.value = data.lastName || "";
          if (emailRef.current) emailRef.current.value = data.emailAddress || "";
          if (countryRef.current) countryRef.current.value = data.country || "";
          if (bizNameRef.current) bizNameRef.current.value = data.businessName || "";
          if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
          if (data.profileImage) setSelectedImage(data.profileImage);

          // Load address
          if (token) {
            const addrRes = await fetch(`${baseUrL}/addresses`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (addrRes.ok && isMountedRef.current) {
              const addrData = await addrRes.json();
              const a = Array.isArray(addrData) ? addrData[0] : addrData;
              if (a) {
                if (addressRef.current) addressRef.current.value = a.fullAddress || "";
                if (cityRef.current) cityRef.current.value = a.city || "";
                if (stateRef.current) stateRef.current.value = a.state || "";
                if (bizAddressRef.current) bizAddressRef.current.value = a.fullAddress || "";
                if (bizCityRef.current) bizCityRef.current.value = a.city || "";
                if (bizStateRef.current) bizStateRef.current.value = a.state || "";
                if (bizCountryRef.current) bizCountryRef.current.value = a.country || "";
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };

    loadData();
    return () => { isMountedRef.current = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const stored = getUserDetails();
      const token = stored?.accessToken;
      const email = emailRef.current?.value || stored?.emailAddress;
      if (!email) { showMessage("No email found", "error"); return; }

      const updateData = {
        firstName: firstNameRef.current?.value || "",
        lastName: lastNameRef.current?.value || "",
        emailAddress: emailRef.current?.value || "",
        phoneNumber,
        country: countryRef.current?.value || "",
        city: cityRef.current?.value || "",
        state: stateRef.current?.value || "",
        profileImage: selectedImage || null,
      };

      const profileRes = await fetch(
        `${baseUrL}/update-customer?emailAddress=${encodeURIComponent(email)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!profileRes.ok) throw new Error(`Profile update failed: ${profileRes.status}`);
      const updated = await profileRes.json();

      // Update address
      const address = addressRef.current?.value || "";
      const city = cityRef.current?.value || "";
      const state = stateRef.current?.value || "";
      const country = countryRef.current?.value || "";
      if (address || city || state) {
        await fetch(`${baseUrL}/addresses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ fullAddress: address, city, state, country }),
        });
      }

      const currentStored = getUserDetails();
      setValue({ ...currentStored, ...updated, accessToken: currentStored?.accessToken, refreshToken: currentStored?.refreshToken } as User);
      window.dispatchEvent(new CustomEvent("userDetailsUpdated", { detail: updated }));
      showMessage("Profile updated successfully!", "success");
      setTimeout(() => router.push("/tailor"), 1500);
    } catch (err) {
      showMessage(err instanceof Error ? err.message : "Update failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessUpdate = async () => {
    setLoading(true);
    try {
      const stored = getUserDetails();
      const token = stored?.accessToken;
      const email = stored?.emailAddress;
      if (!token || !email) { showMessage("Not authenticated", "error"); return; }

      const businessName = bizNameRef.current?.value || "";
      const address = bizAddressRef.current?.value || "";
      const city = bizCityRef.current?.value || "";
      const state = bizStateRef.current?.value || "";
      const country = bizCountryRef.current?.value || "";

      const profileRes = await fetch(
        `${baseUrL}/update-customer?emailAddress=${encodeURIComponent(email)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ businessName }),
        }
      );
      if (!profileRes.ok) throw new Error(`Failed to save business name: ${profileRes.status}`);

      if (address || city || state || country) {
        const addrRes = await fetch(`${baseUrL}/addresses`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ fullAddress: address, city, state, country }),
        });
        if (!addrRes.ok) throw new Error(`Failed to save address: ${addrRes.status}`);
      }

      window.dispatchEvent(new CustomEvent("userDetailsUpdated"));
      showMessage("Business information saved successfully!", "success");
      setTimeout(() => router.push("/tailor"), 1500);
    } catch (err) {
      showMessage(err instanceof Error ? err.message : "Save failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showMessage("Image size should be less than 5MB", "error"); return; }
    if (!file.type.startsWith("image/")) { showMessage("Please upload an image file", "error"); return; }

    setImageUploading(true);
    try {
      const stored = getUserDetails();
      const token = stored?.accessToken;
      const email = emailRef.current?.value || stored?.emailAddress;
      if (!email) { showMessage("No email found", "error"); return; }

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

      const rawBase64 = imageData.split(",")[1] ?? imageData;
      const body = new URLSearchParams();
      body.append("profileImage", rawBase64);

      const res = await fetch(
        `${baseUrL}/update-customer-profile-image?emailAddress=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: body.toString(),
        }
      );

      if (!res.ok) throw new Error(`Image upload failed: ${res.status}`);
      const data = await res.json();

      setSelectedImage(imageData);
      setCustomer((prev) => ({ ...prev, profileImage: imageData }));
      const currentStored = getUserDetails();
      setValue({ ...currentStored, profileImage: imageData, ...data } as User);
      window.dispatchEvent(new CustomEvent("userDetailsUpdated", { detail: { profileImage: imageData, ...data } }));
      showMessage("Profile image updated successfully!", "success");
    } catch (err) {
      showMessage("Image upload failed. Please try again.", "error");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-500 text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Account Settings</h1>
        </div>
        <TabNav tab={tab} setTab={setTab} />

        {message && (
          <div className={`mb-4 px-4 py-2 rounded-md text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <div className={tab === "personal" ? "" : "hidden"}>
            <PersonalForm
              firstNameRef={firstNameRef}
              lastNameRef={lastNameRef}
              emailRef={emailRef}
              addressRef={addressRef}
              cityRef={cityRef}
              stateRef={stateRef}
              countryRef={countryRef}
              usernameRef={usernameRef}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              selectedImage={selectedImage}
              imageUploading={imageUploading}
              handleImageUpload={handleImageUpload}
              loading={loading}
              handleUpdate={handleUpdate}
            />
          </div>
          <div className={tab === "business" ? "" : "hidden"}>
            <BusinessForm
              bizNameRef={bizNameRef}
              bizAddressRef={bizAddressRef}
              bizCityRef={bizCityRef}
              bizStateRef={bizStateRef}
              bizCountryRef={bizCountryRef}
              loading={loading}
              handleBusinessUpdate={handleBusinessUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- TAB NAV -------------------- */
function TabNav({ tab, setTab }: { tab: TabKey; setTab: (k: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; icon: JSX.Element }[] = [
    { key: "personal", label: "Personal", icon: <UserIcon className="h-4 w-4" /> },
    { key: "business", label: "Business", icon: <BriefcaseIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="mb-4">
      <div className="inline-flex rounded-full bg-white shadow-sm border border-gray-200 p-1">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${active ? "bg-gray-900 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <span className={`${active ? "opacity-100" : "opacity-70"} transition`}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- ICONS -------------------- */
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" strokeWidth="1.8" />
    </svg>
  );
}
function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="1.8" />
      <path strokeWidth="1.8" d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path strokeWidth="1.8" d="M3 12h18" />
    </svg>
  );
}

/* -------------------- PERSONAL FORM -------------------- */
function PersonalForm({
  firstNameRef, lastNameRef, emailRef, addressRef, cityRef, stateRef, countryRef, usernameRef,
  phoneNumber, setPhoneNumber, selectedImage, imageUploading, handleImageUpload, loading, handleUpdate,
}: {
  firstNameRef: React.RefObject<HTMLInputElement>;
  lastNameRef: React.RefObject<HTMLInputElement>;
  emailRef: React.RefObject<HTMLInputElement>;
  addressRef: React.RefObject<HTMLInputElement>;
  cityRef: React.RefObject<HTMLInputElement>;
  stateRef: React.RefObject<HTMLInputElement>;
  countryRef: React.RefObject<HTMLInputElement>;
  usernameRef: React.RefObject<HTMLInputElement>;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  selectedImage: string | null;
  imageUploading: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  handleUpdate: () => void;
}) {
  return (
    <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Personal Information</h2>
        <p className="mt-1 text-sm text-gray-500">Update your personal details and password</p>
      </div>

      {/* Profile image */}
      <div className="flex items-center gap-6">
        <div className="relative w-20 h-20">
          <Image
            src={selectedImage || "/images/Men.png"}
            alt="Profile"
            width={80}
            height={80}
            className="w-full h-full rounded-full object-cover border-4 border-gray-200"
            unoptimized={!!selectedImage?.startsWith("data:image")}
          />
          <label htmlFor="profile-upload-tailor" className={`absolute -bottom-1 -right-1 w-7 h-7 cursor-pointer bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors ${imageUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {imageUploading
              ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              : <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            }
            <input id="profile-upload-tailor" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={imageUploading} />
          </label>
        </div>
        <p className="text-sm text-gray-500">Click the icon to upload a new profile photo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="First Name" inputRef={firstNameRef} placeholder="Enter first name" />
        <FormInput label="Last Name" inputRef={lastNameRef} placeholder="Enter last name" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
            <PhoneInput
              country={"ng"}
              value={phoneNumber ? `+234${phoneNumber}` : ""}
              onChange={(value: string, country: CountryType) => {
                const cleaned = value.replace(/\D/g, "").replace("234", "");
                setPhoneNumber(cleaned);
              }}
              inputStyle={{ border: "none", background: "transparent", width: "75px", height: "38px" }}
              buttonStyle={{ background: "transparent", border: "none" }}
              containerStyle={{ width: "95px" }}
              disableCountryCode={true}
              disableDropdown={false}
              enableSearch={true}
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter phone number"
              className="flex-1 px-3 py-2.5 bg-transparent focus:outline-none text-gray-900 text-sm"
            />
          </div>
        </div>
        <FormInput label="Email" inputRef={emailRef} placeholder="Enter email" type="email" />
        <FormInput label="Address" inputRef={addressRef} placeholder="Enter address" className="md:col-span-2" />
        <FormInput label="City" inputRef={cityRef} placeholder="Enter city" />
        <FormInput label="State" inputRef={stateRef} placeholder="Enter state" />
        <FormInput label="Country" inputRef={countryRef} placeholder="Enter country" />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PlainInput placeholder="Old Password" type="password" />
          <PlainInput placeholder="New Password" type="password" />
          <PlainInput placeholder="Confirm Password" type="password" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

/* -------------------- BUSINESS FORM -------------------- */
function BusinessForm({
  bizNameRef, bizAddressRef, bizCityRef, bizStateRef, bizCountryRef, loading, handleBusinessUpdate,
}: {
  bizNameRef: React.RefObject<HTMLInputElement>;
  bizAddressRef: React.RefObject<HTMLInputElement>;
  bizCityRef: React.RefObject<HTMLInputElement>;
  bizStateRef: React.RefObject<HTMLInputElement>;
  bizCountryRef: React.RefObject<HTMLInputElement>;
  loading: boolean;
  handleBusinessUpdate: () => void;
}) {
  return (
    <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleBusinessUpdate(); }}>
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Business Information</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your business details and documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadCard label="Business registration certificate" />
        <UploadCard label="Business premises photo" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="Business Name *" inputRef={bizNameRef} placeholder="Enter business name" />
        <PlainInput label="CAC Registration Number *" placeholder="Enter CAC number" />
        <PlainInput label="Business Phone Number" placeholder="+234..." />
        <PlainInput label="Business Email" placeholder="business@email.com" />
        <PlainInput label="Business Website" placeholder="https://..." className="md:col-span-2" />
        <FormInput label="Business Address *" inputRef={bizAddressRef} placeholder="Enter business address" className="md:col-span-2" />
        <FormInput label="City" inputRef={bizCityRef} placeholder="Enter city" />
        <FormInput label="State" inputRef={bizStateRef} placeholder="Enter state" />
        <FormInput label="Country *" inputRef={bizCountryRef} placeholder="Enter country" />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Account Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PlainInput label="Name on Account" placeholder="Name on Account" />
          <PlainInput label="Account Number" placeholder="Account Number" />
          <PlainInput label="Bank Name" placeholder="Bank Name" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

/* -------------------- REUSABLES -------------------- */
function FormInput({
  label, inputRef, placeholder, type = "text", className = "",
}: {
  label?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors duration-200"
      />
    </div>
  );
}

function PlainInput({
  label, placeholder, defaultValue, type = "text", className = "",
}: {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors duration-200"
      />
    </div>
  );
}

function UploadCard({ label }: { label: string }) {
  return (
    <div className="bg-[#F4F5FA] rounded-xl border-2 border-dashed border-gray-200 p-6 text-center hover:border-gray-300 transition-colors duration-200">
      <div className="mb-3">
        <div className="mx-auto h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">Upload {label.toLowerCase()}</p>
        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
      </div>
      <button type="button" className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200">
        Choose File
      </button>
    </div>
  );
}
