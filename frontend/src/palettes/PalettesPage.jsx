import { useSearchParams } from "react-router";
import { Header } from "../shared/Header.jsx";
import { Footer } from "../shared/Footer.jsx";
import { PaletteList } from "./components/PaletteList.jsx";
import styles from "./PalettesPage.module.css";

export const PalettesPage = () => {
    const [searchParams] = useSearchParams();
    const colorId = searchParams.get("color_id") ?? "";

    return (
        <div className={styles.page}>
            <Header />

            <main className={styles.main}>
                <h1>配色一覧</h1>
                <PaletteList key={colorId} colorId={colorId} />
            </main>

            <Footer showSiteName={false} />
        </div>
    );
};
