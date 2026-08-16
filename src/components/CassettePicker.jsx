import { getCassetteColors } from "./templateArt";
import "./Picker.css";

export default function CassettePicker({ templates, selectedId, onSelect }) {
    return (
        <div className="picker-grid picker-grid--cassette">
            {templates.map((template) => {
                const colors = getCassetteColors(template.imageName);
                const selected = template.id === selectedId;
                return (
                    <button
                        type="button"
                        key={template.id}
                        className={`swatch${selected ? " swatch--selected" : ""}`}
                        style={{ background: colors.shell }}
                        onClick={() => onSelect(template.id)}
                        aria-pressed={selected}
                        title={template.name}
                    >
                        <span className="swatch__label">{template.name}</span>
                    </button>
                );
            })}
        </div>
    );
}
