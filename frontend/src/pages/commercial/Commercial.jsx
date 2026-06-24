import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useLandingImages } from '../../hooks/landingImageHooks';
import Header from '../../components/Header';
import { Helmet } from 'react-helmet-async';

export default function Commercial() {
  const navigate = useNavigate();

  // --- Animation Workflow Logic: Identical to Hero.jsx ---
  const [currentIndex, setCurrentIndex] = useState(0);
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
    }, 4500);
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
    <div className="min-h-screen bg-neutral-50 text-gray-800 font-sans selection:bg-green-200 flex flex-col justify-between overflow-x-hidden">

      <Helmet>
        <title>Commercial Property Management | Fort Wayne Grounds Care</title>
        <meta name="description" content="Professional grounds maintenance and turf care for organizations and commercial properties in Fort Wayne. Register your property with Amend Landscaping." />
      </Helmet>

      {/* --- Navigation Header --- */}
      <Header showNav={false} showBackToHome={true} />

      {/* --- Spanning Split-Layout Service Welcome --- */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* Left Side: Welcome Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <div className="inline-flex bg-green-50 text-green-800 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-green-100 items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Commercial Division
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-tight mb-6">
            Commercial Property <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500">
              Management Service
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium max-w-xl">
            Welcome to Amend Landscaping’s premium commercial grounds care service. We deliver scale-adjusted turf maintenance, structured seasonal rotations, and seamless project management custom-tailored for your organization.
          </p>

          <motion.button
            onClick={() => navigate('/book', { state: { isCommercial: true } })}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group bg-green-700 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-bold text-lg lg:text-xl shadow-lg hover:shadow-green-900/10 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            Request a Commercial Estimate
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Right Side: Dynamic Presentation Collage */}
        <div className="lg:col-span-5 relative w-full h-[450px] lg:h-[550px] flex items-center justify-center">
          {/* Background Decorative Gradient Blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-green-300 rounded-full blur-[100px] opacity-25 mix-blend-multiply pointer-events-none"></div>

          <div className="relative w-full h-full perspective-[1000px]">
            <AnimatePresence mode="popLayout">
              {isEmpty ? (
                <div className="w-full h-full bg-gray-200 rounded-[2.5rem] animate-pulse flex items-center justify-center">
                  <span className="text-gray-400 font-bold">Connecting to Registry...</span>
                </div>
              ) : (
                [
                  // Next Image (Bottom Right Layer)
                  total > 1 && (
                    <motion.img
                      key={`next-${currentIndex}`}
                      src={slideImages[nextIdx]}
                      initial={{ opacity: 0, x: '20%', y: '10%', rotate: 10, scale: 0.8 }}
                      animate={{ opacity: 0.5, x: '10%', y: '15%', rotate: 5, scale: 0.9 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={transition}
                      className="absolute bottom-0 right-0 w-[65%] h-[50%] object-cover rounded-[2rem] shadow-xl border-[6px] border-white z-0 grayscale-[20%]"
                    />
                  ),
                  // Previous Image (Top Left Layer)
                  total > 1 && (
                    <motion.img
                      key={`prev-${currentIndex}`}
                      src={slideImages[prevIdx]}
                      initial={{ opacity: 0, x: '-20%', y: '-10%', rotate: -10, scale: 0.8 }}
                      animate={{ opacity: 0.5, x: '-10%', y: '-15%', rotate: -5, scale: 0.9 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={transition}
                      className="absolute top-0 left-0 w-[65%] h-[50%] object-cover rounded-[2rem] shadow-xl border-[6px] border-white z-10 grayscale-[20%]"
                    />
                  ),
                  // Current Primary Image (Center Layer)
                  <motion.img
                    key={`curr-${currentIndex}`}
                    src={slideImages[currentIdx]}
                    initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    transition={transition}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[75%] object-cover rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-[10px] border-white z-20"
                  />
                ].filter(Boolean)
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}