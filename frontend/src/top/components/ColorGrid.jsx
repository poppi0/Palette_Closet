import { useEffect, useState } from "react";
import tones from "../tones.json";
import styles from "../App.module.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const hueOrder = ["レッド", "オレンジ", "イエロー", "グリーン", "ブルー", "パープル"];
const achromaticOrder = ["ホワイト", "グレー", "ブラック"];

function orderColors(colors, displayOrder) {
    const orderedColors = [];

    for (const name of displayOrder) {
        const color = colors.find((color) => color.name === name);

        if (color) {
            orderedColors.push(color);
        }
    }

    const otherColors = colors.filter(
        (color) => !displayOrder.includes(color.name)
    );

    return orderedColors.concat(otherColors);
}

function useFetchColors() {
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function loadColors() {
            try {
                const response = await fetch(`${apiUrl}/api/colors`);

                if (!response.ok) {
                    throw new Error("色データの取得に失敗しました");
                }

                const data = await response.json();

                if (!ignore) {
                    setColors(data);
                }
            } catch {
                if (!ignore) {
                    setError(true);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadColors();

        return () => {
            ignore = true;
        };
    }, []);

    return { colors, loading, error };
}

function ColorButtons({ colors, onSelectColor }) {
    return (
        <div className={styles.colorList}>
            {colors.map((color) => (
                <button
                    key={color.id}
                    type="button"
                    className={styles.colorButton}
                    style={{ backgroundColor: color.hex_code }}
                    aria-label={color.name}
                    onClick={() => onSelectColor(color)}
                />
            ))}
        </div>
    );
}

export const ColorGrid = ({ onSelectColor }) => {
    const { colors, loading, error } = useFetchColors();
    const achromaticColors = colors.filter((color) => color.tone === null);
    const orderedAchromaticColors = orderColors(achromaticColors, achromaticOrder);

    return (
        <div className={styles.toneGrid}>
            {loading && (
                <p className={styles.colorStatus} role="status">読み込み中…</p>
            )}
            {error && (
                <p className={styles.colorStatus} role="alert">
                    色データを取得できませんでした。
                </p>
            )}

            {tones.map((tone) => {
                const colorsInTone = colors.filter(
                    (color) => color.tone?.name === tone.name
                );
                const namesInOrder = hueOrder.map((hue) => `${tone.name}${hue}`);
                const orderedColorsInTone = orderColors(colorsInTone, namesInOrder);

                return (
                    <fieldset key={tone.name} className={styles.toneCard}>
                        <legend>{tone.name}</legend>
                        <p>{tone.description}</p>
                        <ColorButtons colors={orderedColorsInTone} onSelectColor={onSelectColor} />
                    </fieldset>
                );
            })}

            <fieldset className={styles.achromaticColors}>
                <legend>無彩色</legend>
                <ColorButtons colors={orderedAchromaticColors} onSelectColor={onSelectColor} />
            </fieldset>
        </div>
    );
};
