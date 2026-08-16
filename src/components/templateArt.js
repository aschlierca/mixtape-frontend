// The backend only stores template metadata (name + imageName) — there's no
// image upload/CDN yet, so the frontend renders each template as CSS/SVG art
// keyed off imageName. Swap this out once real artwork exists.

const CASSETTE_COLORS = {
    "cassette-black.png": { shell: "#2b2a2e", shade: "#1a191c", label: "#f4f1ea" },
    "cassette-red.png": { shell: "#b8433f", shade: "#8f2f2c", label: "#fdf3ee" },
    "cassette-blue.png": { shell: "#3f5f8a", shade: "#2c4666", label: "#eef4fb" },
    "cassette-clear.png": { shell: "#d8d4e6cc", shade: "#b8b2cf99", label: "#2b2a2e" },
};

const DEFAULT_CASSETTE = { shell: "#6b6375", shade: "#4d4757", label: "#f4f1ea" };

export function getCassetteColors(imageName) {
    return CASSETTE_COLORS[imageName] || DEFAULT_CASSETTE;
}

const STICKER_EMOJI = {
    "sticker-star.png": "⭐",
    "sticker-heart.png": "❤️",
    "sticker-smiley.png": "😊",
    "sticker-lightning.png": "⚡",
};

export function getStickerEmoji(imageName) {
    return STICKER_EMOJI[imageName] || "🏷️";
}
