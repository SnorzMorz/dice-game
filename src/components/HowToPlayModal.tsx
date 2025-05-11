import React from 'react';

interface HowToPlayModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white text-black p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">How to Play</h2>
                <p className="mb-2">1. Roll dice to gain points.</p>
                <p className="mb-2">2. Use points to buy or upgrade dice.</p>
                <p className="mb-2">3. Reach the required points to advance to the next level.</p>
                <p className="mb-2">4. Strategize to maximize your score and progress!</p>
                <button
                    className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}