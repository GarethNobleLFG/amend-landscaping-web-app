import { motion } from 'framer-motion';
import { Leaf, Award, Users, Target } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-neutral-50 text-gray-800">
            {/* Hero */}
            <section className="relative overflow-hidden bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm tracking-wide uppercase mb-8">
                            <Leaf className="w-4 h-4" />
                            Built on hard work,  and community trust.
                          
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 leading-tight">
                              About 
                            <span className="text-green-700"> Amend Landscaping</span>
                           
                        </h1>

                        <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-3xl">
                           Amend Landscaping is committed to providing reliable, affordable,
                            and professional lawn care and landscaping services to residential
                            and commercial properties throughout Fort Wayne, Indiana.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100"
                    >
                        <h2 className="text-4xl font-black text-gray-900 mb-8">
                            Our Story
                        </h2>

                        <div className="space-y-6 text-lg leading-relaxed text-gray-600">
                            <p>
                                Here at <span className="font-semibold text-gray-900">Amend Landscaping LLC</span>,
                                we provide reliable and affordable lawn care and landscaping
                                services to residential and commercial properties throughout
                                Fort Wayne, Indiana.
                            </p>

                            <p>
                                Established in <span className="font-semibold text-gray-900">2024</span>,
                                Amend Landscaping LLC was founded by
                                <span className="font-semibold text-gray-900"> 16-year-old Raydin Garrett</span>,
                                a driven high school student determined to create
                                opportunities and make a positive impact on his future.
                            </p>

                            <p>
                                Since then, Amend Landscaping has grown to service
                                multiple residential properties as well as smaller
                                commercial properties throughout the area.
                            </p>

                            <p>
                                Our focus is simple:
                                <span className="font-semibold text-gray-900">
                                    {" "}quality work, dependable service, professional
                                    results, and most importantly, happy clients.
                                </span>
                            </p>

                            <p>
                                Whether you need recurring lawn maintenance, seasonal
                                cleanups, mulch installations, or property upkeep,
                                we're here to help keep your property looking its best.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900">
                            What Drives Us
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <Award className="w-10 h-10 text-green-600 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Quality Work</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Every project is completed with attention to detail
                                and a commitment to professional results.
                            </p>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <Users className="w-10 h-10 text-green-600 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Dependable Service</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We show up when we say we will and deliver consistent,
                                reliable service every time.
                            </p>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <Target className="w-10 h-10 text-green-600 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Customer Focus</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our success is measured by satisfied customers and
                                long-term relationships built on trust.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-24">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-green-700 rounded-[2rem] p-10 md:p-16 text-center text-white">
                        <h2 className="text-4xl font-black mb-4">
                            Ready to transform your property?
                        </h2>

                        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                            Let Amend Landscaping help maintain and enhance your
                            outdoor spaces with reliable, professional service.
                        </p>

                        <a
                            href="/book"
                            className="inline-flex items-center px-8 py-4 rounded-2xl bg-white text-green-700 font-bold hover:scale-105 transition-transform"
                        >
                            Request a Service
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;