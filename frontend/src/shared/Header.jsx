import { Link } from "react-router";
import styles from "./Header.module.css";

export const Header = () => {
    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>Palette Closet</Link>
        </header>
    );
};
