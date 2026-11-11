import { Link } from "react-router";
import styles from "./PaletteCard.module.css";

export const PaletteCard = ({ palette, number }) => {
    return (
        <Link to={`/palettes/${palette.id}`} className={styles.card}>
            <span className={styles.cardNumber}>
                PALETTE {String(number).padStart(2, "0")}
            </span>
            <div className={styles.paletteBar} aria-hidden="true">
                <div
                    style={{
                        backgroundColor: palette.base_color.hex_code,
                        width: `${palette.base_ratio}%`
                    }}
                />
                <div
                    style={{
                        backgroundColor: palette.sub_color.hex_code,
                        width: `${palette.sub_ratio}%`
                    }}
                />
                <div
                    style={{
                        backgroundColor: palette.accent_color.hex_code,
                        width: `${palette.accent_ratio}%`
                    }}
                />
            </div>
            <div className={styles.legend}>
                <PaletteColor
                    label="Base"
                    color={palette.base_color}
                    ratio={palette.base_ratio}
                />
                <PaletteColor
                    label="Sub"
                    color={palette.sub_color}
                    ratio={palette.sub_ratio}
                />
                <PaletteColor
                    label="Accent"
                    color={palette.accent_color}
                    ratio={palette.accent_ratio}
                />
            </div>
        </Link>
    );
};

function PaletteColor({ label, color, ratio }) {
    return (
        <div className={styles.colorGroup} role="group" aria-label={label}>
            <p>{label}</p>
            <p>{color.name}</p>
            <p>{ratio}%</p>
        </div>
    );
}
