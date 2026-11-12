import { useSearchParams } from "react-router";
import { PaletteList } from "./components/PaletteList.jsx";
import styles from "./PalettesPage.module.css";

export const PalettesPage = () => {
    const [searchParams] = useSearchParams();
    const colorId = searchParams.get("color_id") ?? "";

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <p className={styles.logo}>Palette Closet</p>
            </header>

            <main className={styles.main}>
                <h1>配色一覧</h1>
                <PaletteList key={colorId} colorId={colorId} />
            </main>

            <footer className={styles.footer}>
                色の見え方は、服の素材や照明で変わります。
            </footer>
        </div>
    );
};
