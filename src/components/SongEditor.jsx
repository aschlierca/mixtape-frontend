import { useState } from "react";
import "./SongEditor.css";

export default function SongEditor({ songs, onAdd, onRemove, readOnly = false }) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");

    const handleAdd = (e) => {
        e.preventDefault();
        if (!title.trim() || !url.trim()) return;
        onAdd({ title: title.trim(), url: url.trim() });
        setTitle("");
        setUrl("");
    };

    return (
        <div className="song-editor">
            {songs.length > 0 && (
                <ol className="song-list">
                    {songs.map((song, i) => (
                        <li key={song.id} className="song-row">
                            <span className="song-row__index">{i + 1}</span>
                            <div className="song-row__info">
                                <a
                                    href={song.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="song-row__title"
                                >
                                    {song.title}
                                </a>
                                <span className="song-row__url">{song.url}</span>
                            </div>
                            {!readOnly && (
                                <button
                                    type="button"
                                    className="song-row__remove"
                                    aria-label={`Remove ${song.title}`}
                                    onClick={() => onRemove(song.id)}
                                >
                                    ×
                                </button>
                            )}
                        </li>
                    ))}
                </ol>
            )}

            {songs.length === 0 && (
                <p className="song-editor__empty">No songs yet — add your first track below.</p>
            )}

            {!readOnly && (
                <form className="song-editor__form" onSubmit={handleAdd}>
                    <input
                        type="text"
                        placeholder="Song title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        aria-label="Song title"
                    />
                    <input
                        type="url"
                        placeholder="Link (Spotify, YouTube, etc.)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        aria-label="Song link"
                    />
                    <button type="submit" className="btn btn--secondary">
                        Add song
                    </button>
                </form>
            )}
        </div>
    );
}
