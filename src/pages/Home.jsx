import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getLibrary, removeFromLibrary } from "../api/library";
import "./Home.css";

export default function Home() {
    const [library, setLibrary] = useState(getLibrary);
    const [shareCodeInput, setShareCodeInput] = useState("");
    const navigate = useNavigate();

    const handleOpenShare = (e) => {
        e.preventDefault();
        const code = shareCodeInput.trim();
        if (code) navigate(`/share/${code}`);
    };

    const handleForget = (id) => {
        removeFromLibrary(id);
        setLibrary(getLibrary());
    };

    return (
        <div className="home">
            <section className="hero-card">
                <h1>Make someone a mixtape</h1>
                <p>
                    Pick some songs, write a note, decorate the case, and send it their way — no
                    account needed.
                </p>
                <Link to="/create" className="btn btn--primary">
                    Start a new mixtape
                </Link>
            </section>

            <section className="panel">
                <h2>Have a share code?</h2>
                <form className="inline-form" onSubmit={handleOpenShare}>
                    <input
                        type="text"
                        placeholder="Paste a share code"
                        value={shareCodeInput}
                        onChange={(e) => setShareCodeInput(e.target.value)}
                        aria-label="Share code"
                    />
                    <button type="submit" className="btn btn--secondary">
                        Open mixtape
                    </button>
                </form>
            </section>

            <section className="panel">
                <h2>Your mixtapes</h2>
                {library.length === 0 && (
                    <p className="muted">
                        Mixtapes you create in this browser will show up here, along with their
                        edit and share links.
                    </p>
                )}
                {library.length > 0 && (
                    <ul className="library-list">
                        {library.map((entry) => (
                            <li key={entry.id} className="library-item">
                                <span className="library-item__title">{entry.title}</span>
                                <div className="library-item__actions">
                                    <Link
                                        to={`/mixtapes/${entry.id}/edit?code=${entry.editCode}`}
                                        className="btn btn--secondary btn--small"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        to={`/share/${entry.shareCode}`}
                                        className="btn btn--secondary btn--small"
                                    >
                                        View
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn btn--ghost btn--small"
                                        onClick={() => handleForget(entry.id)}
                                    >
                                        Remove from list
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
