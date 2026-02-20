"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { baseUrL } from "@/env/URLs";
import { useLocalStorage } from "@/hooks/useLocalStorage";

/* ===================== Types & Sample Data ===================== */

type Measurement = {
  id: string;
  name: string;
  isDefault?: boolean;
  note?: string;
  description?: string;
  measurements?: {
    // Top Body (Torso)
    neck: number;
    chest: number;
    tummy: number;
    hipWidth: number;
    lengthNeckToHip: number;
    shoulder: number;
    // Hand
    bicepWidth: number;
    elbowWidth: number;
    wristWidth: number;
    shortSleeveLength: number;
    elbowLength: number;
    longSleeveLength: number;
    // Lower Body
    waist: number;
    lowerHipWidth: number;
    thighWidth: number;
    kneeWidth: number;
    ankleWidth: number;
    kneeLength: number;
    ankleLength: number;
  };
};

type BodyMeasurementRequest = {
  id?: string | number;
  tag: string;
  neck: number;
  shoulder: number;
  chest: number;
  tummy: number;
  hipWidth: number;
  neckToHipLength: number;
  shortSleeveAtBiceps: number;
  midSleeveAtElbow: number;
  longSleeveAtWrist: number;
  waist: number;
  thigh: number;
  knee: number;
  ankle: number;
  trouserLength: number;
};

type BodyMeasurementDto = {
  tag: string;
  neck: number;
  shoulder: number;
  chest: number;
  tummy: number;
  hipWidth: number;
  neckToHipLength: number;
  shortSleeveAtBiceps: number;
  midSleeveAtElbow: number;
  longSleeveAtWrist: number;
  waist: number;
  thigh: number;
  knee: number;
  ankle: number;
  trouserLength: number;
};

/* ===================== UI Primitives ===================== */

function PageHeader() {
  return (
    <div className="px-2 pt-2 pb-6">
      <h1 className="text-3xl font-bold text-gray-900">Measurements</h1>
      <p className="mt-2 text-base text-gray-600">
        Manage your default body measurement and saved profiles.
      </p>
    </div>
  );
}

