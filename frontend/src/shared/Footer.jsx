import styles from "./Footer.module.css";

export const Footer = ({ showSiteName = true }) => {
    return (
        <footer className={styles.footer}>
            <p>※色の見え方は、服の素材や照明で変わります。</p>
            {showSiteName && <p>Palette Closet</p>}
        </footer>
    );
};
