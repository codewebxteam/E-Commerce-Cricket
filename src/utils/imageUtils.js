export const getDirectImageUrl = (url) => {
    if (!url || typeof url !== 'string') return "https://placehold.co/600x400?text=No+Image";

    try {
        // Check if already an ImageKit URL or placeholder
        if (url.includes("ik.imagekit.io") || url.includes("placehold.co")) {
            return url;
        }

        const imageKitEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
        console.log("Debug ImageKit: ", { url, imageKitEndpoint }); // DEBUG LOG

        // 1. Handle Firebase Storage URLs (New Upload System)
        if (url.includes("firebasestorage.googleapis.com") && imageKitEndpoint) {
            const endpoint = imageKitEndpoint.endsWith('/') ? imageKitEndpoint.slice(0, -1) : imageKitEndpoint;
            // Prepend ImageKit endpoint to use it as a proxy/optimizer
            const finalUrl = `${endpoint}/${url}`;
            console.log("Debug Firebase -> IK URL: ", finalUrl);
            return finalUrl;
        }

        // 2. Handle Google Drive URLs (Legacy Support)
        // Helper to extract Drive ID
        const getDriveId = (link) => {
            const match1 = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match1 && match1[1]) return match1[1];

            const match2 = link.match(/id=([a-zA-Z0-9_-]+)/);
            if (match2 && match2[1]) return match2[1];

            return null;
        };

        const driveId = getDriveId(url);
        console.log("Debug DriveID: ", driveId); // DEBUG LOG

        // If we have a Drive ID and ImageKit is configured
        if (driveId && imageKitEndpoint && imageKitEndpoint.includes("ik.imagekit.io")) {
            // Remove trailing slash if present
            const endpoint = imageKitEndpoint.endsWith('/') ? imageKitEndpoint.slice(0, -1) : imageKitEndpoint;
            const finalUrl = `${endpoint}/${driveId}`;
            console.log("Debug Drive -> IK URL: ", finalUrl); // DEBUG LOG
            return finalUrl;
        }

        // Fallback: Use Google's direct link format if ImageKit is not set up
        if (driveId) {
            return `https://lh3.googleusercontent.com/d/${driveId}`;
        }

    } catch (e) {
        console.error("Error parsing image URL", e);
    }
    return url;
};
