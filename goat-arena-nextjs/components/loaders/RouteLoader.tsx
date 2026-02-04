"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function RouteLoader() {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-gold-light to-accent z-[9998] origin-left"
                    style={{ transformOrigin: "left" }}
                />
            )}
        </AnimatePresence>
    );
}
