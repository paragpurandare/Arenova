// ─── ADD CLUB ───────────────────────────────────────────────────────────────
// Club registration form with Ola Maps integration. Supports two modes:
//   1. Standalone (default) — renders its own form container + submit button
//   2. Embedded (`embedded` prop) — renders form fields only, for use inside
//      a Modal. The parent Modal provides the title and close button.
//
// The map integration (MapModalWrapper → OlaMap) is fully preserved and works
// identically in both modes. Location data flows: OlaMap → MapModalWrapper →
// handleLocationUpdate → form state → payload on submit.
import React, { useState } from "react";
import MapModalWrapper from "./MapModalWrapper";
import axios from "axios";
import Field from "./ui/Field";
import Input from "./ui/Input";
import Button from "./ui/Button";

const AddClub = ({ embedded = false, onSuccess }) => {
    // Stores all form values. Location fields are populated by the map's
    // reverse-geocode callback and shown as read-only inputs.
    const [form, setForm] = useState({
        clubName: "",
        description: "",
        basePrice: "",
        lat: "",
        lng: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        placeId: "",
        imageUrl: "",
        managementType: "SELF",
        managerName: "",
        managerEmail: "",
        managerPhone: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    // Called by MapModalWrapper when the map pin drops or is dragged. Uses
    // Ola Maps reverse-geocode API to turn lat/lng into structured address.
    const handleLocationUpdate = async (lat, lng) => {
        const apiKey = import.meta.env.VITE_OLAMAPS_API_KEY;
        try {
            const res = await fetch(
                `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${apiKey}`
            );
            const data = await res.json();
            const primaryResult = data.results?.[0];
            const components = primaryResult?.address_components || [];

            const city = components.find((c) => c.types.includes("locality"))?.long_name || "";
            const state = components.find((c) => c.types.includes("administrative_area_level_1"))?.long_name || "";
            const country = components.find((c) => c.types.includes("country"))?.long_name || "";
            const pincode = components.find((c) => c.types.includes("postal_code"))?.long_name || "";

            setForm((prev) => ({
                ...prev,
                lat: lat.toFixed(6),
                lng: lng.toFixed(6),
                address: primaryResult?.formatted_address || "",
                city,
                state,
                country,
                pincode,
                placeId: primaryResult?.place_id || "",
            }));
        } catch (err) {
            console.error("Geocoding fetch failure:", err);
        }
    };

    // Form submission — packages the payload to match the backend ClubRequestDTO
    // and POSTs to /api/clubs. Shows success/error feedback inline.
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFeedback(null);

        const payload = {
            name: form.clubName,
            description: form.description,
            latitude: parseFloat(form.lat) || null,
            longitude: parseFloat(form.lng) || null,
            address: form.address,
            city: form.city,
            state: form.state,
            country: form.country,
            pincode: form.pincode,
            placeId: form.placeId,
            imageUrl: form.imageUrl || "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg",
            basePrice: Number(form.basePrice) || 0,
            ownerId: 1,
            isSelfManaged: form.managementType === "SELF",
            manager: form.managementType === "MANAGER" ? {
                name: form.managerName,
                email: form.managerEmail,
                phone: form.managerPhone,
            } : null,
        };

        try {
            await axios.post("http://localhost:8080/api/clubs", payload);
            setFeedback({ type: "success", msg: "Club registered successfully!" });
            onSuccess?.();
        } catch (err) {
            const msg = err.response?.data?.message || "Server error. Is the backend running?";
            setFeedback({ type: "error", msg });
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Read-only location input factory ────────────────────────────────────
    const readOnlyInput = (placeholder, value) => (
        <Input placeholder={placeholder} value={value} readOnly style={{ background: "#f5f4f0", color: "#888" }} />
    );

    // The form fields are shared between standalone and embedded modes.
    const formFields = (
        <>
            <Field label="Club Name" required>
                <Input
                    placeholder="e.g. Parag Sports Arena"
                    value={form.clubName}
                    onChange={(e) => setForm({ ...form, clubName: e.target.value })}
                    required
                />
            </Field>

            <Field label="Description">
                <Input
                    placeholder="Premium badminton courts, turf, and more"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
            </Field>

            <Field label="Base Price (per hour)">
                <Input
                    type="number"
                    placeholder="350"
                    value={form.basePrice}
                    onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                />
            </Field>

            {/* ─── Management type selector ─── */}
            <Field label="Management Type">
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, managementType: "SELF" })}
                        style={{
                            flex: 1, padding: "10px", borderRadius: "10px",
                            border: form.managementType === "SELF" ? "2px solid #1D9E75" : "1.5px solid #e5e4e7",
                            background: form.managementType === "SELF" ? "#E1F5EE" : "#fff",
                            color: form.managementType === "SELF" ? "#1D9E75" : "#555",
                            fontWeight: 600, fontSize: "13px", cursor: "pointer",
                        }}
                    >
                        👤 Self Managed
                    </button>
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, managementType: "MANAGER" })}
                        style={{
                            flex: 1, padding: "10px", borderRadius: "10px",
                            border: form.managementType === "MANAGER" ? "2px solid #1D9E75" : "1.5px solid #e5e4e7",
                            background: form.managementType === "MANAGER" ? "#E1F5EE" : "#fff",
                            color: form.managementType === "MANAGER" ? "#1D9E75" : "#555",
                            fontWeight: 600, fontSize: "13px", cursor: "pointer",
                        }}
                    >
                        👔 Assign Manager
                    </button>
                </div>
            </Field>

            {/* ─── Conditional manager fields ─── */}
            {form.managementType === "MANAGER" && (
                <div style={{ background: "#faf9f6", padding: "16px", borderRadius: "12px", border: "1px solid #f0ede6", marginBottom: "16px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#3a3a3a", marginBottom: "10px" }}>
                        Manager Information
                    </div>
                    <Field label="Manager Full Name" required>
                        <Input
                            placeholder="Full name"
                            value={form.managerName}
                            onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                            required={form.managementType === "MANAGER"}
                        />
                    </Field>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Field label="Email" required>
                            <Input
                                type="email"
                                placeholder="manager@club.com"
                                value={form.managerEmail}
                                onChange={(e) => setForm({ ...form, managerEmail: e.target.value })}
                                required={form.managementType === "MANAGER"}
                            />
                        </Field>
                        <Field label="Phone">
                            <Input
                                type="tel"
                                placeholder="9876543210"
                                value={form.managerPhone}
                                onChange={(e) => setForm({ ...form, managerPhone: e.target.value })}
                            />
                        </Field>
                    </div>
                </div>
            )}

            {/* ─── Map integration ─── */}
            <Field label="Club Location">
                <MapModalWrapper onLocationSelected={handleLocationUpdate} />
            </Field>

            {/* ─── Read-only coordinates ─── */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                    <Field label="Latitude">{readOnlyInput("Latitude", form.lat)}</Field>
                </div>
                <div style={{ flex: 1 }}>
                    <Field label="Longitude">{readOnlyInput("Longitude", form.lng)}</Field>
                </div>
            </div>

            {/* ─── Read-only address fields ─── */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                    <Field label="City">{readOnlyInput("City", form.city)}</Field>
                </div>
                <div style={{ flex: 1 }}>
                    <Field label="Pincode">{readOnlyInput("Pincode", form.pincode)}</Field>
                </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                    <Field label="State">{readOnlyInput("State", form.state)}</Field>
                </div>
                <div style={{ flex: 1 }}>
                    <Field label="Country">{readOnlyInput("Country", form.country)}</Field>
                </div>
            </div>
            <Field label="Full Address">{readOnlyInput("Full Address", form.address)}</Field>

            {/* ─── Feedback message ─── */}
            {feedback && (
                <div
                    style={{
                        padding: "12px 16px",
                        borderRadius: "10px",
                        marginBottom: "16px",
                        fontSize: "14px",
                        fontWeight: 600,
                        background: feedback.type === "success" ? "#E1F5EE" : "#FCEBEB",
                        color: feedback.type === "success" ? "#0F6E56" : "#A32D2D",
                    }}
                >
                    {feedback.msg}
                </div>
            )}

            {/* ─── Submit button ─── */}
            <Button type="submit" fullWidth size="lg" disabled={submitting}>
                {submitting ? "Saving…" : "Save Club"}
            </Button>
        </>
    );

    // In embedded mode, render just the form fields (the parent Modal provides
    // the container). In standalone mode, wrap in a form with heading.
    if (embedded) {
        return <form onSubmit={handleFormSubmit}>{formFields}</form>;
    }

    return (
        <form
            onSubmit={handleFormSubmit}
            style={{
                maxWidth: "520px",
                margin: "40px auto",
                padding: "32px",
                border: "1px solid #f0ede6",
                borderRadius: "20px",
                background: "#fff",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
        >
            <h2 style={{ textAlign: "center", margin: "0 0 24px", fontSize: "22px", fontWeight: 800, color: "#08060d" }}>
                Register Your Club
            </h2>
            {formFields}
        </form>
    );
};

export default AddClub;
