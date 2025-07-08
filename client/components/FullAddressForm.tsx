import React, { useState } from "react";

// List of Indian states for the dropdown
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

type AddressFormState = {
  fullName: string;
  mobile: string;
  house: string;
  street: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pin: string;
  college: string;
  isHostel: boolean;
};

const initialState: AddressFormState = {
  fullName: "",
  mobile: "",
  house: "",
  street: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  pin: "",
  college: "",
  isHostel: false,
};

export default function FullAddressForm() {
  const [form, setForm] = useState(initialState);

  // Check if all required fields are filled
  const isFormValid =
    form.fullName.trim() &&
    form.mobile.trim().length === 10 &&
    form.house.trim() &&
    form.street.trim() &&
    form.city.trim() &&
    form.district.trim() &&
    form.state &&
    form.pin.trim().length === 6 &&
    form.college.trim();

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

  // TODO: Add location API integration here (Google Maps, Shiprocket, etc.)

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
        <h2 className="text-xl font-bold mb-2 text-center">Enter Your Full Address</h2>
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
        {/* House / Flat No. & Building Name */}
        <div>
          <label className="block text-sm font-medium mb-1">House / Flat No. & Building Name</label>
          <input
            type="text"
            name="house"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="House/Flat No., Building Name"
            value={form.house}
            onChange={handleChange}
            autoComplete="address-line1"
          />
        </div>
        {/* Street / Area / Locality */}
        <div>
          <label className="block text-sm font-medium mb-1">Street / Area / Locality</label>
          <input
            type="text"
            name="street"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Street, Area, Locality"
            value={form.street}
            onChange={handleChange}
            autoComplete="address-line2"
          />
        </div>
        {/* Landmark (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">Landmark <span className="text-gray-400">(optional)</span></label>
          <input
            type="text"
            name="landmark"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Nearby landmark (optional)"
            value={form.landmark}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        {/* City / Town */}
        <div>
          <label className="block text-sm font-medium mb-1">City / Town</label>
          <input
            type="text"
            name="city"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="City or Town"
            value={form.city}
            onChange={handleChange}
            autoComplete="address-level2"
          />
        </div>
        {/* District */}
        <div>
          <label className="block text-sm font-medium mb-1">District</label>
          <input
            type="text"
            name="district"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="District"
            value={form.district}
            onChange={handleChange}
            autoComplete="address-level2"
          />
        </div>
        {/* State */}
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <select
            name="state"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            value={form.state}
            onChange={handleChange}
            autoComplete="address-level1"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
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
          <p className="text-xs text-gray-500 mt-1">
            We'll verify your delivery is within 50 km radius of your college later.
          </p>
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
            // TODO: Auto-fill from user profile if available
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
        {/* TODO: Add location API here (Google Maps, Shiprocket, validation, etc.) */}
        <button
          className={`w-full mt-4 py-2 rounded-lg font-semibold text-white transition ${
            isFormValid
              ? "bg-primary hover:bg-primary/90"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          Save Address
        </button>
      </div>
    </div>
  );
} 