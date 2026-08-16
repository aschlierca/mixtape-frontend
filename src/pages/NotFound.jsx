import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="status" style={{ textAlign: "center", padding: "60px 0" }}>
            <h1>Page not found</h1>
            <p className="muted">That mixtape or page doesn't exist.</p>
            <p style={{ marginTop: 16 }}>
                <Link to="/" className="btn btn--primary">
                    Go home
                </Link>
            </p>
        </div>
    );
}
