import tones from "./tones.json";
import styles from "./App.module.css";

export const App = () => {
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
                    <div className={styles.toneGrid}>
                        {/* 各トーンの色見本と選択ボタンは後で追加する */}
                        {tones.map((tone) => (
                            <fieldset key={tone.name} className={styles.toneCard}>
                                <legend>{tone.name}</legend>
                                <p>{tone.description}</p>
                            </fieldset>
                        ))}

                        <fieldset className={styles.achromaticColors}>
                            <legend>無彩色</legend>
                            {/* 無彩色の色見本と選択ボタンは後で追加する */}
                        </fieldset>
                    </div>

                    <section className={styles.selectedColor}>
                        <h2>選択中のベース色</h2>
                        <p className={styles.colorName}>色を選んでください。</p>
                        <p className={styles.description}>この色を含む3色の配色を探します。</p>
                        <button className={styles.searchButton}>
                            この色の配色を見る →
                        </button>
                        <p className={styles.steps}>色を選ぶ → 配色を見比べる → 比率を確認</p>
                    </section>
                </div>
            </main>

            <footer className={styles.footer}>
                <p>色の見え方は、服の素材や照明で変わります。</p>
                <p>Palette Closet</p>
            </footer>
        </div>
    )
};
