import { useState } from "react";
import styles from "./App.module.css";
import { ColorGrid } from "./components/ColorGrid.jsx";
import { SelectedColorPanel } from "./components/SelectedColorPanel.jsx";

export const App = () => {
    const [selectedColor, setSelectedColor] = useState(null);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <p className={styles.logo}>Palette Closet</p>
                <p>色から配色を探す</p>
            </header>

            <main className={styles.main}>
                <h1>服に近い色を選ぶ</h1>
                <p className={styles.introduction}>12種類のトーンを見比べて、服に近いベース色を選んでください。</p>

                <div className={styles.colorSelection}>
                    <ColorGrid onSelectColor={setSelectedColor} />
                    <SelectedColorPanel selectedColor={selectedColor} />
                </div>
            </main>

            <footer className={styles.footer}>
                <p>色の見え方は、服の素材や照明で変わります。</p>
                <p>Palette Closet</p>
            </footer>
        </div>
    )
};
