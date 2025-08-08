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
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          style={{ backdropFilter: "blur(5px)" }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className=" w-full h-full md:w-[80%] md:h-[90%] overflow-auto relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // onClick={(e) => e.stopPropagation()}
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
