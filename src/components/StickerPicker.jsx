import { getStickerEmoji } from "./templateArt";
import "./Picker.css";

export default function StickerPicker({ templates, onAdd }) {
    return (
        <div className="picker-grid picker-grid--sticker">
            {templates.map((template) => (
                <button
                    type="button"
                    key={template.id}
                    className="sticker-option"
                    onClick={() => onAdd(template)}
                    title={`Add ${template.name} sticker`}
                >
                    <span className="sticker-option__emoji">
                        {getStickerEmoji(template.imageName)}
                    </span>
                    <span className="sticker-option__label">{template.name}</span>
                </button>
            ))}
        </div>
    );
}
