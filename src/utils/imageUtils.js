export const getDirectImageUrl = (url) => {
    if (!url) return "";
    try {
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            return `https://lh3.googleusercontent.com/d/${match[1]}`;
        }
    } catch (e) {
        console.error("Error parsing image URL", e);
    }
    return url;
};
