// AddClub.jsx
import React, { useState } from 'react';
import MapModalWrapper from './MapModalWrapper';
import axios from 'axios';


/**
 * AddClub Component: The primary registration form.
 * It coordinates text inputs, manages the local data state, processes detailed geographic addresses 
 * from Ola Maps, and packages everything into a backend payload ready for submission.
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
        imageUrl: '...'  // Default placeholder value for image slots
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
            ownerId: 1 // Static mock owner identification key (To be integrated dynamically later)
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
        <form onSubmit={handleFormSubmit} style={{ maxWidth: '450px', margin: '40px auto', padding: '20px', border: '1px solid #eee', borderRadius: '12px' }}>
            <h3 style={{ textAlign: 'center' }}>Register Your Club</h3>

            {/* Input layout slot updating your Club Name field state parameter */}
            <input
                placeholder="Club Name"
                value={form.clubName}
                onChange={e => setForm({ ...form, clubName: e.target.value })}
                style={{ width: '100%', padding: '10px', margin: '8px 0', boxSizing: 'border-box' }}
            />

            {/* NEW Input field layout targeting description state strings */}
            <textarea
                placeholder="Club Description (e.g. Premium badminton courts)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ width: '100%', padding: '10px', margin: '8px 0', height: '60px', boxSizing: 'border-box' }}
            />

            {/* NEW Input field layout tracking Base Booking Prices exclusively */}
            <input
                placeholder="Base Price (per hour)"
                type="number"
                value={form.basePrice}
                onChange={e => setForm({ ...form, basePrice: e.target.value })}
                style={{ width: '100%', padding: '10px', margin: '8px 0', boxSizing: 'border-box' }}
            />

            {/* Binds your map integration framework tool right into the middle of your form */}
            <MapModalWrapper onLocationSelected={handleLocationUpdate} />

            {/* Read-Only text fields tracking coordinates passed up out of the map framework dynamically */}
            <div style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
                <input placeholder="Latitude" value={form.lat} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc' }} />
                <input placeholder="Longitude" value={form.lng} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc' }} />
            </div>

            {/* Grid rows updating structural details like City, State, and Area Pincode fields dynamically */}
            <div style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
                <input placeholder="City" value={form.city} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc' }} />
                <input placeholder="Pincode" value={form.pincode} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
                <input placeholder="State" value={form.state} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc' }} />
                <input placeholder="Country" value={form.country} readOnly style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: '1px solid #ccc' }} />
            </div>

            {/* Comprehensive readout area block containing the text summary description address value */}
            <textarea placeholder="Full Address" value={form.address} readOnly style={{ width: '100%', padding: '10px', margin: '8px 0', background: '#f0f0f0', border: '1px solid #ccc', height: '60px', boxSizing: 'border-box' }} />

            {/* Execution activation element triggering the master onSubmit function handling your data mapping route hooks */}
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#2f855a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                Save Club
            </button>
        </form>
    );
};

export default AddClub;