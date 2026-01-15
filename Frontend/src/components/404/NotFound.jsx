import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Lottie from 'lottie-react';
import notfoundAnimation from '../../assets/lottie/notfound.json';
import { useEffect, useState } from 'react';
import './NotFound.css'
import { Link } from 'react-router-dom';

const NotFound = () => {
  const [chosenMessage, setChosenMessage] = useState("Nope, this doesn't exist");
  const messages = [
    "Whoa there, adventurer… wrong dungeon ⚔️",
    "Looking for trouble? Found it. 🚫",
    "You’re not supposed to be here…",
    "404: Accessing the unaccessable, huh?",
    "Uh-huh… bold move. Still a no.",
    "Oh, you thought we had this page? Cute.",
    "404: This is literally nothing",
    "We looked for the page. It ghosted us.",
    "Somewhere, this page exists. Just not here.",
    "This page doesn’t exist, but we appreciate your optimism."
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
      <h1 align="center" style={{ fontSize: "24px" }}>{chosenMessage}</h1>
      <Lottie
        animationData={notfoundAnimation}
        loop
        autoplay
        style={{ width: "350px", height: "300px" }}
      />
      <Link to="/">
        <div className="back-button">
          <FontAwesomeIcon icon={faChevronLeft} />
          <p>Back</p>
        </div>
      </Link>

    </div>

  );
}

export default NotFound;
