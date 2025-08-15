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
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 0.5rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
  border: 1px solid rgba(136, 136, 136, 0.2);

  /* Glass effect for 3D look */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(136, 136, 136, 0.1);

  /* Responsive adjustments */
  @media (min-width: 640px) {
    top: 1.5rem;
    right: 1.5rem;
    border-radius: 2rem;
    padding: 0.6rem 1.2rem;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.4rem 0.6rem;
    gap: 0.3rem;
    border-radius: 1.25rem;
  }
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
  width: 60px;
  height: 15px;
  cursor: pointer;
  path {
    fill: none;
    stroke: #888;
    stroke-width: 2;
    animation: ${wave} 2s ease-in-out infinite;
    animation-play-state: ${(props) => (props.playing ? "running" : "paused")};
  }

  /* Glass effect for 3D look */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));

  /* Responsive adjustments */
  @media (min-width: 640px) {
    width: 80px;
    height: 20px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 12px;
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
        <Container>
          <a
            className="rounded-full text-bold hover:bg-gray-300 cursor-pointer px-2 sm:px-3 py-1 text-xs sm:text-sm text-[#888] hover:text-white transition-all duration-300"
            href="#layer2"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          >
            <span className="hidden sm:inline">Work</span>
            <span className="sm:hidden">W</span>
          </a>

          <WaveContainer
            viewBox="0 0 80 20"
            onClick={toggleAudio}
            playing={playing ? 1 : 0}
          >
            <path d="M0 10 Q 10 0 20 10 T 40 10 T 60 10 T 80 10" />
          </WaveContainer>

          <button
            className="rounded-full text-bold cursor-pointer px-2 sm:px-3 py-1 text-xs sm:text-sm text-white bg-gray-500 hover:bg-[#888] transition-all duration-300"
            onClick={() => openModal("contact")}
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          >
            <span className="hidden sm:inline">Contact</span>
            <span className="sm:hidden">C</span>
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
