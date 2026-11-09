import styles from "../App.module.css";

export const SelectedColorPanel = ({ selectedColor }) => {
    return (
        <section
            className={styles.selectedColor}
            style={{ "--selected-color": selectedColor?.hex_code }}
        >
            <h2>選択中のベース色</h2>
            <p className={styles.colorName}>
                {selectedColor ? selectedColor.name : "色を選んでください。"}
            </p>
            <p className={styles.description}>この色を含む3色の配色を探します。</p>
            <button className={styles.searchButton}>
                この色の配色を見る →
            </button>
            <p className={styles.steps}>色を選ぶ → 配色を見比べる → 比率を確認</p>
        </section>
    )
};
