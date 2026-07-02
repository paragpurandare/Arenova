// OlaMap.jsx
import React, { useEffect, useState, useRef } from 'react';
import { loadOlaMapsSDK } from './MapLoader';

/**
 * OlaMap Component: The low-level graphics canvas engine.
 * Its only responsibility is to paint the map tiles, display a draggable marker pin, 
 * and pass raw tracking numbers (lat/lng) back up when the user drags the pin.
 */
const OlaMap = ({ initialLat, initialLng, onLocationChange, mapStyle }) => {
    // A standard React DOM reference to target the HTML element where the canvas layer gets painted
    const mapContainerRef = useRef(null);

    // A mutable persistence reference that stores the active SDK instance without triggering re-renders
    const mapInstanceRef = useRef(null);

    // Stores the active map marker pinning instance so we can modify or track it later
    const markerInstanceRef = useRef(null);

    // Local state to display a "Loading..." screen overlay while the internet fetches cloud assets
    const [loading, setLoading] = useState(true);

    // Keep the parental callback hook wrapped inside a mutable ref to handle parent state changes safely
    const onLocationChangeRef = useRef(onLocationChange);
    useEffect(() => {
        // Syncs the ref seamlessly whenever the main AddClub form updates or alters its structure
        onLocationChangeRef.current = onLocationChange;
    }, [onLocationChange]);

    // Primary lifecycle effect hook: handles downloading, rendering, tracking, and tearing down the map engine
    useEffect(() => {
        // Tracking flag to prevent data updates if the user closes the map mid-download
        let isMounted = true;

        // Grabs the credentials key securely out of your project's local environment files (.env)
        const apiKey = import.meta.env.VITE_OLAMAPS_API_KEY;

        // Triggers the background dynamic script loader helper tool to load Ola's remote core files
        loadOlaMapsSDK()
            .then((OlaMapsSDK) => {
                // Defensive guard check: Stop initialization if component was unmounted or already has a map running
                if (!isMounted || mapInstanceRef.current) return;

                // Creates a authenticated connection client instance passing your personal developer token
                const olaMaps = new OlaMapsSDK({ apiKey: apiKey });

                // Falls back to a standard Light style schema string link if a custom map theme prop isn't specified
                const chosenStyle = mapStyle || `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=${apiKey}`;

                // Spawns and configures the main interactive map engine inside the browser DOM element
                const map = olaMaps.init({
                    style: chosenStyle,                 // Applies the layout layout look/theme
                    container: mapContainerRef.current, // Points exactly to our canvas container ref below
                    center: [initialLng, initialLat],   // Sets default startup viewpoint [Longitude, Latitude]
                    zoom: 16,                            // Focuses close enough to see individual streets and buildings
                    validateStyle: false,               // Bypasses internal 3D layer errors on Ola's asset servers
                });

                // Saves the fresh canvas engine instance into a reference variable to make it accessible app-wide
                mapInstanceRef.current = map;

                // Event listener to catch and clear texture mapping alerts from polluting the dev console
                map.on('styleimagemissing', (e) => {
                    if (e.id === 'ola-mbo') {
                        const canvas = document.createElement('canvas');
                        canvas.width = 1; canvas.height = 1;
                        map.addImage('ola-mbo', canvas.getContext('2d').getImageData(0, 0, 1, 1));
                    }
                });

                // Crucial Map Lifecycle Event: Waits until all textures and geometry resolve before setting markers
                map.on('load', () => {
                    // Safety check: Don't paint markers or change state if the user closed the window while waiting
                    if (!isMounted) return;

                    // Dynamically creates a standard HTML div element using standard browser Javascript
                    const customMarkerElement = document.createElement('div');
                    customMarkerElement.className = 'custom-pinpoint-wrapper';

                    // Injects our modern styling element layers into the wrapper div container
                    customMarkerElement.innerHTML = `
                        <div class="pin-pulse-ring"></div>
                        <div class="pin-core-dot"></div>
                    `;

                    // Safety configuration layout injection block: creates shared styling variables only once
                    if (!document.getElementById('map-pin-styles')) {
                        const styleTag = document.createElement('style');
                        styleTag.id = 'map-pin-styles';
                        styleTag.innerHTML = `
                            .custom-pinpoint-wrapper {
                                position: relative;
                                width: 40px;
                                height: 40px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: grab;
                            }
                            .pin-core-dot {
                                width: 14px;
                                height: 14px;
                                background-color: #E53E3E;
                                border: 3px solid #FFFFFF;
                                border-radius: 50%;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                                z-index: 2;
                                transition: transform 0.1s ease;
                            }
                            .pin-pulse-ring {
                                position: absolute;
                                width: 36px;
                                height: 36px;
                                border: 2px solid rgba(229, 62, 62, 0.6);
                                background-color: rgba(229, 62, 62, 0.15);
                                border-radius: 50%;
                                z-index: 1;
                                transform: scale(1);
                                transition: transform 0.2s ease, opacity 0.2s ease;
                            }
                            .custom-pinpoint-wrapper:active .pin-core-dot { transform: scale(1.3); }
                            .custom-pinpoint-wrapper:active .pin-pulse-ring {
                                transform: scale(1.8);
                                background-color: rgba(229, 62, 62, 0.05);
                            }
                        `;
                        document.head.appendChild(styleTag); // Merges pin style sheets cleanly into your index.html head
                    }

                    // Configures the pin settings and binds our custom html style into the SDK canvas layer
                    const marker = olaMaps
                        .addMarker({
                            element: customMarkerElement, // Applies our custom HTML div UI design element
                            draggable: true,             // Explicitly unlocks crosshair dragging interactions
                        })
                        .setLngLat([initialLng, initialLat]) // Drops the initial pin center on the user's location coordinates
                        .addTo(map);                         // Physically locks the element onto the active viewport surface

                    // Cache marker reference so it doesn't get swept away by memory collection engines
                    markerInstanceRef.current = marker;

                    // INTERACTION LISTENER: Triggers every single time a user finishes dragging and releases the pin
                    marker.on('dragend', () => {
                        // Extracts the fresh numerical coordinates where the drop event occurred
                        const { lng, lat } = marker.getLngLat();

                        // Bubbles those updated numbers out of the engine, into the wrapper, and directly up to AddClub form state
                        if (onLocationChangeRef.current) {
                            onLocationChangeRef.current(lat, lng);
                        }
                    });

                    // Turns off the loading interface screen and presents the active map setup
                    setLoading(false);
                });
            })
            .catch((err) => console.error("Error building map canvas:", err));

        // RESIZE MONITOR MECHANISM: Solves the blank/squished map glitch caused by CSS 'display: none' toggles
        const resizeObserver = new ResizeObserver(() => {
            if (mapInstanceRef.current) {
                // Signals the graphics processor to instantly calculate canvas size adjustments when unhidden
                mapInstanceRef.current.resize();
            }
        });

        // Tells the resize tracker tool to watch the layout boundary changes of our container div box
        if (mapContainerRef.current) {
            resizeObserver.observe(mapContainerRef.current);
        }

        // React Component Cleanup Hook: Runs automatically when the entire module gets destroyed
        return () => {
            isMounted = false; // Prevents background state operations on unmounted code blocks
            if (resizeObserver) {
                resizeObserver.disconnect(); // Completely stops the dimension monitor tracking loops
            }
            if (mapInstanceRef.current) {
                // Safe destruction check: Clears graphics parameters out of your computer's RAM memory pools
                if (typeof mapInstanceRef.current.remove === 'function') {
                    mapInstanceRef.current.remove();
                }
                mapInstanceRef.current = null;
            }
        };
    }, [mapStyle]); // Monitors theme parameters—automatically adjusts canvas tiles if a dark style is dynamically applied

    return (
        // Wrapper container box that houses the inner canvas layer and manages loading screen alignments
        <div style={{ position: 'relative', width: '100%', height: '350px' }}>
            {/* Conditional loading screen layout displayed exclusively while assets are streaming across the wire */}
            {loading && (
                <div style={{ position: 'absolute', zIndex: 10, background: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    Loading Interactive Map...
                </div>
            )}
            {/* The primary rendering container block that our useRef element targets during initialization */}
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }} />
        </div>
    );
};

export default OlaMap;