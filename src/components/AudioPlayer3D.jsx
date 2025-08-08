import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import music from "../assets/fake_verthandi.mp3";
import Modal from "./Modal";
import ContactModal from "./ContactModal";
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
  background: slategray;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 20px;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  transition: 0.3s ease;
  font-size: 0.85rem;

  &:hover {
    background: #0a84d0;
  }
`;

const WaveContainer = styled.svg`
  width: 80px;
  height: 20px;
  cursor: pointer;
  path {
    fill: none;
    stroke: #00ff7f;
    stroke-width: 2;
    animation: ${wave} 2s ease-in-out infinite;
    animation-play-state: ${(props) => (props.playing ? "running" : "paused")};
  }
`;

// const ModalBackdrop = styled.div`
//   position: fixed;
//   inset: 0;
//   background: rgba(0, 0, 0, 0.5);
//   z-index: 99;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const Modal = styled.div`
//   background: white;
//   padding: 2rem;
//   border-radius: 12px;
//   min-width: 300px;
//   box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
// `;

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
          <Button onClick={() => openModal("about")}>About</Button>

          <WaveContainer
            viewBox="0 0 80 20"
            onClick={toggleAudio}
            playing={playing ? 1 : 0}
          >
            <path d="M0 10 Q 10 0 20 10 T 40 10 T 60 10 T 80 10" />
          </WaveContainer>

          <Button onClick={() => openModal("contact")}>Contact</Button>

          {/* ⬇️ Correct placement of audio element ⬇️ */}
          <audio ref={audioRef} src={music} loop />
        </Container>
      </>

      <Modal isOpen={modalContent} onClose={closeModal}>
        <div className="p-6">
          <h1 className="text-2xl font-bold">About Us</h1>
          <p>Some content here...</p>
        </div>
      </Modal>
    </>
  );
};

export default FloatingNavBar;
