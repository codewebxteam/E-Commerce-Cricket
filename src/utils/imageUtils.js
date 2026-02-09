export const getDirectImageUrl = (url) => {
    if (!url) return "https://placehold.co/600x400?text=No+Image";

    try {
        // Already a direct Google User Content link or placeholder
        if (url.includes("googleusercontent.com") || url.includes("placehold.co")) {
            return url;
        }

        // Pattern 1: /d/FILE_ID (e.g. drive.google.com/file/d/XYZ/view)
        const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match1 && match1[1]) {
            return `https://lh3.googleusercontent.com/d/${match1[1]}`;
        }

        // Pattern 2: id=FILE_ID (e.g. drive.google.com/open?id=XYZ)
        const match2 = url.match(/id=([a-zA-Z0-9_-]+)/);
        if (match2 && match2[1]) {
            return `https://lh3.googleusercontent.com/d/${match2[1]}`;
        }

    } catch (e) {
        console.error("Error parsing image URL", e);
    }
    return url;
};
