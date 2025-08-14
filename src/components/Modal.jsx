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
          className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-indigo-900 flex justify-center items-center z-50"
          style={{
            backdropFilter: "blur(5px)",
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="w-full h-full md:w-[80%] md:h-[90%] overflow-auto relative"
            // style={{
            //   background: "rgba(0, 0, 0, 0.9)",
            //   backdropFilter: "blur(10px)",
            //   border: "1px solid rgba(136, 136, 136, 0.2)",
            //   boxShadow:
            //     "0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(136, 136, 136, 0.1)",
            // }}
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
