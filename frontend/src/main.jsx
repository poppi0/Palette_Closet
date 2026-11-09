import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { App } from "./top/App.jsx";
import { PalettesPage } from "./palettes/PalettesPage.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/palettes" element={<PalettesPage />} />
        </Routes>
    </BrowserRouter>
);