function Chip({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        active
          ? "bg-gray-900 text-white border-gray-900 focus:ring-gray-900 shadow-sm"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-300 shadow-sm"
      }`}
    >
      {label}
    </button>
  );
}

function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

function Subtle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>;
}

/* ===================== Measurement Table Component ===================== */

function MeasurementTable({
  measurements,
}: {
  measurements?: Measurement["measurements"];
}) {
  if (!measurements) {
    return (
      <div className="text-center py-8 text-gray-500">
        No measurement data available
      </div>
    );
  }

  const measurementSections = [
    {
      title: "Top Body (Torso)",
      measurements: [
        { label: "Neck", value: measurements.neck, unit: "in" },
        { label: "Chest", value: measurements.chest, unit: "in" },
        { label: "Tummy", value: measurements.tummy, unit: "in" },
        { label: "Hip Width", value: measurements.hipWidth, unit: "in" },
        {
          label: "Length (Neck to Hip)",
          value: measurements.lengthNeckToHip,
          unit: "in",
        },
        { label: "Shoulder", value: measurements.shoulder, unit: "in" },
      ],
    },
    {
      title: "Hand",
      measurements: [
        { label: "Bicep Width", value: measurements.bicepWidth, unit: "in" },
        { label: "Elbow Width", value: measurements.elbowWidth, unit: "in" },
        { label: "Wrist Width", value: measurements.wristWidth, unit: "in" },
        {
          label: "Short Sleeve Length",
          value: measurements.shortSleeveLength,
          unit: "in",
        },
        { label: "Elbow Length", value: measurements.elbowLength, unit: "in" },
        {
          label: "Long Sleeve Length",
          value: measurements.longSleeveLength,
          unit: "in",
        },
      ],
    },
    {
      title: "Lower Body",
      measurements: [
        { label: "Waist", value: measurements.waist, unit: "in" },
        { label: "Hip Width", value: measurements.lowerHipWidth, unit: "in" },
        { label: "Thigh Width", value: measurements.thighWidth, unit: "in" },
        { label: "Knee Width", value: measurements.kneeWidth, unit: "in" },
        { label: "Ankle Width", value: measurements.ankleWidth, unit: "in" },
        {
          label: "Knee Length (Waist to Knee)",
          value: measurements.kneeLength,
          unit: "in",
        },
        {
          label: "Ankle Length (Waist to Ankle)",
          value: measurements.ankleLength,
          unit: "in",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {measurementSections.map((section) => (
        <div
          key={section.title}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              {section.title}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {section.measurements.map((item, index) => (
              <div
                key={item.label}
                className="flex justify-between items-center px-4 py-3 hover:bg-gray-50"
              >
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className="text-sm font-medium text-gray-900">
                  {item.value} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===================== Action Icons Component ===================== */

function ActionIcons({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {/* View Icon */}
      <button
        onClick={onView}
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
        title="View Details"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>

      {/* Edit Icon */}
      <button
        onClick={onEdit}
        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
        title="Edit Measurement"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      {/* Delete Icon */}
      <button
        onClick={onDelete}
        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
        title="Delete Measurement"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}

/* ===================== SlideOver (Right-Side Modal) ===================== */

function SlideOver({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  // Close on ESC + lock scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="slideover-title"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`ml-auto flex h-full w-full max-w-4xl transform flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2
            id="slideover-title"
            className="text-lg font-semibold text-gray-900"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
        <div className="h-[calc(100%-64px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ===================== Page ===================== */

export default function Page({
  items = [],
  onAddNew,
}: {
  items?: Measurement[];
  onAddNew?: () => void;
}) {
  const [measurements, setMeasurements] = useState<Measurement[]>(items || []);
  const defaultItem = measurements.find((m) => m.isDefault) ?? measurements[0];
  const others = measurements.filter((m) => defaultItem && m.id !== defaultItem.id);

  const { getUserDetails } = useLocalStorage("userDetails", null);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showDefaultModal, setShowDefaultModal] = useState(false);
  const [editingMeasurement, setEditingMeasurement] =
    useState<Measurement | null>(null);
  const [viewingMeasurement, setViewingMeasurement] =
    useState<Measurement | null>(null);
  const [deletingMeasurement, setDeletingMeasurement] =
    useState<Measurement | null>(null);

  const [formData, setFormData] = useState<BodyMeasurementRequest>({
    tag: "",
    neck: 0,
    shoulder: 0,
    chest: 0,
    tummy: 0,
    hipWidth: 0,
    neckToHipLength: 0,
    shortSleeveAtBiceps: 0,
    midSleeveAtElbow: 0,
    longSleeveAtWrist: 0,
    waist: 0,
    thigh: 0,
    knee: 0,
    ankle: 0,
    trouserLength: 0,
  });

  useEffect(() => {
    if (editingMeasurement && showNew) {
      // Only populate form if we're editing — include id so updates send it
      setFormData({
        id: editingMeasurement.id,
        tag: editingMeasurement.name || "",
        neck: editingMeasurement.measurements?.neck || 0,
        shoulder: editingMeasurement.measurements?.shoulder || 0,
        chest: editingMeasurement.measurements?.chest || 0,
        tummy: editingMeasurement.measurements?.tummy || 0,
        hipWidth: editingMeasurement.measurements?.hipWidth || 0,
        neckToHipLength: editingMeasurement.measurements?.lengthNeckToHip || 0,
        shortSleeveAtBiceps: editingMeasurement.measurements?.bicepWidth || 0,
        midSleeveAtElbow: editingMeasurement.measurements?.elbowWidth || 0,
        longSleeveAtWrist: editingMeasurement.measurements?.wristWidth || 0,
        waist: editingMeasurement.measurements?.waist || 0,
        thigh: editingMeasurement.measurements?.thighWidth || 0,
        knee: editingMeasurement.measurements?.kneeWidth || 0,
        ankle: editingMeasurement.measurements?.ankleWidth || 0,
        trouserLength: editingMeasurement.measurements?.ankleLength || 0,
      });
    } else if (!editingMeasurement && showNew) {
      // Clear form for new measurement
      setFormData({
        tag: "",
        neck: 0,
        shoulder: 0,
        chest: 0,
        tummy: 0,
        hipWidth: 0,
        neckToHipLength: 0,
        shortSleeveAtBiceps: 0,
        midSleeveAtElbow: 0,
        longSleeveAtWrist: 0,
        waist: 0,
        thigh: 0,
        knee: 0,
        ankle: 0,
        trouserLength: 0,
      });
    }
  }, [editingMeasurement, showNew]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return others;
    return others.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.description ?? "").toLowerCase().includes(q)
    );
  }, [others, query]);

  const selected =
    (selectedId ? measurements.find((i) => i.id === selectedId) : null) ?? null;

  const handleEditDefault = () => {
    if (defaultItem) {
      setEditingMeasurement(defaultItem);
      setShowDefaultModal(false);
      setShowNew(true);
    }
  };

  const handleViewMeasurement = (measurement: Measurement) => {
    setViewingMeasurement(measurement);
  };

  const handleEditMeasurement = (measurement: Measurement) => {
    setEditingMeasurement(measurement);
    setViewingMeasurement(null);
    setShowNew(true);
  };

  const handleDeleteMeasurement = (measurement: Measurement) => {
    setDeletingMeasurement(measurement);
  };

  const handleConfirmDelete = () => {
    // Here you would typically delete the measurement from your data
    console.log("Deleting measurement:", deletingMeasurement?.name);
    setDeletingMeasurement(null);
  };

  const createBodyMeasurement = async (data: BodyMeasurementRequest) => {
    const userDetails = getUserDetails();
    const token = userDetails?.accessToken;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${baseUrL}/create-body-measurement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  };

  const updateBodyMeasurement = async (data: BodyMeasurementRequest) => {
    const userDetails = getUserDetails();
    const token = userDetails?.accessToken;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${baseUrL}/update-body-measurement`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  };

  const loadMeasurements = useCallback(async () => {
    try {
      const userDetails = getUserDetails();
      const token = userDetails?.accessToken;

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${baseUrL}/get-body-measurement-by-user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch measurements');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        const transformedData: Measurement[] = data.map((m: any) => ({
          id: m.id || m.tag,
          name: m.tag,
          description: m.description ?? `Measurement saved for ${m.tag}`,
          measurements: {
            neck: m.neck,
            chest: m.chest,
            tummy: m.tummy,
            hipWidth: m.hipWidth,
            lengthNeckToHip: m.neckToHipLength,
            shoulder: m.shoulder,
            bicepWidth: m.shortSleeveAtBiceps,
            elbowWidth: m.midSleeveAtElbow,
            wristWidth: m.longSleeveAtWrist,
            shortSleeveLength: m.shortSleeveAtBiceps,
            elbowLength: m.midSleeveAtElbow,
            longSleeveLength: m.longSleeveAtWrist,
            waist: m.waist,
            lowerHipWidth: m.hipWidth,
            thighWidth: m.thigh,
            kneeWidth: m.knee,
            ankleWidth: m.ankle,
            kneeLength: m.trouserLength,
            ankleLength: m.trouserLength,
          },
        }));
        setMeasurements(transformedData);
      }
    } catch (error) {
      console.error('Error loading measurements:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadMeasurements();
  }, [loadMeasurements]);

  const handleSaveMeasurement = async () => {
    try {
      console.log('Starting to save measurement...');
      
      // Validate that tag is not empty
      if (!formData.tag || formData.tag.trim() === "") {
        alert('Please enter a measurement tag/name');
        return;
      }
      
      // Ensure all numeric fields are actually numbers
      const cleanedFormData: BodyMeasurementRequest = {
        tag: formData.tag,
        neck: parseInt(formData.neck as any) || 0,
        shoulder: parseInt(formData.shoulder as any) || 0,
        chest: parseInt(formData.chest as any) || 0,
        tummy: parseInt(formData.tummy as any) || 0,
        hipWidth: parseInt(formData.hipWidth as any) || 0,
        neckToHipLength: parseInt(formData.neckToHipLength as any) || 0,
        shortSleeveAtBiceps: parseInt(formData.shortSleeveAtBiceps as any) || 0,
        midSleeveAtElbow: parseInt(formData.midSleeveAtElbow as any) || 0,
        longSleeveAtWrist: parseInt(formData.longSleeveAtWrist as any) || 0,
        waist: parseInt(formData.waist as any) || 0,
        thigh: parseInt(formData.thigh as any) || 0,
        knee: parseInt(formData.knee as any) || 0,
        ankle: parseInt(formData.ankle as any) || 0,
        trouserLength: parseInt(formData.trouserLength as any) || 0,
      };

      // If we're editing, include the id so backend can identify the record
      if (editingMeasurement && editingMeasurement.id) {
        cleanedFormData.id = editingMeasurement.id;
      }

      const result = editingMeasurement
        ? await updateBodyMeasurement(cleanedFormData)
        : await createBodyMeasurement(cleanedFormData);

      setShowNew(false);
      setEditingMeasurement(null);
      setFormData({
        tag: "",
        neck: 0,
        shoulder: 0,
        chest: 0,
        tummy: 0,
        hipWidth: 0,
        neckToHipLength: 0,
        shortSleeveAtBiceps: 0,
        midSleeveAtElbow: 0,
        longSleeveAtWrist: 0,
        waist: 0,
        thigh: 0,
        knee: 0,
        ankle: 0,
        trouserLength: 0,
      });

      await loadMeasurements();
    } catch (error: any) {
      alert(`Error saving measurement: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <PageHeader />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search measurements…"
                className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
              />
            </div>
            <button
              className="inline-flex items-center justify-center rounded-xl border border-transparent bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
              onClick={() => {
                setEditingMeasurement(null);
                setShowNew(true);
              }}
            >
              Add New Measurement
            </button>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left column - Default Measurement */}
            <div className="space-y-6">
              {/* Default Measurement Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <SectionTitle>Default Body Measurement</SectionTitle>
                    <Subtle className="mt-2">
                      {defaultItem?.note ||
                        "This is your personal body measurement"}
                    </Subtle>
                  </div>
                  <Chip
                    label="View Details"
                    active={false}
                    onClick={() => setShowDefaultModal(true)}
                  />
                </div>
              </div>

              {/* Other Measurements Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-6">
                  <SectionTitle>Saved Measurements</SectionTitle>
                  <Subtle className="mt-2">
                    You can have up to 10 different measurements
                  </Subtle>
                </div>

                {filtered.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="mt-4 text-sm text-gray-500">
                      {query
                        ? "No measurements match your search."
                        : "No saved measurements yet."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {filtered.map((m) => (
                      <div
                        key={m.id}
                        className={`w-full rounded-xl border px-4 py-4 transition-all duration-200 ${
                          selectedId === m.id
                            ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                            : "border-gray-200 bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{m.name}</div>
                            {m.description && (
                              <div
                                className={`mt-1 text-sm ${
                                  selectedId === m.id
                                    ? "text-gray-200"
                                    : "text-gray-600"
                                }`}
                              >
                                {m.description}
                              </div>
                            )}
                          </div>
                          <ActionIcons
                            onView={() => handleViewMeasurement(m)}
                            onEdit={() => handleEditMeasurement(m)}
                            onDelete={() => handleDeleteMeasurement(m)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Selected Measurement Details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center">
              <Image
                src="/images/size-guide.png"
                alt="Men's size guide illustration"
                width={800}
                height={800}
                priority
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===================== New/Edit Measurement SlideOver ===================== */}
      <SlideOver
        open={showNew}
        onClose={() => {
          setShowNew(false);
          setEditingMeasurement(null);
        }}
        title={
          editingMeasurement
            ? `Edit ${editingMeasurement.name}`
            : "New Measurement"
        }
      >
        {/* Top notice + input name + save */}
        <p className="text-sm text-gray-500 mb-6">
          Measurement input should be in inches
        </p>

        <div className="flex items-end justify-between gap-4 mb-8">
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700">
              Measurement Tag
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="e.g., Casual, Formal, etc."
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            />
          </div>
          <button
            onClick={handleSaveMeasurement}
            className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            {editingMeasurement ? "Update" : "Save"}
          </button>
        </div>

        {/* Measurement Sections */}
        {[
          {
            title: "Top Body (Torso)",
            fields: [
              { key: "neck", label: "Neck" },
              { key: "chest", label: "Chest" },
              { key: "tummy", label: "Tummy" },
              { key: "hipWidth", label: "Hip Width" },
              { key: "neckToHipLength", label: "Neck to Hip Length" },
              { key: "shoulder", label: "Shoulder" },
            ],
          },
          {
            title: "Sleeve",
            fields: [
              { key: "shortSleeveAtBiceps", label: "Short Sleeve at Biceps" },
              { key: "midSleeveAtElbow", label: "Mid Sleeve at Elbow" },
              { key: "longSleeveAtWrist", label: "Long Sleeve at Wrist" },
            ],
          },
          {
            title: "Lower Body",
            fields: [
              { key: "waist", label: "Waist" },
              { key: "thigh", label: "Thigh" },
              { key: "knee", label: "Knee" },
              { key: "ankle", label: "Ankle" },
              { key: "trouserLength", label: "Trouser Length" },
            ],
          },
        ].map((section, index) => (
          <div
            key={section.title}
            className={`rounded-xl border border-gray-200 p-6 ${
              index > 0 ? "mt-6" : ""
            }`}
          >
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {section.title}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 pr-10"
                      placeholder="0"
                      value={formData[field.key as keyof BodyMeasurementRequest]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      in
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </SlideOver>

      {/* ===================== Default Measurement Modal ===================== */}
      <SlideOver
        open={showDefaultModal}
        onClose={() => setShowDefaultModal(false)}
        title="Default Measurement Details"
      >
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">{defaultItem?.description}</p>
          </div>

          <MeasurementTable measurements={defaultItem?.measurements} />

          <div className="grid grid-cols-2 gap-4 text-sm pt-4">
            <div>
              <span className="text-gray-500">Status:</span>
              <span className="ml-2 text-gray-900">Default</span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 text-gray-900">Today</span>
            </div>
          </div>

          {/* Edit Button inside the modal */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleEditDefault}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Measurements
            </button>
          </div>
        </div>
      </SlideOver>

      {/* ===================== Saved Measurement View Modal ===================== */}
      <SlideOver
        open={!!viewingMeasurement}
        onClose={() => setViewingMeasurement(null)}
        title={`${viewingMeasurement?.name} Details`}
      >
        {viewingMeasurement && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">
                {viewingMeasurement.description}
              </p>
            </div>

            <MeasurementTable measurements={viewingMeasurement.measurements} />

            <div className="grid grid-cols-2 gap-4 text-sm pt-4">
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-2 text-gray-900">Saved</span>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <span className="ml-2 text-gray-900">Recently</span>
              </div>
            </div>

            {/* Action Buttons inside the modal */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setViewingMeasurement(null);
                  handleEditMeasurement(viewingMeasurement);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
            </div>
          </div>
        )}
      </SlideOver>

      {/* ===================== Delete Confirmation Modal ===================== */}
      {deletingMeasurement && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeletingMeasurement(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Delete Measurement
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete{" "}
                <strong>{deletingMeasurement.name}</strong>? This action cannot
                be undone.
              </p>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setDeletingMeasurement(null)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
