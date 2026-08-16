export function Loading({ label = "Loading…" }) {
    return <p className="status status--loading">{label}</p>;
}

export function ErrorNotice({ message }) {
    if (!message) return null;
    return <p className="status status--error">{message}</p>;
}
