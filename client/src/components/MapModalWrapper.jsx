// MapModalWrapper.jsx
import React, { useState } from 'react';
import OlaMap from './OlaMap';

/**
 * MapModalWrapper handles showing/hiding the map and finding where the user is.
 * It keeps the map alive in the background so it remembers your pin location when hidden.
 */
const MapModalWrapper = ({ onLocationSelected, mapStyle, defaultLat = 18.651710, defaultLng = 73.749372 }) => {
    // Stores the latitude and longitude found by the browser's GPS
    const [browserCoords, setBrowserCoords] = useState(null);

    // Tracks if the map is currently visible on the screen (true) or hidden (false)
    const [isOpen, setIsOpen] = useState(false);

    // Tracks if the map has been loaded at least once so we don't recreate it from scratch
    const [hasInitialized, setHasInitialized] = useState(false);

    // This function runs whenever the user clicks the "Show / Hide Map" button
    const handleToggleMap = () => {
        // If the map is already open, just hide it. No data or map history is lost.
        if (isOpen) {
            setIsOpen(false);
            return;
        }

        // If the map was already created before, just show it again. Don't fetch GPS or run APIs again.
        if (hasInitialized) {
            setIsOpen(true);
            return;
        }

        // If the browser doesn't support location tracking, use the default backup coordinates
        if (!navigator.geolocation) {
            setBrowserCoords({ lat: defaultLat, lng: defaultLng }); // Use default location
            setHasInitialized(true);                                // Mark map as ready
            setIsOpen(true);                                        // Show the map layout
            return;
        }

        // Ask the user's browser/phone for their live GPS location right now
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // If the user says YES to location sharing, save their actual coordinates
                const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
                setBrowserCoords(coords);                               // Save coordinates to load the map here
                setHasInitialized(true);                                // Build the map in the background
                setIsOpen(true);                                        // Open the map on screen
                onLocationSelected(coords.lat, coords.lng);             // Tell AddClub.jsx to fetch the address text
            },
            () => {
                // If the user says NO or GPS fails, safely use the default backup coordinates instead
                setBrowserCoords({ lat: defaultLat, lng: defaultLng }); // Use default location
                setHasInitialized(true);                                // Build the map in the background
                setIsOpen(true);                                        // Open the map on screen
            }
        );
    };

    return (
        // Wrapper container to add spacing inside the form layout
        <div style={{ margin: '15px 0' }}>
            {/* The main button that opens and closes the map view */}
            <button
                type="button"
                onClick={handleToggleMap}
                style={{
                    padding: '10px 16px',
                    backgroundColor: isOpen ? '#E53E3E' : '#3182CE', // Turns RED when open, BLUE when closed
                    color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
                    width: '100%'
                }}
            >
                {/* Changes button text dynamically based on whether map is open or closed */}
                {isOpen ? '❌ Hide Map View' : '📍 Show / Open Map View'}
            </button>

            {/* KEEP ALIVE TRICK: Once the map loads once, keep it in the code forever so it never resets */}
            {hasInitialized && browserCoords && (
                <div style={{
                    marginTop: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    padding: '8px',
                    backgroundColor: '#fafafa',
                    display: isOpen ? 'block' : 'none' // Uses CSS to hide/show instantly without resetting the map
                }}>
                    {/* Simple instruction text for the user */}
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0', textAlign: 'center' }}>
                        Drag the pin to adjust position details.
                    </p>
                    {/* The actual map component, loaded with the initial startup location coordinates */}
                    <OlaMap
                        initialLat={browserCoords.lat}
                        initialLng={browserCoords.lng}
                        onLocationChange={onLocationSelected} // Sends new drag coordinates back up to AddClub.jsx
                        mapStyle={mapStyle}
                    />
                </div>
            )}
        </div>
    );
};

export default MapModalWrapper;