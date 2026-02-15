export const getDirectImageUrl = (url) => {
    if (!url || typeof url !== 'string') return "https://placehold.co/600x400?text=No+Image";

    try {
        // Check if direct link
        if (url.includes("googleusercontent.com") || url.includes("placehold.co")) {
            return url;
        }

        // Google Drive path format
        const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match1 && match1[1]) {
            return `https://lh3.googleusercontent.com/d/${match1[1]}`;
        }

        // Google Drive query format
        const match2 = url.match(/id=([a-zA-Z0-9_-]+)/);
        if (match2 && match2[1]) {
            return `https://lh3.googleusercontent.com/d/${match2[1]}`;
        }

    } catch (e) {
        console.error("Error parsing image URL", e);
    }
    return url;
};
