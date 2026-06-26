import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useGetAvailableServices } from '../../hooks/serviceHooks';
import Hero from './Hero';
import Testimonials from './Testimonials';
import FeedbackForm from '../../components/FeedbackForm';
import Header from '../../components/Header';
import { Helmet } from 'react-helmet-async';

function Landing() {
  const { services, fetchServices, isLoading } = useGetAvailableServices();

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

      <Helmet>
        <title>Landscaping, Lawn Care Services, and Mowing in Fort Wayne | Amend Landscaping LLC</title>
        <meta name="description"
          content="Professional landscaping in Fort Wayne having served 78+ local properties. Amend Landscaping LLC provides expert lawn care, seasonal cleanups, and outdoor design for residential and commercial clients."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Landscaping & Lawn Care Services in Fort Wayne | Amend Landscaping LLC" />
        <meta property="og:description" content="Expert lawn care, hardscaping, and outdoor design for Fort Wayne properties." />
        <meta property="og:image" content="https://amendlandscapingllc.com/logo.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:url" content="https://amendlandscapingllc.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://amendlandscapingllc.com/logo.webp" />
        <link rel="canonical" href="https://amendlandscapingllc.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://amendlandscapingllc.com",
            "name": "Amend Landscaping LLC",
            "image": "https://amendlandscapingllc.com/logo.webp",
            "url": "https://amendlandscapingllc.com",
            "telephone": "+12607156959",
            "priceRange": "$$",
            "serviceType": "Landscaping and Lawn Care",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "6128 Stellhorn Rd",
              "addressLocality": "Fort Wayne",
              "addressRegion": "IN",
              "postalCode": "46815",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 41.1217,
              "longitude": -85.0617
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
              ],
              "opens": "04:00",
              "closes": "18:00"
            },
            "sameAs": [
              "https://facebook.com/amendlandscapingllc",
              "https://instagram.com/amendlandscapingllc"
            ],
            "areaServed": [
              { "@type": "City", "name": "Fort Wayne" },
              { "@type": "City", "name": "New Haven" },
              { "@type": "City", "name": "Huntertown" },
              { "@type": "City", "name": "Leo-Cedarville" }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "bestRating": "5",
              "worstRating": "1",
              "reviewCount": "3"
            }
          })}
        </script>
      </Helmet>

      <Header />

      <Hero />

      {/* Services Section */}
      <section id="services" className="pt-12 pb-24 lg:pt-16 lg:pb-32 px-6 bg-white w-full border-b border-gray-100">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-24">
            <h2 className="text-green-700 font-extrabold tracking-[0.2em] uppercase text-sm mb-4">What We Do</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
              Expert care for your <br className="hidden md:block" /> outdoor spaces.
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              Amend Landscaping provides expert <span className="text-green-800 font-semibold">landscaping, lawn care, and snow removal in Fort Wayne</span>.
              Our comprehensive services include <span className="text-green-800 font-semibold">weekly mowing, mulch installation, hedge trimming, weed/overgrowth removal, junk removal, and seasonal cleanups</span>.
              Trust our experienced team for reliable residential and commercial maintenance across Indiana.
            </p>
          </div>

          <div className="min-h-[400px] relative">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-20 w-full"
                >
                  <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                </motion.div>
              ) : services.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12"
                >
                  <Leaf className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Service Catalog Coming Soon</h4>
                  <p className="text-gray-500 max-w-md mx-auto">We're updating our seasonal offerings. Check back shortly!</p>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.1,
                    margin: "275px"
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full -mt-7"
                >
                  {services.map((service) => (
                    <motion.div key={service.id} variants={itemVariants} className="group rounded-4xl bg-gray-50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col">
                      <div className="relative h-64 lg:h-72 overflow-hidden bg-green-100 flex items-center justify-center">
                        {service.imageUrl ? (
                          <img
                            src={service.imageUrl}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt={`${service.name} service - Amend Landscaping Fort Wayne`}
                          />
                        ) : (
                          <Leaf className="w-12 h-12 text-green-600 opacity-20" />
                        )}
                      </div>
                      <div className="p-8 flex flex-col grow">
                        <h4 className="text-2xl font-bold mb-4 text-gray-900">{service.name}</h4>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8 grow">{service.description}</p>
                        <a href="/book" className="inline-flex items-center text-green-700 font-bold transition-all hover:gap-3">
                          Get a Quote Now <ArrowRight className="w-5 h-5 ml-2" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Testimonials />

      <FeedbackForm />

    </div>
  );
}

export default Landing;