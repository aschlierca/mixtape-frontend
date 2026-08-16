// Tracks mixtapes this browser has created, since the app has no accounts.
// A mixtape is "owned" by whoever holds its editCode, so we just remember
// the codes locally to power the "My Mixtapes" list.
const STORAGE_KEY = "mixtape:library";

function readLibrary() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeLibrary(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getLibrary() {
    return readLibrary().sort((a, b) => b.savedAt - a.savedAt);
}

export function saveToLibrary({ id, title, editCode, shareCode }) {
    const entries = readLibrary().filter((entry) => String(entry.id) !== String(id));
    entries.push({ id, title, editCode, shareCode, savedAt: Date.now() });
    writeLibrary(entries);
}

export function removeFromLibrary(id) {
    writeLibrary(readLibrary().filter((entry) => String(entry.id) !== String(id)));
}

export function updateLibraryTitle(id, title) {
    const entries = readLibrary();
    const entry = entries.find((e) => String(e.id) === String(id));
    if (entry) {
        entry.title = title;
        writeLibrary(entries);
    }
}
