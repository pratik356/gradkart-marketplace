"use client"
import React, { useEffect, useRef, useState } from "react";

type AddressFields = {
  fullName: string;
  mobile: string;
  college: string;
  isHostel: boolean;
  house: string;
  area: string;
  city: string;
  state: string;
  pin: string;
};

const initialState: AddressFields = {
  fullName: "",
  mobile: "",
  college: "",
  isHostel: false,
  house: "",
  area: "",
  city: "",
  state: "",
  pin: "",
};

const isClient = typeof window !== "undefined";

export default function LeafletAddressForm({ onSave }: { onSave?: () => void } = {}) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<AddressFields>(initialState);
  const [markerPos, setMarkerPos] = useState<[number, number]>([28.6139, 77.209]); // Default: Delhi
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Required fields for Save button
  const isFormValid =
    form.fullName.trim() &&
    form.mobile.trim().length === 10 &&
    form.college.trim() &&
    form.house.trim() &&
    form.area.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.pin.trim().length === 6;

  // Initialize map and marker (client only)
  useEffect(() => {
    if (!mounted || !isClient) return;
    // Inject Leaflet CSS if not already present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css';
      document.head.appendChild(link);
    }
    // Dynamically import leaflet only on client
    import("leaflet").then(L => {
      if (mapRef.current) return;
      // Fix default marker icon issue in Leaflet + Webpack
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
      const map = L.map("leaflet-map", {
        center: markerPos,
        zoom: 16,
        scrollWheelZoom: true,
      });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      const marker = L.marker(markerPos, { draggable: true }).addTo(map);
      markerRef.current = marker;
      marker.on("dragend", async (e: any) => {
        const latlng = marker.getLatLng();
        setMarkerPos([latlng.lat, latlng.lng]);
        await fetchAddress(latlng.lat, latlng.lng);
      });
      setMapLoaded(true);
      // Initial reverse geocode
      fetchAddress(markerPos[0], markerPos[1]);
      // Clean up on unmount
      return () => {
        map.remove();
        mapRef.current = null;
        markerRef.current = null;
      };
    });
    // eslint-disable-next-line
  }, [mounted]);

  // Update marker position if markerPos changes
  useEffect(() => {
    if (!mounted) return;
    if (
      markerRef.current &&
      mapRef.current &&
      mapRef.current.getContainer()
    ) {
      markerRef.current.setLatLng(markerPos);
      mapRef.current.setView(markerPos);
    }
  }, [markerPos, mounted]);

  // Reverse geocode using Nominatim
  async function fetchAddress(lat: number, lon: number) {
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
      const res = await fetch(url, {
        headers: { "User-Agent": "GradKartGo/1.0" },
      });
      const data = await res.json();
      const address = data.address || {};

      setForm((prev) => ({
        ...prev,
        house: address.house_number || address.building || "",
        area:
          address.suburb ||
          address.neighbourhood ||
          address.village ||
          address.town ||
          address.road ||
          "",
        city: address.city || address.town || address.village || "",
        state: address.state || "",
        pin: address.postcode || "",
      }));
    } catch (e) {
      // Optionally show error
    }
    setLoading(false);
  }

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Save address handler
  const handleSave = () => {
    if (!isFormValid || loading) return;
    setLoading(true);
    try {
      // Compose address object
      const addressObj = {
        id: Date.now().toString(),
        name: form.fullName,
        phone: form.mobile,
        address: `${form.house}, ${form.area}, ${form.city}, ${form.state} - ${form.pin}`,
        city: form.city,
        state: form.state,
        pincode: form.pin,
        college: form.college,
        isHostel: form.isHostel,
        lat: markerPos[0],
        lng: markerPos[1],
        // Optionally add more fields as needed
      };
      // Get current addresses
      let addresses: any[] = [];
      if (isClient) {
        const saved = localStorage.getItem("userAddresses");
        if (saved) addresses = JSON.parse(saved);
        addresses.push(addressObj);
        localStorage.setItem("userAddresses", JSON.stringify(addresses));
      }
      // Show toast (if available)
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast.success("Address saved!");
      }
      // Optionally call onSave
      if (onSave) onSave();
      // Optionally reset form or redirect
    } catch (e) {
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast.error("Failed to save address");
      }
    }
    setLoading(false);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
        <h2 className="text-xl font-bold mb-2 text-center">Enter Your Full Address</h2>
        {/* Map */}
        <div className="mb-4">
          <div
            id="leaflet-map"
            className="w-full rounded-lg"
            style={{ height: 400, minHeight: 300 }}
          />
          <p className="text-xs text-gray-500 mt-2">
            Drag the marker to your address. The form will autofill from the map.
          </p>
        </div>
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>
        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number</label>
          <div className="flex items-center">
            <span className="px-3 py-2 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500 select-none">+91</span>
            <input
              type="tel"
              name="mobile"
              className="w-full border border-l-0 rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={e => {
                // Only allow numbers, max 10 digits
                const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                setForm(prev => ({ ...prev, mobile: val }));
              }}
              autoComplete="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
            />
          </div>
        </div>
        {/* College Name */}
        <div>
          <label className="block text-sm font-medium mb-1">College Name</label>
          <input
            type="text"
            name="college"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="College Name"
            value={form.college}
            onChange={handleChange}
            autoComplete="organization"
          />
        </div>
        {/* Hostel Address Toggle */}
        <div className="flex items-center justify-between mt-2">
          <label className="text-sm font-medium">Is this your hostel address?</label>
          <input
            type="checkbox"
            name="isHostel"
            checked={form.isHostel}
            onChange={handleChange}
            className="w-5 h-5 accent-primary"
          />
        </div>
        {/* House / Flat No. */}
        <div>
          <label className="block text-sm font-medium mb-1">House / Flat No.</label>
          <input
            type="text"
            name="house"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="House/Flat No."
            value={form.house}
            onChange={handleChange}
            autoComplete="address-line1"
          />
        </div>
        {/* Area / Locality */}
        <div>
          <label className="block text-sm font-medium mb-1">Area / Locality</label>
          <input
            type="text"
            name="area"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Area, Locality"
            value={form.area}
            onChange={handleChange}
            autoComplete="address-line2"
          />
        </div>
        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            name="city"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            autoComplete="address-level2"
          />
        </div>
        {/* State */}
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            type="text"
            name="state"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            autoComplete="address-level1"
          />
        </div>
        {/* PIN Code */}
        <div>
          <label className="block text-sm font-medium mb-1">PIN Code</label>
          <input
            type="tel"
            name="pin"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="6-digit PIN code"
            value={form.pin}
            onChange={e => {
              // Only allow numbers, max 6 digits
              const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
              setForm(prev => ({ ...prev, pin: val }));
            }}
            autoComplete="postal-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
          />
        </div>
        <button
          className={`w-full mt-4 py-2 rounded-lg font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
            isFormValid && !loading
              ? "bg-primary hover:bg-primary/90"
              : "bg-gray-300"
          }`}
          disabled={!isFormValid || loading}
          aria-busy={loading}
          aria-disabled={!isFormValid || loading}
          onClick={handleSave}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            "Save Address"
          )}
        </button>
      </div>
    </div>
  );
} 