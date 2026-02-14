import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

const BottomPopup = ({ isOpen, onClose, title, message, type = "info", autoClose = false, duration = 5000 }) => {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, duration, onClose]);

    const bgColors = {
        info: "bg-blue-600",
        success: "bg-green-600",
        error: "bg-red-600",
        warning: "bg-yellow-500",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 50, x: 20 }}
                    className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
                >
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                        <div className={`${bgColors[type]} h-1.5 w-full`} />
                        <div className="p-5 flex items-start gap-4">
                            <div className="flex-1">
                                <h4 className={`font-bold text-gray-900 mb-1 ${!message && 'mt-1'}`}>{title}</h4>
                                {message && <p className="text-sm text-gray-500 leading-relaxed">{message}</p>}
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-900 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BottomPopup;
