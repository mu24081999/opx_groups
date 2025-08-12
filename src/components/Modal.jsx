import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Fade + Blink-like animation
const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50"
          style={{
            backdropFilter: "blur(12px)",
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)'
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="w-full h-full md:w-[80%] md:h-[90%] overflow-auto relative"
            style={{
              background: 'linear-gradient(135deg, rgba(27, 26, 26, 0.95) 0%, rgba(40, 40, 40, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.5),
                0 12px 25px rgba(0, 0, 0, 0.3),
                0 6px 12px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
