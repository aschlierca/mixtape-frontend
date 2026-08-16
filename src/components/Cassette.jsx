import { useRef, useCallback } from "react";
import { getCassetteColors, getStickerEmoji } from "./templateArt";
import "./Cassette.css";

function Reel({ cx }) {
    return (
        <g>
            <circle cx={cx} cy="92" r="26" fill="#141318" />
            <circle cx={cx} cy="92" r="24" fill="none" stroke="#3a3842" strokeWidth="1.5" />
            <circle cx={cx} cy="92" r="7" fill="#3a3842" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
                <rect
                    key={angle}
                    x={cx - 1.5}
                    y="72"
                    width="3"
                    height="10"
                    rx="1.5"
                    fill="#3a3842"
                    transform={`rotate(${angle} ${cx} 92)`}
                />
            ))}
        </g>
    );
}

function PlacedSticker({ sticker, imageName, readOnly, onPointerDownDrag, onRemove }) {
    return (
        <div
            className={`placed-sticker${readOnly ? "" : " placed-sticker--editable"}`}
            style={{ left: `${sticker.positionX * 100}%`, top: `${sticker.positionY * 100}%` }}
            onPointerDown={readOnly ? undefined : (e) => onPointerDownDrag(e, sticker)}
            role={readOnly ? undefined : "button"}
            aria-label={readOnly ? undefined : "Drag to reposition sticker"}
        >
            <span className="placed-sticker__emoji">{getStickerEmoji(imageName)}</span>
            {!readOnly && (
                <button
                    type="button"
                    className="placed-sticker__remove"
                    aria-label="Remove sticker"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => onRemove(sticker)}
                >
                    ×
                </button>
            )}
        </div>
    );
}

// stickers: [{ id, positionX, positionY, imageName }]
export default function Cassette({
    cassetteTemplate,
    title,
    stickers = [],
    readOnly = false,
    onMoveSticker,
    onRemoveSticker,
}) {
    const colors = getCassetteColors(cassetteTemplate?.imageName);
    const stageRef = useRef(null);
    const dragState = useRef(null);

    const handlePointerMove = useCallback(
        (e) => {
            const drag = dragState.current;
            if (!drag) return;
            const rect = drag.rect;
            const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
            const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
            drag.lastX = x;
            drag.lastY = y;
            drag.el.style.left = `${x * 100}%`;
            drag.el.style.top = `${y * 100}%`;
        },
        [],
    );

    const handlePointerUp = useCallback(() => {
        const drag = dragState.current;
        if (!drag) return;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        dragState.current = null;
        if (onMoveSticker) onMoveSticker(drag.sticker, drag.lastX, drag.lastY);
    }, [handlePointerMove, onMoveSticker]);

    const handlePointerDownDrag = useCallback(
        (e, sticker) => {
            const stage = stageRef.current;
            if (!stage) return;
            dragState.current = {
                sticker,
                el: e.currentTarget,
                rect: stage.getBoundingClientRect(),
                lastX: sticker.positionX,
                lastY: sticker.positionY,
            };
            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
        },
        [handlePointerMove, handlePointerUp],
    );

    return (
        <div className="cassette-stage" ref={stageRef}>
            <div
                className="cassette-shell"
                style={{ "--shell": colors.shell, "--shade": colors.shade }}
            >
                <svg viewBox="0 0 300 180" className="cassette-svg" aria-hidden="true">
                    <rect x="2" y="2" width="296" height="176" rx="14" fill="var(--shell)" />
                    <rect
                        x="2"
                        y="2"
                        width="296"
                        height="176"
                        rx="14"
                        fill="none"
                        stroke="var(--shade)"
                        strokeWidth="2"
                    />
                    {[16, 284].map((x) => (
                        <circle key={x} cx={x} cy="18" r="4" fill="var(--shade)" />
                    ))}
                    {[16, 284].map((x) => (
                        <circle key={`b-${x}`} cx={x} cy="162" r="4" fill="var(--shade)" />
                    ))}

                    <rect x="60" y="55" width="180" height="74" rx="6" fill="#0f0e12" />
                    <Reel cx={112} />
                    <Reel cx={188} />
                    <rect x="112" y="88" width="76" height="8" rx="4" fill="#0f0e12" />

                    <rect x="30" y="140" width="240" height="26" rx="4" fill={colors.label} />
                </svg>

                <div className="cassette-label" title={title}>
                    {title || "Untitled Mixtape"}
                </div>

                <div className="cassette-stickers">
                    {stickers.map((sticker) => (
                        <PlacedSticker
                            key={sticker.id}
                            sticker={sticker}
                            imageName={sticker.imageName}
                            readOnly={readOnly}
                            onPointerDownDrag={handlePointerDownDrag}
                            onRemove={onRemoveSticker}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
