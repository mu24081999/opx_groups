import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import music from "../assets/fake_verthandi.mp3";
import Modal from "./Modal";
import ContactModal from "./ContactModal";
import AboutUsModal from "./AboutModal";
// Wavy animation for smooth flowing line
const wave = keyframes`
  0% { d: path("M0 10 Q 10 0 20 10 T 40 10 T 60 10 T 80 10"); }
  50% { d: path("M0 10 Q 10 20 20 10 T 40 10 T 60 10 T 80 10"); }
  100% { d: path("M0 10 Q 10 0 20 10 T 40 10 T 60 10 T 80 10"); }
`;

const Container = styled.div`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  background: #1b1a1ad6;
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  padding: 0.6rem 1.2rem;
  display: flex;
  align-items: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  gap: 1rem;
  z-index: 100;
`;

const Button = styled.button`
  background: #888;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 20px;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  transition: 0.3s ease;
  font-size: 0.85rem;

  &:hover {
    background: #8889;
  }
`;

const WaveContainer = styled.svg`
  width: 80px;
  height: 20px;
  cursor: pointer;
  path {
    fill: none;
    stroke: #888;
    stroke-width: 2;
    animation: ${wave} 2s ease-in-out infinite;
    animation-play-state: ${(props) => (props.playing ? "running" : "paused")};
  }
`;

const FloatingNavBar = () => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const toggleAudio = () => {
    setPlaying((prev) => {
      if (!prev && audioRef.current) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      return !prev;
    });
  };

  const openModal = (type) => setModalContent(type);
  const closeModal = () => setModalContent(null);

  return (
    <>
      <>
        <Container className="shadow-lg border border-gray-50">
          <a
            className="rounded-full text-bold hover:bg-gry-300 cursor-pointer px-3 py-2 text-sm text-white bg-gray-500"
            href="#layer2"
          >
            Overview
          </a>

          <WaveContainer
            viewBox="0 0 80 20"
            onClick={toggleAudio}
            playing={playing ? 1 : 0}
          >
            <path d="M0 10 Q 10 0 20 10 T 40 10 T 60 10 T 80 10" />
          </WaveContainer>

          <button
            className="rounded-full text-bold hover:bg-gry-300 cursor-pointer px-3 py-2 text-sm text-white bg-gray-500"
            onClick={() => openModal("contact")}
          >
            Contact
          </button>

          {/* ⬇️ Correct placement of audio element ⬇️ */}
          <audio ref={audioRef} src={music} loop />
        </Container>
      </>

      <Modal isOpen={modalContent} onClose={closeModal}>
        {modalContent === "contact" && <ContactModal onClose={closeModal} />}
      </Modal>
    </>
  );
};

export default FloatingNavBar;
