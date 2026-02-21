"use client";

import React, { useState } from "react";
import Image from "next/image";
import { baseUrL } from "@/env/URLs";
import { useFetch } from "@/hooks/useFetch";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Star
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { errorToast, successToast } from "@/hooks/UseToast";

const PageHeader = () => (
  <div className="px-2 pt-2 pb-6">
    <h1 className="text-3xl font-bold text-gray-900">Measurements</h1>
    <p className="mt-2 text-base text-gray-600">
      Manage your default body measurement and saved profiles.
    </p>
  </div>
);

const Chip = ({ label, active = false, onClick }: { label: string; active?: boolean; onClick?: () => void }) => (
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

const SectionTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h2>
);

const Subtle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);

const MeasurementTable = ({ measurements }: { measurements?: Measurement["measurements"] }) => {
  if (!measurements) return <div className="text-center py-8 text-gray-500">No measurement data available</div>;

  const sections = [
    {
      title: "Top Body (Torso)",
      measurements: [
        { label: "Neck", value: measurements.neck, unit: "in" },
        { label: "Chest", value: measurements.chest, unit: "in" },
        { label: "Tummy", value: measurements.tummy, unit: "in" },
        { label: "Hip Width", value: measurements.hipWidth, unit: "in" },
        { label: "Length (Neck to Hip)", value: measurements.lengthNeckToHip, unit: "in" },
        { label: "Shoulder", value: measurements.shoulder, unit: "in" },
      ]
    },
    {
      title: "Hand",
      measurements: [
        { label: "Bicep Width", value: measurements.bicepWidth, unit: "in" },
        { label: "Elbow Width", value: measurements.elbowWidth, unit: "in" },
        { label: "Wrist Width", value: measurements.wristWidth, unit: "in" },
        { label: "Short Sleeve Length", value: measurements.shortSleeveLength, unit: "in" },
        { label: "Elbow Length", value: measurements.elbowLength, unit: "in" },
        { label: "Long Sleeve Length", value: measurements.longSleeveLength, unit: "in" },
      ]
    },
    {
      title: "Lower Body",
      measurements: [
        { label: "Waist", value: measurements.waist, unit: "in" },
        { label: "Hip Width", value: measurements.lowerHipWidth, unit: "in" },
        { label: "Thigh Width", value: measurements.thighWidth, unit: "in" },
        { label: "Knee Width", value: measurements.kneeWidth, unit: "in" },
        { label: "Ankle Width", value: measurements.ankleWidth, unit: "in" },
        { label: "Knee Length (Waist to Knee)", value: measurements.kneeLength, unit: "in" },
        { label: "Ankle Length (Waist to Ankle)", value: measurements.ankleLength, unit: "in" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {section.measurements.map((item) => (
              <div key={item.label} className="flex justify-between items-center px-4 py-3 hover:bg-gray-50">
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className="text-sm font-medium text-gray-900">{item.value} {item.unit}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ActionIcons = ({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) => (
  <div className="flex items-center gap-2">
    <button onClick={onView} className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100" title="View Details">
      <Eye size={16} />
    </button>
    <button onClick={onEdit} className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" title="Edit Measurement">
      <Edit size={16} />
    </button>
    <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" title="Delete Measurement">
      <Trash2 size={16} />
    </button>
  </div>
);

const SlideOver = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) => {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[100] flex ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`ml-auto flex h-full w-full max-w-4xl transform flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors">
            Close
          </button>
        </div>
        <div className="h-[calc(100%-64px)] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

const mapApiToUIMeasurements = (apiData: ApiMeasurement): Measurement["measurements"] => ({
  neck: apiData.neck,
  chest: apiData.chest,
  tummy: apiData.tummy,
  hipWidth: apiData.hipWidth,
  lengthNeckToHip: apiData.neckToHipLength,
  shoulder: apiData.shoulder,
  bicepWidth: apiData.shortSleeveAtBiceps,
  elbowWidth: apiData.midSleeveAtElbow,
  wristWidth: apiData.longSleeveAtWrist,
  shortSleeveLength: apiData.shortSleeveAtBiceps,
  elbowLength: apiData.midSleeveAtElbow,
  longSleeveLength: apiData.longSleeveAtWrist,
  waist: apiData.waist,
  lowerHipWidth: apiData.hipWidth,
  thighWidth: apiData.thigh,
  kneeWidth: apiData.knee,
  ankleWidth: apiData.ankle,
  kneeLength: apiData.trouserLength - 12,
  ankleLength: apiData.trouserLength,
});

const mapApiToUIMeasurement = (apiItem: ApiMeasurement): Measurement => ({
  id: apiItem.tag, // Use tag as id since it's unique per user
  name: apiItem.tag.split('-')[0] || apiItem.tag,
  tag: apiItem.tag,
  description: `${apiItem.tag} measurements`,
  isDefault: apiItem.isDefault,
  measurements: mapApiToUIMeasurements(apiItem)
});

export default function Page() {
  const [showNew, setShowNew] = useState(false);
  const [showDefaultModal, setShowDefaultModal] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
  const [viewingMeasurement, setViewingMeasurement] = useState<Measurement | null>(null);
  const [deletingMeasurement, setDeletingMeasurement] = useState<Measurement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { getUserDetails } = useLocalStorage("userDetails", null);
  const token = getUserDetails()?.accessToken;
  const email = getUserDetails()?.emailAddress;

  // Fetch all measurements - useFetch handles the useEffect internally
  const { data: measurementsData, isLoading: measurementsLoading, callApi: fetchMeasurements } = 
    useFetch("GET", null, `${baseUrL}/get-body-measurement-by-user`);

  // Transform API data to UI format
  const measurements = React.useMemo(() => {
    if (!measurementsData || !Array.isArray(measurementsData)) return [];
    return measurementsData.map((item: ApiMeasurement) => mapApiToUIMeasurement(item));
  }, [measurementsData]);

  const defaultItem = measurements.find(m => m.isDefault);
  const savedItems = measurements.filter(m => !m.isDefault);

  const handleEditDefault = () => {
    if (defaultItem) {
      setEditingMeasurement(defaultItem);
      setShowDefaultModal(false);
      setShowNew(true);
    }
  };

  const handleSaveMeasurement = async (formData: any) => {
    setIsSaving(true);
    try {
      const apiRequest: ApiMeasurement = {
        tag: formData.tag,
        neck: Number(formData.neck),
        shoulder: Number(formData.shoulder),
        chest: Number(formData.chest),
        tummy: Number(formData.tummy),
        hipWidth: Number(formData.hipWidth),
        neckToHipLength: Number(formData.neckToHipLength),
        shortSleeveAtBiceps: Number(formData.shortSleeveAtBiceps),
        midSleeveAtElbow: Number(formData.midSleeveAtElbow),
        longSleeveAtWrist: Number(formData.longSleeveAtWrist),
        waist: Number(formData.waist),
        thigh: Number(formData.thigh),
        knee: Number(formData.knee),
        ankle: Number(formData.ankle),
        trouserLength: Number(formData.trouserLength),
        isDefault: formData.isDefault === 'on'
      };

      const url = editingMeasurement ? `${baseUrL}/update-body-measurement` : `${baseUrL}/create-body-measurement`;
      const method = editingMeasurement ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiRequest),
      });

      if (!response.ok) {
        errorToast(`Failed to ${method === "PUT"? "Update": "Create"}`)
        throw new Error(`HTTP error! status: ${response.status}`);
      } else{
        successToast(`${method === "PUT"? "Updated": "Created"} successfully`)
      }
      
      await fetchMeasurements();
      setShowNew(false);
      setEditingMeasurement(null);
    } catch (error) {
      console.error("Error saving measurement:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingMeasurement || !email) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`${baseUrL}/delete-body-measurement?tag=${deletingMeasurement.tag}&email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok){
          successToast(`Failed to Delete`);
          throw new Error(`HTTP error! status: ${response.status}`);
      } else{
        successToast(`Deleted successfully`);
      }
      
      await fetchMeasurements();
      setDeletingMeasurement(null);
    } catch (error) {
      console.error("Error deleting measurement:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formObject: any = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    handleSaveMeasurement(formObject);
  };

  const handleCloseNew = () => {
    setShowNew(false);
    setEditingMeasurement(null);
  };

  const getFieldDefaultValue = (fieldKey: string) => {
    if (!editingMeasurement?.measurements) return undefined;
    
    const measurements = editingMeasurement.measurements;
    
    const fieldMap: Record<string, keyof typeof measurements> = {
      'neck': 'neck',
      'shoulder': 'shoulder',
      'chest': 'chest',
      'tummy': 'tummy',
      'hipWidth': 'hipWidth',
      'neckToHipLength': 'lengthNeckToHip',
      'shortSleeveAtBiceps': 'shortSleeveLength',
      'midSleeveAtElbow': 'elbowLength',
      'longSleeveAtWrist': 'longSleeveLength',
      'waist': 'waist',
      'thigh': 'thighWidth',
      'knee': 'kneeWidth',
      'ankle': 'ankleWidth',
      'trouserLength': 'ankleLength'
    };
    
    const measurementKey = fieldMap[fieldKey];
    return measurementKey ? measurements[measurementKey] : undefined;
  };

  if (measurementsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading measurements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="w-full max-w-md">
              {/* Empty div to maintain layout */}
            </div>
            <button
              onClick={() => { setEditingMeasurement(null); setShowNew(true); }}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              <Plus size={18} />
              Add New Measurement
            </button>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left column */}
            <div className="space-y-6">
              {/* Default Measurement Card - Always shows if there's a default */}
              {defaultItem && (
                <div className="rounded-2xl border-2 border-gray-900 bg-white p-6 relative">
                  <div className="absolute -top-3 left-4 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <Star size={12} /> DEFAULT
                  </div>
                  <div className="flex items-start justify-between mt-2">
                    <div>
                      <SectionTitle>Default Body Measurement</SectionTitle>
                      <Subtle className="mt-2">This is your personal body measurement</Subtle>
                      {defaultItem.tag && <Subtle className="mt-1">Tag: {defaultItem.tag}</Subtle>}
                    </div>
                    <Chip label="View Details" onClick={() => setShowDefaultModal(true)} />
                  </div>
                </div>
              )}

              {/* Saved Measurements */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-6">
                  <SectionTitle>Saved Measurements</SectionTitle>
                  <Subtle className="mt-2">You can have up to 10 different measurements</Subtle>
                </div>

                {savedItems.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                    <p className="text-sm text-gray-500">No saved measurements yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedItems.map((m) => (
                      <div key={m.id} className="rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{m.name}</div>
                            {m.description && <div className="mt-1 text-sm text-gray-600">{m.description}</div>}
                            {m.tag && <div className="mt-1 text-xs text-gray-500">Tag: {m.tag}</div>}
                          </div>
                          <ActionIcons
                            onView={() => setViewingMeasurement(m)}
                            onEdit={() => { setEditingMeasurement(m); setShowNew(true); }}
                            onDelete={() => setDeletingMeasurement(m)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Image */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center">
              <Image
                src="/images/size-guide.png"
                alt="Size guide"
                width={800}
                height={800}
                priority
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* New/Edit SlideOver */}
      <SlideOver open={showNew} onClose={handleCloseNew}
        title={editingMeasurement ? `Edit ${editingMeasurement.name}` : "New Measurement"}>
        <form onSubmit={handleFormSubmit} key={editingMeasurement?.id || 'new'}>
          <p className="text-sm text-gray-500 mb-6">Measurements in inches</p>

          <div className="space-y-4 mb-8">
            <input 
              name="tag" 
              placeholder="Tag *" 
              required 
              defaultValue={editingMeasurement?.tag || ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none" 
            />
            
            {/* Make Default checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                defaultChecked={editingMeasurement?.isDefault}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Set as default measurement
              </label>
            </div>
          </div>

          {/* Measurement Sections */}
          {[
            {
              title: "Top Body (Torso)",
              fields: [
                { key: "neck", label: "Neck" },
                { key: "shoulder", label: "Shoulder" },
                { key: "chest", label: "Chest" },
                { key: "tummy", label: "Tummy" },
                { key: "hipWidth", label: "Hip Width" },
                { key: "neckToHipLength", label: "Length (Neck to Hip)" },
              ]
            },
            {
              title: "Hand",
              fields: [
                { key: "shortSleeveAtBiceps", label: "Bicep Width" },
                { key: "midSleeveAtElbow", label: "Elbow Width" },
                { key: "longSleeveAtWrist", label: "Wrist Width" },
                { key: "shortSleeveAtBiceps", label: "Short Sleeve Length" },
                { key: "midSleeveAtElbow", label: "Elbow Length" },
                { key: "longSleeveAtWrist", label: "Long Sleeve Length" },
              ]
            },
            {
              title: "Lower Body",
              fields: [
                { key: "waist", label: "Waist" },
                { key: "hipWidth", label: "Hip Width" },
                { key: "thigh", label: "Thigh Width" },
                { key: "knee", label: "Knee Width" },
                { key: "ankle", label: "Ankle Width" },
                { key: "trouserLength", label: "Ankle Length" },
              ]
            }
          ].map((section, index) => (
            <div key={section.title} className={`rounded-xl border border-gray-200 p-6 ${index > 0 ? "mt-6" : ""}`}>
              <h3 className="text-base font-semibold text-gray-900 mb-4">{section.title}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-medium text-gray-700">{field.label} <span className="text-red-500">*</span></label>
                    <div className="relative mt-2">
                      <input
                        name={field.key}
                        type="number"
                        step="0.1"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 pr-10"
                        placeholder="0"
                        defaultValue={getFieldDefaultValue(field.key)}
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">in</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button type="button" onClick={handleCloseNew}
              className="rounded-xl border border-gray-300 px-6 py-3 text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isSaving}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm text-white hover:bg-gray-800 disabled:opacity-50">
              {isSaving ? "Saving..." : (editingMeasurement ? "Update" : "Save")}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* View Modals */}
      <SlideOver open={showDefaultModal} onClose={() => setShowDefaultModal(false)} title="Default Measurement Details">
        {defaultItem && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">{defaultItem.description}</p>
              {defaultItem.tag && <p className="text-sm text-gray-600 mt-2">Tag: {defaultItem.tag}</p>}
            </div>
            <MeasurementTable measurements={defaultItem.measurements} />
            <div className="grid grid-cols-2 gap-4 text-sm pt-4">
              <div><span className="text-gray-500">Status:</span><span className="ml-2 text-gray-900">Default</span></div>
            </div>
            <div className="flex justify-end pt-6 border-t">
              <button onClick={handleEditDefault} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm hover:bg-gray-50">
                <Edit size={16} /> Edit
              </button>
            </div>
          </div>
        )}
      </SlideOver>

      <SlideOver open={!!viewingMeasurement} onClose={() => setViewingMeasurement(null)} title={`${viewingMeasurement?.name} Details`}>
        {viewingMeasurement && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">{viewingMeasurement.description}</p>
              {viewingMeasurement.tag && <p className="text-sm text-gray-600 mt-2">Tag: {viewingMeasurement.tag}</p>}
            </div>
            <MeasurementTable measurements={viewingMeasurement.measurements} />
            <div className="grid grid-cols-2 gap-4 text-sm pt-4">
              <div><span className="text-gray-500">Status:</span><span className="ml-2 text-gray-900">Saved</span></div>
            </div>
            <div className="flex justify-end pt-6 border-t">
              <button onClick={() => { setViewingMeasurement(null); setEditingMeasurement(viewingMeasurement); setShowNew(true); }}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm hover:bg-gray-50">
                <Edit size={16} /> Edit
              </button>
            </div>
          </div>
        )}
      </SlideOver>

      {/* Delete Modal */}
      {deletingMeasurement && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeletingMeasurement(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Delete Measurement</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete <strong>{deletingMeasurement.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setDeletingMeasurement(null)} className="px-4 py-2.5 text-sm border rounded-xl hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} disabled={isDeleting}
                className="px-4 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}