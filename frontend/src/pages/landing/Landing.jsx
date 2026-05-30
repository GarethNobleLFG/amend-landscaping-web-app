import { motion } from 'framer-motion';
import { Leaf,  ArrowRight, Star } from 'lucide-react';
import { useEffect } from 'react';
import { useGetServices } from '../../hooks/serviceHooks';
import Hero from './Hero';

const slideImages = [
  '/sample-imgs/istockphoto-1312760160-612x612.jpg',
  '/sample-imgs/rsz_dsc_0034.jpg',
  '/sample-imgs/istockphoto-1347784849-612x612.jpg',
];

const testimonials = [
  {
    name: "Sarah Jenkins",
    location: "Oakwood Estates",
    text: "Amend completely transformed our backyard. Their attention to detail and reliable service is unmatched in the area."
  },
  {
    name: "Michael Chen",
    location: "Pine Valley",
    text: "The landscaping team was incredibly professional. We love our new patio and seasonal flower beds!"
  },
  {
    name: "Emily Rodriguez",
    location: "Maplewood",
    text: "Finally, a lawn care service that actually shows up on time and does a perfect job every single week. Highly recommend."
  },
  {
    name: "David Thompson",
    location: "Cedar Ridge",
    text: "Their arborist saved our ancient oak tree after the storm. Extremely knowledgeable and surprisingly well-priced."
  },
  {
    name: "Jessica Wyatt",
    location: "Stone Creek",
    text: "From the initial 3D design to the final planting, the entire process was seamless. Our outdoor space is a dream."
  }
];

function Landing() {
  const { services, fetchServices, isLoading } = useGetServices();
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-gray-800 font-sans selection:bg-green-200">
      
      {/* --- Navigation Header --- */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full px-6 lg:px-12 py-5 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm flex justify-between items-center sticky top-0 z-50 transition-all font-medium"
      >
        <div className="flex items-center gap-2 text-2xl font-black text-green-800 tracking-tight">
          Amend <Leaf className="w-6 h-6 text-green-600 fill-green-600/20" /> <span className="text-gray-900">Landscaping</span>
        </div>
        <nav className="space-x-8 hidden md:flex items-center">
          <a href="#services" className="text-gray-600 hover:text-green-700 transition-colors">Services</a>
          <a href="#portfolio" className="text-gray-600 hover:text-green-700 transition-colors">Portfolio</a>
          <a href="#about" className="text-gray-600 hover:text-green-700 transition-colors">About</a>
        </nav>
      </motion.header>

      {/* --- Pulled-out Hero Section --- */}
      <Hero />

      {/* --- Services Section (Editorial Theme) --- */}
      {/* Changed py-24 lg:py-32 to pt-12 pb-24 lg:pt-16 lg:pb-32 to pull it up closer to the hero */}
      <section id="services" className="pt-12 pb-24 lg:pt-16 lg:pb-32 px-6 bg-white w-full border-b border-gray-100">
        <div className="w-full max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-24">
            <h2 className="text-green-700 font-extrabold tracking-[0.2em] uppercase text-sm mb-4">
              What We Do
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
              Expert care for your <br/> outdoor spaces.
            </h3>
            <p className="text-xl text-gray-600 font-medium">
              Tailored property maintenance designed to let you enjoy a stunning yard without the heavy lifting.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full"
          >
            {isLoading ? (
              <div className="col-span-full flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-gray-600 font-medium">No services available at this time. Please check back soon.</p>
              </div>
            ) : (
              services.map((service, index) => (
                <motion.div key={service.id} variants={itemVariants} className="group rounded-[2rem] bg-gray-50 overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-100 flex flex-col">
                  <div className="relative h-64 lg:h-72 overflow-hidden bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                    {slideImages[index % slideImages.length] && (
                      <img src={slideImages[index % slideImages.length]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt={service.description} />
                    )}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow-sm p-3.5 rounded-2xl text-green-600">
                      <Leaf className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-8 lg:p-10 flex flex-col flex-grow">
                    <h4 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">{service.description}</h4>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-grow">
                      Premium {service.description.toLowerCase()} services tailored to keep your outdoor space in perfect condition.
                    </p>
                    <a href="#" className="inline-flex items-center text-base font-bold text-green-700 hover:text-green-600 transition-colors w-fit">
                      Book Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* --- Testimonials Section (Scrolling Marquee) --- */}
      <section className="py-24 bg-neutral-50 overflow-hidden relative">
        <div className="text-center max-w-2xl mx-auto mb-16 px-6">
          <h2 className="text-green-700 font-extrabold tracking-[0.2em] uppercase text-sm mb-4">
            Testimonials
          </h2>
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Loved by homeowners across the city.
          </h3>
        </div>

        {/* Scrolling Container */}
        <div className="relative w-full flex items-center">
          
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            className="flex w-max gap-6 px-6"
          >
            {/* Array duplicated so it scrolls infinitely without jump */}
            {[...testimonials, ...testimonials].map((testimonial, idx) => (
              <div 
                key={idx} 
                className="w-[350px] md:w-[420px] bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex-shrink-0"
              >
                <div className="flex items-center gap-1 mb-6 text-green-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-8 font-medium italic">
                  "{testimonial.text}"
                </p>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{testimonial.name}</span>
                  <span className="text-sm text-gray-500 font-medium">{testimonial.location}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Fade gradients on edges to hide the hard scroll cutoff */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-neutral-50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-neutral-50 to-transparent pointer-events-none z-10"></div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-200 py-16 text-center relative z-20">
        <h3 className="text-2xl font-extrabold text-green-700 tracking-tight mb-3">
          Amend<span className="text-gray-800 font-bold">Landscaping</span>
        </h3>
        <p className="mb-8 font-medium text-gray-600">Making neighborhoods beautiful, one yard at a time.</p>
        <div className="w-16 h-[2px] bg-green-200 mx-auto mb-8 rounded-full"></div>
        <p className="text-xs text-gray-400 tracking-wider uppercase font-bold">
          &copy; {new Date().getFullYear()} Amend Landscaping. All rights reserved.
        </p>
      </footer>
      
    </div>
  );
}

export default Landing;