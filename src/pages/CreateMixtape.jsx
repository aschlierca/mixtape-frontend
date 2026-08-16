import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { saveToLibrary } from "../api/library";
import Cassette from "../components/Cassette";
import CassettePicker from "../components/CassettePicker";
import StickerPicker from "../components/StickerPicker";
import SongEditor from "../components/SongEditor";
import { Loading, ErrorNotice } from "../components/Status";
import "./MixtapeForm.css";

function randomPlacement() {
    return {
        positionX: 0.25 + Math.random() * 0.5,
        positionY: 0.15 + Math.random() * 0.15,
    };
}

export default function CreateMixtape() {
    const navigate = useNavigate();

    const [cassetteTemplates, setCassetteTemplates] = useState([]);
    const [stickerTemplates, setStickerTemplates] = useState([]);
    const [loadingTemplates, setLoadingTemplates] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [cassetteTemplateId, setCassetteTemplateId] = useState(null);
    const [songs, setSongs] = useState([]);
    const [stickers, setStickers] = useState([]);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        Promise.all([api.getCassetteTemplates(), api.getStickerTemplates()])
            .then(([cassettes, stickerOpts]) => {
                setCassetteTemplates(cassettes);
                setStickerTemplates(stickerOpts);
                if (cassettes.length) setCassetteTemplateId(cassettes[0].id);
            })
            .catch((err) => setLoadError(err.message))
            .finally(() => setLoadingTemplates(false));
    }, []);

    const selectedCassette = cassetteTemplates.find((t) => t.id === cassetteTemplateId) || null;

    const handleAddSticker = useCallback((template) => {
        setStickers((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                stickerTemplateId: template.id,
                imageName: template.imageName,
                ...randomPlacement(),
            },
        ]);
    }, []);

    const handleMoveSticker = useCallback((sticker, x, y) => {
        setStickers((prev) =>
            prev.map((s) => (s.id === sticker.id ? { ...s, positionX: x, positionY: y } : s)),
        );
    }, []);

    const handleRemoveSticker = useCallback((sticker) => {
        setStickers((prev) => prev.filter((s) => s.id !== sticker.id));
    }, []);

    const handleAddSong = useCallback((song) => {
        setSongs((prev) => [...prev, { id: crypto.randomUUID(), ...song }]);
    }, []);

    const handleRemoveSong = useCallback((id) => {
        setSongs((prev) => prev.filter((s) => s.id !== id));
    }, []);

    const handleSubmit = async () => {
        if (!title.trim()) {
            setSubmitError("Give your mixtape a title.");
            return;
        }
        setSubmitting(true);
        setSubmitError("");
        try {
            const result = await api.createMixtape({
                title: title.trim(),
                message: message.trim() || null,
                cassetteTemplateId,
                songs: songs.map(({ title: t, url }) => ({ title: t, url })),
                stickers: stickers.map(({ stickerTemplateId: id, positionX, positionY }) => ({
                    stickerTemplateId: id,
                    positionX,
                    positionY,
                })),
            });
            saveToLibrary({
                id: result.id,
                title: result.title,
                editCode: result.editCode,
                shareCode: result.shareCode,
            });
            navigate(`/mixtapes/${result.id}/created`, { state: { mixtape: result } });
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingTemplates) return <Loading label="Loading templates…" />;
    if (loadError) return <ErrorNotice message={loadError} />;

    return (
        <div className="mixtape-form">
            <h1>Make a mixtape</h1>

            <div className="mixtape-form__layout">
                <div className="mixtape-form__preview">
                    <Cassette
                        cassetteTemplate={selectedCassette}
                        title={title}
                        stickers={stickers}
                        onMoveSticker={handleMoveSticker}
                        onRemoveSticker={handleRemoveSticker}
                    />
                    <p className="muted mixtape-form__hint">Drag stickers to place them.</p>
                </div>

                <div className="mixtape-form__fields">
                    <div className="field">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Songs for a rainy Tuesday"
                            maxLength={120}
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="message">Note</label>
                        <textarea
                            id="message"
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="A little note for whoever's getting this…"
                        />
                    </div>

                    <div className="field">
                        <span className="field__label-text">Cassette color</span>
                        <CassettePicker
                            templates={cassetteTemplates}
                            selectedId={cassetteTemplateId}
                            onSelect={setCassetteTemplateId}
                        />
                    </div>

                    <div className="field">
                        <span className="field__label-text">Stickers</span>
                        <StickerPicker templates={stickerTemplates} onAdd={handleAddSticker} />
                    </div>
                </div>
            </div>

            <div className="panel">
                <h2>Songs</h2>
                <SongEditor songs={songs} onAdd={handleAddSong} onRemove={handleRemoveSong} />
            </div>

            <ErrorNotice message={submitError} />

            <button
                type="button"
                className="btn btn--primary btn--block"
                onClick={handleSubmit}
                disabled={submitting}
            >
                {submitting ? "Creating…" : "Create mixtape"}
            </button>
        </div>
    );
}
