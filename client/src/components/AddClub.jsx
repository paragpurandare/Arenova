// AddClub.jsx
import React, { useState } from 'react';
import MapModalWrapper from './MapModalWrapper';
import axios from 'axios';

/**
 * AddClub Component: The primary registration form.
 * It coordinates text inputs, manages the local data state, processes detailed geographic addresses 
 * from Ola Maps, handles manager dynamic assignments, and packages everything into a backend payload ready for submission.
 */
const AddClub = () => {
    // Stores all form values, separating individual location details for fine-grained database queries
    const [form, setForm] = useState({
        clubName: '',
        description: '',
        basePrice: '',
        lat: '',
        lng: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        placeId: '',     // 🚀 NEW: Keeps Ola's unique location ID tracker
        imageUrl: '...', // Default placeholder value for image slots

        // 🚀 Manager Assignment State Fields
        managementType: 'SELF', // 'SELF' or 'MANAGER'
        managerName: '',
        managerEmail: '',
        managerPhone: ''
    });

    // Automatically runs when the map pin drops to turn coordinates into textual addresses
    const handleLocationUpdate = async (lat, lng) => {
        const apiKey = import.meta.env.VITE_OLAMAPS_API_KEY;
        try {
            // Sends the coordinates to Ola's API servers to lookup the exact physical location breakdown
            const res = await fetch(`https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${apiKey}`);
            const data = await res.json();
            const primaryResult = data.results?.[0];

            // Safely extracts the deep geographic sub-elements array provided by the API response
            const components = primaryResult?.address_components || [];

            // Individual filters searching through array flags to pull out exact administrative categories
            const city = components.find(c => c.types.includes('locality'))?.long_name || '';
            const state = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '';
            const country = components.find(c => c.types.includes('country'))?.long_name || '';
            const pincode = components.find(c => c.types.includes('postal_code'))?.long_name || '';

            // Updates the tracking state, cleanly filling out the separate location data slots
            setForm(prev => ({
                ...prev,
                lat: lat.toFixed(6), // Standardizes coordinates to a clean 6-decimal number format
                lng: lng.toFixed(6),
                address: primaryResult?.formatted_address || '',
                city: city,
                state: state,
                country: country,
                pincode: pincode,
                placeId: primaryResult?.place_id || '' // Saves the tracking reference code for precision searches
            }));
        } catch (err) {
            console.error("Geocoding fetch failure:", err);
        }
    };

    // Form submission processing block triggered by the submit button event
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Constructs the final high-precision object matching your exact database schema layout
        // Package includes nested manager details if managementType is set to 'MANAGER'
        const payload = {
            name: form.clubName,
            description: form.description,
            latitude: parseFloat(form.lat),
            longitude: parseFloat(form.lng),
            address: form.address,
            city: form.city,
            state: form.state,
            country: form.country,
            pincode: form.pincode,
            placeId: form.placeId,
            imageUrl: form.imageUrl,
            basePrice: Number(form.basePrice), // Ensures the pricing field enters your DB as a clean Number format
            ownerId: 1, // Static mock owner identification key (To be integrated dynamically later)

            // 🚀 Optional Manager Details payload chunk sent to backend for transactional creation/upsert
            isSelfManaged: form.managementType === 'SELF',
            manager: form.managementType === 'MANAGER' ? {
                name: form.managerName,
                email: form.managerEmail,
                phone: form.managerPhone
            } : null
        };

        // Logs out the packaged final object to show your database parameters are cleanly formatted
        console.log("Submitting this clean object payload to your Backend DB route:", payload);
        axios.post("http://localhost:8080/api/clubs", payload)
            .then((result) => {
                // Spring Boot returns the created club object if successful
                if (result.data && result.data.id) {
                    console.log("Club Added Successfully:", result.data);
                    alert("Club registered successfully!");
                } else {
                    console.log("Server responded, but payload layout was unexpected.");
                }
            })
            .catch((err) => {
                // 🚀 This block safely captures database issues, valid token missing, or network down errors
                console.error("Error in inserting club:", err.response?.data || err.message);
                alert("Failed to insert club: " + (err.response?.data?.message || "Server Error"));
            });
    };

    return (
        // The core visible layout form module wrapper container box
        <form onSubmit={handleFormSubmit} style={{ maxWidth: '450px', margin: '40px auto', padding: '20px', border: '1px solid #eee', borderRadius: '12px', fontFamily: 'sans-serif' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 16px 0' }}>Register Your Club</h3>

            {/* Input layout slot updating your Club Name field state parameter */}
            <input
                placeholder="Club Name *"
                value={form.clubName}
                onChange={e => setForm({ ...form, clubName: e.target.value })}
                style={{ width: '100%', padding: '10px', margin: '8px 0', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
                required
            />

            {/* NEW Input field layout targeting description state strings */}
            <textarea
                placeholder="Club Description (e.g. Premium badminton courts)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ width: '100%', padding: '10px', margin: '8px 0', height: '60px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
            />

            {/* NEW Input field layout tracking Base Booking Prices exclusively */}
            <input
                placeholder="Base Price (per hour)"
                type="number"
                value={form.basePrice}
                onChange={e => setForm({ ...form, basePrice: e.target.value })}
                style={{ width: '100%', padding: '10px', margin: '8px 0', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
            />

            {/* 🚀 MANAGEMENT TYPE SELECTION BUTTONS */}
            <div style={{ margin: '12px 0 8px 0' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>
                    Management Type
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, managementType: 'SELF' })}
                        style={{
                            flex: 1,
                            padding: '9px',
                            borderRadius: '6px',
                            border: form.managementType === 'SELF' ? '2px solid #2f855a' : '1px solid #ccc',
                            background: form.managementType === 'SELF' ? '#f0fff4' : '#fff',
                            color: form.managementType === 'SELF' ? '#2f855a' : '#555',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        👤 Self Managed
                    </button>
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, managementType: 'MANAGER' })}
                        style={{
                            flex: 1,
                            padding: '9px',
                            borderRadius: '6px',
                            border: form.managementType === 'MANAGER' ? '2px solid #2f855a' : '1px solid #ccc',
                            background: form.managementType === 'MANAGER' ? '#f0fff4' : '#fff',
                            color: form.managementType === 'MANAGER' ? '#2f855a' : '#555',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        👔 Assign Manager
                    </button>
                </div>
            </div>

            {/* 🚀 CONDITIONALLY RENDERED MANAGER CONTACT DETAILS INPUTS */}
            {form.managementType === 'MANAGER' && (
                <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '8px 0' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '6px' }}>
                        Manager Information
                    </span>
                    <input
                        placeholder="Manager Full Name *"
                        value={form.managerName}
                        onChange={e => setForm({ ...form, managerName: e.target.value })}
                        style={{ width: '100%', padding: '9px', margin: '4px 0', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
                        required={form.managementType === 'MANAGER'}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            placeholder="Email *"
                            type="email"
                            value={form.managerEmail}
                            onChange={e => setForm({ ...form, managerEmail: e.target.value })}
                            style={{ flex: 1, padding: '9px', margin: '4px 0', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
                            required={form.managementType === 'MANAGER'}
                        />
                        <input
                            placeholder="Phone Number"
                            type="tel"
                            value={form.managerPhone}
                            onChange={e => setForm({ ...form, managerPhone: e.target.value })}
                            style={{ flex: 1, padding: '9px', margin: '4px 0', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
                        />
                    </div>
                </div>
            )}

            {/* Binds your map integration framework tool right into the middle of your form */}
            <MapModalWrapper onLocationSelected={handleLocationUpdate} />

            {/* Read-Only text fields tracking coordinates passed up out of the map framework dynamically */}
            <div style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
                <input placeholder="Latitude" value={form.lat} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '6px' }} />
                <input placeholder="Longitude" value={form.lng} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '6px' }} />
            </div>

            {/* Grid rows updating structural details like City, State, and Area Pincode fields dynamically */}
            <div style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
                <input placeholder="City" value={form.city} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '6px' }} />
                <input placeholder="Pincode" value={form.pincode} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '6px' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
                <input placeholder="State" value={form.state} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '6px' }} />
                <input placeholder="Country" value={form.country} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '6px' }} />
            </div>

            {/* Comprehensive readout area block containing the text summary description address value */}
            <textarea placeholder="Full Address" value={form.address} readOnly style={{ width: '100%', padding: '10px', margin: '8px 0', background: '#f0f0f0', border: '1px solid #ccc', height: '60px', boxSizing: 'border-box', borderRadius: '6px', resize: 'none' }} />

            {/* Execution activation element triggering the master onSubmit function handling your data mapping route hooks */}
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#2f855a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                Save Club
            </button>
        </form>
    );
};

export default AddClub;