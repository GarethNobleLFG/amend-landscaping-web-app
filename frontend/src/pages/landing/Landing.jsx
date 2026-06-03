import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useGetServices } from '../../hooks/serviceHooks';
import Hero from './Hero';
import Testimonials from './Testimonials';
import FeedbackForm from '../../components/FeedbackForm';

function Landing() {
  const { services, fetchServices, isLoading } = useGetServices();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-gray-800 font-sans selection:bg-green-200">
      
      {/* Navigation Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-6 lg:px-12 py-5 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm flex justify-between items-center sticky top-0 z-50 transition-all font-medium"
      >
        <div className="flex items-center gap-2 text-2xl font-black text-green-800 tracking-tight">
          Amend <Leaf className="w-6 h-6 text-green-600 fill-green-600/20" /> <span className="text-gray-900">Landscaping</span>
        </div>
        <nav className="space-x-8 hidden md:flex items-center text-gray-600">
          <a href="#services" className="hover:text-green-700 transition-colors">Services</a>
          <a href="#portfolio" className="hover:text-green-700 transition-colors">Portfolio</a>
          <a href="#about" className="hover:text-green-700 transition-colors">About</a>
          <a href="#feedback" className="hover:text-green-700 transition-colors">
          Leave a Feedback
        </a>
        </nav>
      </motion.header>

      <Hero />

      {/* Services Section */}
      <section id="services" className="pt-12 pb-24 lg:pt-16 lg:pb-32 px-6 bg-white w-full border-b border-gray-100">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-24">
            <h2 className="text-green-700 font-extrabold tracking-[0.2em] uppercase text-sm mb-4">What We Do</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
              Expert care for your <br /> outdoor spaces.
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
              <div className="col-span-full text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12">
                <Leaf className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Service Catalog Coming Soon</h4>
                <p className="text-gray-500 max-w-md mx-auto">We're updating our seasonal offerings. Check back shortly!</p>
              </div>
            ) : (
              services.map((service) => (
                <motion.div key={service.id} variants={itemVariants} className="group rounded-[2rem] bg-gray-50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col">
                  <div className="relative h-64 lg:h-72 overflow-hidden bg-green-100 flex items-center justify-center">
                    {/* FIXED: Using .image?.image_data to handle the object structure */}
                    {service.image?.image_data ? (
                      <img src={service.image.image_data} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={service.name} />
                    ) : (
                      <Leaf className="w-12 h-12 text-green-600 opacity-20" />
                    )}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-3.5 rounded-2xl text-green-600 shadow-sm">
                      <Leaf className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h4 className="text-2xl font-bold mb-4 text-gray-900">{service.name}</h4>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-grow">{service.description}</p>
                    <a href="/book" className="inline-flex items-center text-green-700 font-bold transition-all hover:gap-3">
                      Book Now <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      <Testimonials />
     
      <FeedbackForm />
  

      <footer className="bg-white border-t border-gray-200 py-16 text-center">
        <h3 className="text-2xl font-extrabold text-green-700 tracking-tight mb-3">
          Amend<span className="text-gray-800 font-bold">Landscaping</span>
        </h3>
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">&copy; {new Date().getFullYear()} Amend Landscaping.</p>
      </footer>
    </div>
  );
}

export default Landing;