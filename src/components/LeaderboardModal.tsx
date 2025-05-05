import { useState, useEffect } from 'react';

interface LeaderboardEntry {
    username: string;
    level: number;
}

export default function LeaderboardModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        if (isOpen) {
            const storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
            setLeaderboard(storedLeaderboard);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-white text-black p-6 rounded-md w-96">
                <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
                <ul>
                    {leaderboard
                        .sort((a, b) => b.level - a.level)
                        .slice(0, 10)
                        .map((entry, index) => (
                            <li key={index} className="flex justify-between">
                                <span>{index + 1}. {entry.username}</span>
                                <span>Level {entry.level}</span>
                            </li>
                        ))}
                </ul>
                <button
                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}