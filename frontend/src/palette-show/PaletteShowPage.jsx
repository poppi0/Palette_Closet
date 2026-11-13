import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import styles from "./PaletteShowPage.module.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const PaletteShowPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const colorId = searchParams.get("color_id");
    const [palette, setPalette] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadPalette() {
            setLoading(true);
            setError("");
            setPalette(null);

            try {
                const response = await fetch(
                    `${apiUrl}/api/palettes/${encodeURIComponent(id)}`
                );

                if (response.status === 400) {
                    if (!ignore) {
                        setError("配色IDが正しくありません。");
                    }
                } else if (response.status === 404) {
                    if (!ignore) {
                        setError("配色が見つかりません。");
                    }
                } else if (!response.ok) {
                    throw new Error("配色の取得に失敗しました");
                } else {
                    const data = await response.json();

                    if (!ignore) {
                        setPalette(data);
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

        loadPalette();

        return () => {
            ignore = true;
        };
    }, [id]);

    let backLink;

    if (colorId) {
        backLink = (
            <Link
                to={`/palettes?color_id=${encodeURIComponent(colorId)}`}
                className={styles.backLink}
            >
                一覧に戻る
            </Link>
        );
    } else {
        backLink = <Link to="/" className={styles.backLink}>色を選ぶ</Link>;
    }

    let content;

    if (loading) {
        content = <p className={styles.status} role="status">読み込み中…</p>;
    } else if (error) {
        content = (
            <div className={styles.errorContent}>
                <p className={styles.status} role="alert">{error}</p>
                {backLink}
            </div>
        );
    } else {
        content = (
            <>
                <h1>配色詳細</h1>
                <p className={styles.paletteNames}>
                    {palette.base_color.name} × {palette.sub_color.name} × {palette.accent_color.name}
                </p>

                <div className={styles.balanceLayout}>
                    <div className={styles.paletteBar} aria-hidden="true">
                        <div
                            className={styles.barColor}
                            style={{
                                backgroundColor: palette.base_color.hex_code,
                                flexGrow: palette.base_ratio
                            }}
                        />
                        <div
                            className={styles.barColor}
                            style={{
                                backgroundColor: palette.sub_color.hex_code,
                                flexGrow: palette.sub_ratio
                            }}
                        />
                        <div
                            className={styles.barColor}
                            style={{
                                backgroundColor: palette.accent_color.hex_code,
                                flexGrow: palette.accent_ratio
                            }}
                        />
                    </div>

                    <div className={styles.detailsColumn}>
                        <section className={styles.ratioPanel} aria-labelledby="ratio-heading">
                            <h2 id="ratio-heading">色を使う面積の目安</h2>

                            <div className={styles.legend}>
                                <div className={styles.colorGroup} role="group" aria-label="Base">
                                    <h3>Base</h3>
                                    <p>{palette.base_color.name}</p>
                                    <p className={styles.ratio}>{palette.base_ratio}%</p>
                                </div>

                                <div className={styles.colorGroup} role="group" aria-label="Sub">
                                    <h3>Sub</h3>
                                    <p>{palette.sub_color.name}</p>
                                    <p className={styles.ratio}>{palette.sub_ratio}%</p>
                                </div>

                                <div className={styles.colorGroup} role="group" aria-label="Accent">
                                    <h3>Accent</h3>
                                    <p>{palette.accent_color.name}</p>
                                    <p className={styles.ratio}>{palette.accent_ratio}%</p>
                                </div>
                            </div>

                            <p className={styles.description}>
                                割合は服の枚数ではなく、見えている色の面積の目安です。
                            </p>
                        </section>

                        {backLink}
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <p className={styles.logo}>Palette Closet</p>
                <p>色から配色を探す</p>
            </header>

            <main className={styles.main}>{content}</main>

            <footer className={styles.footer}>
                <p>色の見え方は、服の素材や照明で変わります。</p>
                <p>Palette Closet</p>
            </footer>
        </div>
    );
};
