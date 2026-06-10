import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Leaf } from 'lucide-react';
import { useTestimonies } from '../../hooks/testimonyHooks';
import Logo from '../../assets/hero.png'; // Reusing the same logo from Hero

const Testimonials = () => {
  const { testimonies, fetchTestimonies, isLoading } = useTestimonies();

  useEffect(() => {
    fetchTestimonies();
  }, [fetchTestimonies]);

  if (isLoading && testimonies.length === 0) {
    return (
        <div className="flex justify-center py-20 bg-neutral-50">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
    );
  }

  // --- NONE FOUND STATE: Show Logo instead of Marquee ---
  if (testimonies.length === 0) {
    return (
      <section className="py-20 bg-neutral-50 border-t border-gray-100 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <img 
            src={Logo} 
            alt="Amend Landscaping Logo" 
            className="w-48 md:w-64 h-auto object-contain opacity-40 grayscale filter brightness-110" 
          />
          <div className="flex items-center gap-3 text-gray-400">
             <div className="h-[1px] w-12 bg-gray-200"></div>
             <Leaf className="w-5 h-5 opacity-30" />
             <div className="h-[1px] w-12 bg-gray-200"></div>
          </div>
        </motion.div>
      </section>
    );
  }

  // --- DATA FOUND STATE: Show Marquee ---
  return (
    <section className="py-24 bg-neutral-50 overflow-hidden relative border-t border-gray-100">
      <div className="text-center max-w-2xl mx-auto mb-16 px-6">
        <h2 className="text-green-700 font-extrabold tracking-[0.2em] uppercase text-sm mb-4">Testimonials</h2>
        <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Loved by your neighbors.</h3>
      </div>

      <div className="relative w-full flex items-center">
        <motion.div
          animate={{ x: ["0%", "-25%"] }}
          transition={{ 
            ease: "linear", 
            duration: Math.max(testimonies.length * 10, 30), 
            repeat: Infinity 
          }}
          className="flex w-max gap-6 pr-6"
        >
          {/* Quadruple array for seamless infinite scroll effect and buffer on wide screens */}
          {[...testimonies, ...testimonies, ...testimonies, ...testimonies].map((testimonial, idx) => (
            <div
              key={`${testimonial.id}-${idx}`}
              className="w-[350px] md:w-[420px] bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex-shrink-0"
            >
              <div className="flex items-center gap-1 mb-6 text-green-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 font-medium italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                   {testimonial.name?.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{testimonial.name}</span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Verified Client</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-neutral-50 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-neutral-50 to-transparent z-10" />
      </div>
    </section>
  );
};

export default Testimonials;