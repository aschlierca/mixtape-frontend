import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { api } from "../api/client";
import { getLibrary } from "../api/library";
import Cassette from "../components/Cassette";
import CopyField from "../components/CopyField";
import { Loading, ErrorNotice } from "../components/Status";
import "./CreatedSuccess.css";

export default function CreatedSuccess() {
    const { id } = useParams();
    const location = useLocation();

    const [mixtape, setMixtape] = useState(location.state?.mixtape || null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (mixtape) return;
        const entry = getLibrary().find((e) => String(e.id) === id);
        if (!entry) {
            setError("We don't have the codes for this mixtape in this browser.");
            return;
        }
        api.getMixtape(id, entry.editCode).then(setMixtape).catch((err) => setError(err.message));
    }, [id, mixtape]);

    if (error) return <ErrorNotice message={error} />;
    if (!mixtape) return <Loading />;

    const shareLink = `${window.location.origin}/share/${mixtape.shareCode}`;
    const editLink = `${window.location.origin}/mixtapes/${mixtape.id}/edit?code=${mixtape.editCode}`;

    return (
        <div className="created">
            <h1>Your mixtape is ready</h1>
            <p className="muted">Send the share link to whoever it's for.</p>

            <Cassette
                cassetteTemplate={mixtape.CassetteTemplate}
                title={mixtape.title}
                stickers={(mixtape.Stickers || []).map((s) => ({
                    ...s,
                    imageName: s.StickerTemplate?.imageName,
                }))}
                readOnly
            />

            <div className="created__codes">
                <CopyField label="Share link (view only)" value={shareLink} />
                <CopyField label="Edit link (keep this private)" value={editLink} />
            </div>

            <div className="created__actions">
                <Link to={`/share/${mixtape.shareCode}`} className="btn btn--secondary">
                    View mixtape
                </Link>
                <Link
                    to={`/mixtapes/${mixtape.id}/edit?code=${mixtape.editCode}`}
                    className="btn btn--primary"
                >
                    Keep editing
                </Link>
            </div>
        </div>
    );
}
