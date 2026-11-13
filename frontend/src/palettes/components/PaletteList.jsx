import { useEffect, useState } from "react";
import { PaletteCard } from "./PaletteCard.jsx";
import styles from "./PaletteList.module.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const PaletteList = ({ colorId }) => {
    const [palettes, setPalettes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadPalettes() {
            try {
                const response = await fetch(
                    `${apiUrl}/api/palettes?color_id=${encodeURIComponent(colorId)}`
                );

                if (response.status === 400 || response.status === 404) {
                    if (!ignore) {
                        setError("色を選び直してください。");
                    }
                } else if (!response.ok) {
                    throw new Error("配色の取得に失敗しました");
                } else {
                    const data = await response.json();

                    if (!ignore) {
                        setPalettes(data);
                    }
                }
            } catch {
                if (!ignore) {
                    setError("配色を取得できませんでした。");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadPalettes();

        return () => {
            ignore = true;
        };
    }, [colorId]);

    if (loading) {
        return <p className={styles.status} role="status">読み込み中…</p>;
    } else if (error) {
        return <p className={styles.status} role="alert">{error}</p>;
    } else if (palettes.length === 0) {
        return <p className={styles.status}>該当する配色がありません。</p>;
    } else {
        return (
            <ul className={styles.list} aria-label="配色一覧">
                {palettes.map((palette, index) => (
                    <li key={palette.id} className={styles.item}>
                        <PaletteCard
                            palette={palette}
                            number={index + 1}
                            colorId={colorId}
                        />
                    </li>
                ))}
            </ul>
        );
    }
};
