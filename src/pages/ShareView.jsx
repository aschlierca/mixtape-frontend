import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import Cassette from "../components/Cassette";
import { Loading, ErrorNotice } from "../components/Status";
import "./ShareView.css";

export default function ShareView() {
    const { shareCode } = useParams();
    const [mixtape, setMixtape] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setError("");
        api.getMixtapeByShareCode(shareCode)
            .then(setMixtape)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [shareCode]);

    if (loading) return <Loading label="Loading mixtape…" />;
    if (error) return <ErrorNotice message={error} />;
    if (!mixtape) return null;

    return (
        <div className="share-view">
            <Cassette
                cassetteTemplate={mixtape.CassetteTemplate}
                title={mixtape.title}
                stickers={(mixtape.Stickers || []).map((s) => ({
                    ...s,
                    imageName: s.StickerTemplate?.imageName,
                }))}
                readOnly
            />

            <h1>{mixtape.title}</h1>

            {mixtape.message && <p className="share-view__note">{mixtape.message}</p>}

            <div className="panel share-view__songs">
                <h2>Tracklist</h2>
                {(mixtape.Songs || []).length === 0 && (
                    <p className="muted">No songs on this mixtape yet.</p>
                )}
                {(mixtape.Songs || []).length > 0 && (
                    <ol className="tracklist">
                        {mixtape.Songs.map((song) => (
                            <li key={song.id}>
                                <a href={song.url} target="_blank" rel="noreferrer">
                                    {song.title}
                                </a>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    );
}
