import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandingImages } from '../../hooks/landingImageHooks';

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { images: apiImages, fetchLandingImages } = useLandingImages();

  useEffect(() => {
    fetchLandingImages();
  }, [fetchLandingImages]);

  const slideImages = useMemo(() => {
    return apiImages
      .filter(img => img.url)
      .map(img => img.url);
  }, [apiImages]);

  useEffect(() => {
    if (slideImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4500); // Slightly faster pace for energy
    return () => clearInterval(timer);
  }, [slideImages.length]);

  const total = slideImages.length;
  const currentIdx = total > 0 ? currentIndex % total : 0;
  const nextIdx = total > 0 ? (currentIndex + 1) % total : 0;
  const prevIdx = total > 0 ? (currentIndex - 1 + total) % total : 0;

  const isEmpty = total === 0;

  const transition = {
    duration: 0.9,
    ease: "anticipate"
  };

  return (
    <section className="-mt-4 relative overflow-hidden bg-gradient-to-br from-green-50/50 to-green-100/30 text-gray-900 min-h-[85vh] flex flex-col lg:flex-row items-center w-full">
      {/* --- Left Side: Text Content --- */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full lg:w-1/2 px-8 lg:pl-16 lg:pr-12 pt-12 pb-12 lg:pt-16 lg:pb-24 lg:-mt-4 flex flex-col items-center lg:items-start text-center lg:text-left"
      >
        {/* New Customer Count Badge */}
        <div className="-mt-2 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-green-100 mb-5 self-center lg:self-start">
          <div className="relative flex -space-x-2">
            <img
              src="/crew-photo.jpeg"
              alt="Our Crew"
              className="w-13 h-13 rounded-full border-2 border-white object-cover shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-green-800 font-bold text-xs uppercase tracking-widest whitespace-nowrap">
              Proudly Serviced 78+ Fort Wayne Properties
            </span>
          </div>
        </div>

        <h1 className="text-5xl lg:text-7xl font-extrabold mb-5 leading-tight tracking-tight text-gray-900 drop-shadow-sm">
          Transform Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500 drop-shadow-sm hover:-translate-y-1 inline-block transition-transform duration-300">
            Outdoor Space
          </span>
        </h1>

        <p className="text-lg md:text-xl leading-relaxed mb-8 text-gray-700 font-medium max-w-lg">
          Professional landscaping, lawn maintenance, and custom design to bring your vision to life effortlessly.
        </p>

        <div className="flex flex-col items-center lg:items-start gap-4 w-full mt-4">
          <motion.button
            onClick={() => navigate('/book')}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: ["0px 0px 0px 0px rgba(21, 128, 61, 0.6)", "0px 0px 0px 20px rgba(21, 128, 61, 0)", "0px 0px 0px 0px rgba(21, 128, 61, 0)"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-700 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-600 transition-all w-full sm:w-[290px] text-center shadow-lg"
          >
            Book an Appointment
          </motion.button>

          <motion.button
            onClick={() => navigate('/commercial')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border-2 border-gray-100 hover:border-gray-200 text-green-850 hover:text-green-700 px-6 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all w-full sm:w-[290px] text-center"
          >
            Commercial Property Service
          </motion.button>
        </div>
      </motion.div>

      {/* --- Right Side: Dynamic Collage --- */}
      <div className="relative z-10 w-full h-[600px] lg:h-auto lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-300 rounded-full blur-[140px] opacity-40 mix-blend-multiply"></div>

        <div className="relative w-full h-full pointer-events-none perspective-[1000px] flex items-center justify-center">
          {/* AnimatePresence must be around the EXACT elements that change (the images) */}
          <AnimatePresence mode="popLayout">
            {isEmpty ? (
              null
            ) : (
              /* Mapping positions to the AnimatePresence direct children flow */
              [
                // Position: Next (Bottom Right)
                total > 1 && (
                  <motion.img
                    key={`next-${currentIndex}`}
                    src={slideImages[nextIdx]}
                    initial={{ opacity: 0, x: '30%', y: '-10%', rotate: 15, scale: 0.8 }}
                    animate={{ opacity: 0.6, x: '15%', y: '10%', rotate: 8, scale: 0.9 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={transition}
                    className="absolute bottom-[10%] lg:bottom-[15%] right-[5%] lg:-right-[5%] w-[65%] h-[45%] lg:h-[50%] object-cover rounded-[2rem] shadow-2xl border-[6px] border-white z-0 grayscale-[20%]"
                  />
                ),
                // Position: Previous (Top Left)
                total > 1 && (
                  <motion.img
                    key={`prev-${currentIndex}`}
                    src={slideImages[prevIdx]}
                    initial={{ opacity: 0, x: '-30%', y: '10%', rotate: -15, scale: 0.8 }}
                    animate={{ opacity: 0.6, x: '-15%', y: '-10%', rotate: -8, scale: 0.9 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={transition}
                    className="absolute top-[10%] lg:top-[15%] left-[5%] lg:-left-[5%] w-[65%] h-[45%] lg:h-[50%] object-cover rounded-[2rem] shadow-2xl border-[6px] border-white z-10 grayscale-[20%]"
                  />
                ),
                // Position: Main (Center)
                <motion.img
                  key={`curr-${currentIndex}`}
                  src={slideImages[currentIdx]}
                  initial={{ opacity: 0, y: 50, scale: 0.9, rotate: 5 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9, rotate: -5 }}
                  transition={transition}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] lg:w-[90%] h-[70%] lg:h-[80%] object-cover rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-[10px] lg:border-[16px] border-white z-20"
                />
              ].filter(Boolean)
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}