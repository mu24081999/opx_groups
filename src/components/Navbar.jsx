import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import music from "../assets/fake_verthandi.mp3";
import Modal from "./Modal";
import ContactModal from "./ContactModal";
import AboutUsModal from "./AboutModal";
import { PlayIcon, PauseIcon } from "./Icons";
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
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  padding: 0.6rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 100;
  border: 1px solid rgba(136, 136, 136, 0.2);

  /* Glass effect for 3D look */
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(136, 136, 136, 0.1);
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

  /* Glass effect for 3D look */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
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
            className="
              rounded-full font-medium cursor-pointer px-4 py-2 text-sm
              text-gray-300 hover:text-white transition-all duration-300
              hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-purple-600/10
              border border-transparent hover:border-purple-500/30
              shadow-sm hover:shadow-lg hover:shadow-purple-500/10
            "
            href="#layer2"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            Work
          </a>

          <WaveContainer
            onClick={toggleAudio}
            playing={playing ? 1 : 0}
          >
            {playing ? (
              <PauseIcon size={16} color="#8b5cf6" />
            ) : (
              <PlayIcon size={16} color="#888" />
            )}
          </WaveContainer>

          <button
            className="
              rounded-full font-medium cursor-pointer px-4 py-2 text-sm
              text-white transition-all duration-300
              bg-gradient-to-r from-gray-600 to-gray-500
              hover:from-purple-600 hover:to-purple-500
              border border-gray-500/50 hover:border-purple-500/50
              shadow-lg hover:shadow-xl hover:shadow-purple-500/20
              hover:scale-105
            "
            onClick={() => openModal("contact")}
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
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
