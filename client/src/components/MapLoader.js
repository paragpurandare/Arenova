let isLoaded = false;

export const loadOlaMapsSDK = () => {
    if (isLoaded && window.OlaMaps) {
        return Promise.resolve(window.OlaMaps);
    }

    return new Promise((resolve, reject) => {
        const existing = document.getElementById("olamaps-sdk");

        if (existing) {
            // If it exists but is still loading, wait for it
            existing.onload = () => resolve(window.OlaMaps);
            existing.onerror = reject;
            return;
        }

        // 1. Inject mandatory CSS layout files for map graphics
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json';
        document.head.appendChild(link);

        // 2. Build the actual Ola Maps bundle script
        const script = document.createElement("script");
        script.id = "olamaps-sdk";
        script.src = 'https://unpkg.com/olamaps-web-sdk@latest/dist/olamaps-web-sdk.umd.js';
        script.async = true;

        script.onload = () => {
            isLoaded = true;
            resolve(window.OlaMaps); // Pass the global Ola SDK back to the component
        };

        script.onerror = () => {
            reject(new Error("Failed to load Ola Maps SDK assets."));
        };

        document.head.appendChild(script);
    });
};