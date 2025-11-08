import React, { useState } from "react";
import ReactDOM from "react-dom";

const FormModal = ({ isOpen, onClose, children }) => {
  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root") || document.body
      : null;

  if (!isOpen || !modalRoot) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()} // Prevent outside click close
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:scale-110 transition"
        >
          <img src="/close.png" alt="close" width={20} height={20} />
        </button>

        {/* Modal Inner Content */}
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default FormModal;
