import '@lottiefiles/lottie-player';
import { useEffect, useState } from 'react';
const UseLaptop = () => {
    const [chosenMessage, setChosenMessage] = useState("Nope, this doesn't exist");
  const messages = [
  "Too small. Try a real screen. 🖥️",
  "Come back with more pixels. 📺",
  "Needs more screen, less squint. 👀",
  "Not wide enough for our ego. 💻",
  "Small screen? Big nope. 🚫",
  "Try something desktop-sized. 🖥️",
  "We need more room to show off. 📐",
  "Bigger screen = better us. 🖼️",
  "Your device is adorable, but no. 😏",
  "Come back when your screen’s grown up. 🎓"
];


    useEffect(() => {
        setChosenMessage(messages[Math.floor(Math.random() * messages.length)]);

    }, [])
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "30px"
            }}
        >
            <h1 align="center" style={{fontSize:"16px"}}>{chosenMessage}</h1>

            <lottie-player
                src="/laptop.json"
                loop
                autoplay
                style={{ width: "300px", height: "200px" }}
            ></lottie-player>

            <h3 align="center" style={{fontSize:"13px",fontWeight:"400"}}>Please view the website on a bigger screen</h3>
        </div>
    )
}

export default UseLaptop
