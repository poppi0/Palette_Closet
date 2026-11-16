import { Link } from "react-router";
import styles from "./BackLink.module.css";

export const BackLink = ({ to, children }) => {
    return (
        <Link to={to} className={styles.backLink}>
            {children}
        </Link>
    );
};
