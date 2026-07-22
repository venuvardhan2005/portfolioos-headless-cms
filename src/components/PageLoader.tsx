import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[10000] bg-neutral-950 flex flex-col items-center justify-center text-white"
        >
          {/* Animated logo layout */}
          <div className="relative flex flex-col items-center space-y-4 px-4 text-center">
            {/* Title: P Venu Vardhan Shetty */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-2xl sm:text-4xl font-bold font-display tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            >
              P Venu Vardhan Shetty
            </motion.div>

            {/* Divider: Thin animated horizontal line */}
            <div className="w-56 sm:w-64 h-[1px] bg-neutral-900 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
              />
            </div>
            
            {/* Subtitle: Building the Future... */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xs sm:text-sm font-sans tracking-wide text-neutral-400 font-light"
            >
              Building the Future...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
