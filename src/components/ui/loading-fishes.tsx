
'use client';

import { useEffect, useState } from 'react';
import { Fish } from 'lucide-react';

export const LoadingFishes = () => {
    const [fishCount, setFishCount] = useState(1);
    const colors = ['text-accent/40', 'text-accent/60', 'text-accent/80', 'text-accent'];

    useEffect(() => {
        const interval = setInterval(() => {
            setFishCount(prevCount => (prevCount % 4) + 1);
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <Fish
                    key={i}
                    className={`h-4 w-4 ${colors[i]} transition-opacity duration-300`}
                    style={{ opacity: i < fishCount ? 1 : 0 }}
                />
            ))}
        </div>
    );
};
