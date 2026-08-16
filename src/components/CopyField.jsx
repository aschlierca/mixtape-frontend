import { useState } from "react";
import "./CopyField.css";

export default function CopyField({ label, value }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // clipboard API unavailable — user can still select the text manually
        }
    };

    return (
        <div className="copy-field">
            {label && <span className="copy-field__label">{label}</span>}
            <div className="copy-field__row">
                <input type="text" readOnly value={value} onFocus={(e) => e.target.select()} />
                <button type="button" className="btn btn--secondary" onClick={handleCopy}>
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
        </div>
    );
}
