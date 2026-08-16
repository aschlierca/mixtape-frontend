const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ApiError extends Error {
    constructor(message, status, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

async function request(path, { method = "GET", body, editCode } = {}) {
    const headers = {};
    if (body) headers["Content-Type"] = "application/json";
    if (editCode) headers["x-edit-code"] = editCode;

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) return null;

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message = data?.error || `Request failed with status ${res.status}`;
        throw new ApiError(message, res.status, data?.details);
    }

    return data;
}

export const api = {
    getCassetteTemplates: () => request("/cassette-templates"),
    getStickerTemplates: () => request("/sticker-templates"),

    createMixtape: (payload) => request("/mixtapes", { method: "POST", body: payload }),
    getMixtapeByShareCode: (shareCode) => request(`/mixtapes/share/${shareCode}`),
    getMixtape: (id, editCode) => request(`/mixtapes/${id}`, { editCode }),
    updateMixtape: (id, editCode, payload) =>
        request(`/mixtapes/${id}`, { method: "PATCH", body: payload, editCode }),
    deleteMixtape: (id, editCode) => request(`/mixtapes/${id}`, { method: "DELETE", editCode }),

    addSong: (id, editCode, payload) =>
        request(`/mixtapes/${id}/songs`, { method: "POST", body: payload, editCode }),
    updateSong: (id, songId, editCode, payload) =>
        request(`/mixtapes/${id}/songs/${songId}`, { method: "PATCH", body: payload, editCode }),
    deleteSong: (id, songId, editCode) =>
        request(`/mixtapes/${id}/songs/${songId}`, { method: "DELETE", editCode }),

    addSticker: (id, editCode, payload) =>
        request(`/mixtapes/${id}/stickers`, { method: "POST", body: payload, editCode }),
    updateSticker: (id, stickerId, editCode, payload) =>
        request(`/mixtapes/${id}/stickers/${stickerId}`, {
            method: "PATCH",
            body: payload,
            editCode,
        }),
    deleteSticker: (id, stickerId, editCode) =>
        request(`/mixtapes/${id}/stickers/${stickerId}`, { method: "DELETE", editCode }),
};

export { ApiError };
