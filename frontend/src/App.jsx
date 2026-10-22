import { useState } from "react";

export const App = () => {
    const [message, setMessage] = useState();

    async function checkConnection() {
        const response = await fetch("http://localhost:3000/api");
        const data = await response.json();
        setMessage(data.message)
    }
    return (
        <>
            <button onClick={checkConnection}>
                通信
            </button>
            <p>{message}</p>
        </>
    )
};
