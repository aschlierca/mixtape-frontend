import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { getLibrary, saveToLibrary, removeFromLibrary } from "../api/library";
import Cassette from "../components/Cassette";
import CassettePicker from "../components/CassettePicker";
import StickerPicker from "../components/StickerPicker";
import SongEditor from "../components/SongEditor";
import CopyField from "../components/CopyField";
import { Loading, ErrorNotice } from "../components/Status";
import "./MixtapeForm.css";
import "./EditMixtape.css";

function EditCodePrompt({ onSubmit, error }) {
    const [code, setCode] = useState("");
    return (
        <div className="panel edit-code-prompt">
            <h2>Enter your edit code</h2>
            <p className="muted">This mixtape's edit code wasn't found in this browser.</p>
            <form
                className="inline-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(code.trim());
                }}
            >
                <input
                    type="text"
                    placeholder="Edit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoFocus
                />
                <button type="submit" className="btn btn--primary">
                    Unlock
                </button>
            </form>
            <ErrorNotice message={error} />
        </div>
    );
}

export default function EditMixtape() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [editCode, setEditCode] = useState(
        () => searchParams.get("code") || getLibrary().find((e) => String(e.id) === id)?.editCode || "",
    );
    const [authError, setAuthError] = useState("");

    const [cassetteTemplates, setCassetteTemplates] = useState([]);
    const [stickerTemplates, setStickerTemplates] = useState([]);

    const [mixtape, setMixtape] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [cassetteTemplateId, setCassetteTemplateId] = useState(null);
    const [savingDetails, setSavingDetails] = useState(false);
    const [detailsSaved, setDetailsSaved] = useState(false);

    const load = useCallback(() => {
        if (!editCode) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setAuthError("");
        Promise.all([api.getMixtape(id, editCode), api.getCassetteTemplates(), api.getStickerTemplates()])
            .then(([data, cassettes, stickerOpts]) => {
                setMixtape(data);
                setCassetteTemplates(cassettes);
                setStickerTemplates(stickerOpts);
                setTitle(data.title);
                setMessage(data.message || "");
                setCassetteTemplateId(data.cassetteTemplateId);
                saveToLibrary({
                    id: data.id,
                    title: data.title,
                    editCode: data.editCode,
                    shareCode: data.shareCode,
                });
            })
            .catch((err) => {
                if (err.status === 403) {
                    setAuthError("That edit code doesn't match this mixtape.");
                } else {
                    setError(err.message);
                }
            })
            .finally(() => setLoading(false));
    }, [id, editCode]);

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, editCode]);

    const songs = mixtape?.Songs || [];
    const stickers = (mixtape?.Stickers || []).map((s) => ({
        ...s,
        imageName: s.StickerTemplate?.imageName,
    }));
    const selectedCassette = cassetteTemplates.find((t) => t.id === cassetteTemplateId) || null;

    const handleSaveDetails = async (e) => {
        e.preventDefault();
        setSavingDetails(true);
        setError("");
        try {
            const updated = await api.updateMixtape(id, editCode, {
                title: title.trim(),
                message: message.trim() || null,
                cassetteTemplateId,
            });
            setMixtape((prev) => ({ ...prev, ...updated }));
            saveToLibrary({
                id: updated.id,
                title: updated.title,
                editCode,
                shareCode: updated.shareCode,
            });
            setDetailsSaved(true);
            setTimeout(() => setDetailsSaved(false), 1800);
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingDetails(false);
        }
    };

    const handleAddSong = async (song) => {
        try {
            const created = await api.addSong(id, editCode, song);
            setMixtape((prev) => ({ ...prev, Songs: [...(prev.Songs || []), created] }));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRemoveSong = async (songId) => {
        try {
            await api.deleteSong(id, editCode, songId);
            setMixtape((prev) => ({
                ...prev,
                Songs: (prev.Songs || []).filter((s) => s.id !== songId),
            }));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddSticker = async (template) => {
        try {
            const created = await api.addSticker(id, editCode, {
                stickerTemplateId: template.id,
                positionX: 0.25 + Math.random() * 0.5,
                positionY: 0.15 + Math.random() * 0.15,
            });
            setMixtape((prev) => ({
                ...prev,
                Stickers: [
                    ...(prev.Stickers || []),
                    { ...created, StickerTemplate: template },
                ],
            }));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleMoveSticker = async (sticker, x, y) => {
        setMixtape((prev) => ({
            ...prev,
            Stickers: (prev.Stickers || []).map((s) =>
                s.id === sticker.id ? { ...s, positionX: x, positionY: y } : s,
            ),
        }));
        try {
            await api.updateSticker(id, sticker.id, editCode, { positionX: x, positionY: y });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRemoveSticker = async (sticker) => {
        try {
            await api.deleteSticker(id, sticker.id, editCode);
            setMixtape((prev) => ({
                ...prev,
                Stickers: (prev.Stickers || []).filter((s) => s.id !== sticker.id),
            }));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteMixtape = async () => {
        if (!window.confirm(`Delete "${mixtape.title}"? This can't be undone.`)) return;
        try {
            await api.deleteMixtape(id, editCode);
            removeFromLibrary(id);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    if (!editCode || authError) {
        return (
            <EditCodePrompt
                error={authError}
                onSubmit={(code) => {
                    setAuthError("");
                    setEditCode(code);
                }}
            />
        );
    }

    if (loading) return <Loading label="Loading your mixtape…" />;
    if (error && !mixtape) return <ErrorNotice message={error} />;
    if (!mixtape) return null;

    const shareLink = `${window.location.origin}/share/${mixtape.shareCode}`;

    return (
        <div className="mixtape-form">
            <div className="edit-header">
                <h1>Edit mixtape</h1>
                <button type="button" className="btn btn--danger btn--small" onClick={handleDeleteMixtape}>
                    Delete mixtape
                </button>
            </div>

            <div className="panel">
                <CopyField label="Share link (view only)" value={shareLink} />
            </div>

            <form className="mixtape-form__layout" onSubmit={handleSaveDetails}>
                <div className="mixtape-form__preview">
                    <Cassette
                        cassetteTemplate={selectedCassette}
                        title={title}
                        stickers={stickers}
                        onMoveSticker={handleMoveSticker}
                        onRemoveSticker={handleRemoveSticker}
                    />
                    <p className="muted mixtape-form__hint">Drag stickers to reposition them.</p>
                </div>

                <div className="mixtape-form__fields">
                    <div className="field">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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

                    <button type="submit" className="btn btn--primary" disabled={savingDetails}>
                        {savingDetails ? "Saving…" : detailsSaved ? "Saved!" : "Save details"}
                    </button>
                </div>
            </form>

            <div className="panel">
                <h2>Songs</h2>
                <SongEditor songs={songs} onAdd={handleAddSong} onRemove={handleRemoveSong} />
            </div>

            <ErrorNotice message={error} />
        </div>
    );
}
