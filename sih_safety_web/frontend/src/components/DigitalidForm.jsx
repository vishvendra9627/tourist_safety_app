import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DigitalidForm() {
  const navigateto = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    contactInfo: "",
    kyc: "aadhaar",
    aadhaarNumber: "",
    passportCountry: "",
    passportNumber: "",
    emergencyContacts: [
      { name: "", contact: "", relation: "" },
      { name: "", contact: "", relation: "" },
    ],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Auto-fill email from localStorage on mount
  useEffect(() => {
    const emailFromStorage = localStorage.getItem("email") || "";
    setFormData((prev) => ({ ...prev, email: emailFromStorage }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({});
  };

  const handleEmergencyChange = (index, field, value) => {
    const updatedContacts = [...formData.emergencyContacts];
    updatedContacts[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: updatedContacts,
    }));
    setErrors({});
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name must only contain letters.";
    }

    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = "Contact info is required.";
    } else if (!/^\d+$/.test(formData.contactInfo)) {
      newErrors.contactInfo = "Contact must be numeric.";
    }

    if (formData.kyc === "aadhaar") {
      if (!formData.aadhaarNumber.trim()) {
        newErrors.aadhaarNumber = "Aadhaar number is required.";
      } else if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
        newErrors.aadhaarNumber = "Aadhaar must be 12 digits.";
      }
    } else if (formData.kyc === "passport") {
      if (!formData.passportCountry.trim()) {
        newErrors.passportCountry = "Country is required.";
      } else if (!/^[A-Za-z\s]+$/.test(formData.passportCountry)) {
        newErrors.passportCountry = "Country must be letters only.";
      }
      if (!formData.passportNumber.trim()) {
        newErrors.passportNumber = "Passport number is required.";
      } else if (!/^[A-Za-z0-9]+$/.test(formData.passportNumber)) {
        newErrors.passportNumber = "Passport number must be alphanumeric.";
      }
    }

    for (let i = 0; i < formData.emergencyContacts.length; i++) {
      let c = formData.emergencyContacts[i];
      if (!c.name.trim()) {
        newErrors[`emergency-${i}-name`] = "Name is required.";
        break;
      } else if (!/^[A-Za-z\s]+$/.test(c.name)) {
        newErrors[`emergency-${i}-name`] = "Name must be letters only.";
        break;
      }
      if (!c.contact.trim()) {
        newErrors[`emergency-${i}-contact`] = "Contact is required.";
        break;
      } else if (!/^\d+$/.test(c.contact)) {
        newErrors[`emergency-${i}-contact`] = "Contact must be numeric.";
        break;
      }
      if (!c.relation.trim()) {
        newErrors[`emergency-${i}-relation`] = "Relation is required.";
        break;
      } else if (!/^[A-Za-z\s]+$/.test(c.relation)) {
        newErrors[`emergency-${i}-relation`] = "Relation must be letters only.";
        break;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setLoading(true);
  setSuccess("");
  try {
    const token = localStorage.getItem("token"); // Get token from localStorage
    const res = await fetch("http://localhost:5000/api/digital-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token in header
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }
    setSuccess("✅ Digital ID created successfully!");

    // Save complete digital ID object in localStorage as string
    localStorage.setItem("digitalIdData", JSON.stringify(data.data));
    console.log("Stored Digital ID in localStorage:", JSON.parse(localStorage.getItem("digitalIdData")));

    setFormData({
      email: localStorage.getItem("email") || "",
      name: "",
      contactInfo: "",
      kyc: "aadhaar",
      aadhaarNumber: "",
      passportCountry: "",
      passportNumber: "",
      emergencyContacts: [
        { name: "", contact: "", relation: "" },
        { name: "", contact: "", relation: "" },
      ],
    });
    navigateto(-1);
  } catch (error) {
    setErrors({ api: error.message });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-blue-200"
      >
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Create Your Digital ID
        </h2>
        {/* Backend error or Success */}
        {errors.api && (
          <p className="text-red-600 text-center mb-4">{errors.api}</p>
        )}
        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            className={`mt-1 block w-full rounded-lg border p-2 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.email}
            readOnly
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            className={`mt-1 block w-full rounded-lg border p-2 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Contact Info */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Contact Info
          </label>
          <input
            type="text"
            name="contactInfo"
            className={`mt-1 block w-full rounded-lg border p-2 ${
              errors.contactInfo ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.contactInfo}
            onChange={handleChange}
          />
          {errors.contactInfo && (
            <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>
          )}
        </div>

        {/* KYC Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            KYC Type
          </label>
          <select
            name="kyc"
            value={formData.kyc}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 p-2"
          >
            <option value="aadhaar">Aadhaar</option>
            <option value="passport">Passport</option>
          </select>
        </div>

        {/* Aadhaar */}
        {formData.kyc === "aadhaar" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Aadhaar Number
            </label>
            <input
              type="text"
              name="aadhaarNumber"
              className={`mt-1 block w-full rounded-lg border p-2 ${
                errors.aadhaarNumber ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.aadhaarNumber}
              onChange={handleChange}
            />
            {errors.aadhaarNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.aadhaarNumber}
              </p>
            )}
          </div>
        )}

        {/* Passport */}
        {formData.kyc === "passport" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Passport Country
              </label>
              <input
                type="text"
                name="passportCountry"
                className={`mt-1 block w-full rounded-lg border p-2 ${
                  errors.passportCountry ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.passportCountry}
                onChange={handleChange}
              />
              {errors.passportCountry && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passportCountry}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Passport Number
              </label>
              <input
                type="text"
                name="passportNumber"
                className={`mt-1 block w-full rounded-lg border p-2 ${
                  errors.passportNumber ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.passportNumber}
                onChange={handleChange}
              />
              {errors.passportNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passportNumber}
                </p>
              )}
            </div>
          </>
        )}

        {/* Emergency Contacts */}
        <h3 className="text-lg font-semibold mt-6 mb-2">
          Emergency Contacts
        </h3>
        {formData.emergencyContacts.map((c, i) => (
          <div key={i} className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              className={`rounded-lg border p-2 ${
                errors[`emergency-${i}-name`] ? "border-red-500" : "border-gray-300"
              }`}
              value={c.name}
              onChange={(e) => handleEmergencyChange(i, "name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Contact"
              className={`rounded-lg border p-2 ${
                errors[`emergency-${i}-contact`] ? "border-red-500" : "border-gray-300"
              }`}
              value={c.contact}
              onChange={(e) => handleEmergencyChange(i, "contact", e.target.value)}
            />
            <input
              type="text"
              placeholder="Relation"
              className={`rounded-lg border p-2 ${
                errors[`emergency-${i}-relation`] ? "border-red-500" : "border-gray-300"
              }`}
              value={c.relation}
              onChange={(e) => handleEmergencyChange(i, "relation", e.target.value)}
            />
          </div>
        ))}

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 font-bold rounded-lg shadow-md transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Digital ID"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DigitalidForm;
