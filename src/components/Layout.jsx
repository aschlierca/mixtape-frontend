import { Link, Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
    return (
        <div className="layout">
            <header className="site-header">
                <Link to="/" className="site-header__brand">
                    <span className="site-header__mark" aria-hidden="true">
                        📼
                    </span>
                    Mixtape
                </Link>
                <nav className="site-header__nav">
                    <Link to="/create" className="btn btn--primary btn--small">
                        New mixtape
                    </Link>
                </nav>
            </header>
            <main className="site-main">
                <Outlet />
            </main>
        </div>
    );
}
