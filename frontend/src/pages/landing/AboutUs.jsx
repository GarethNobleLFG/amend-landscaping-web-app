import { motion } from 'framer-motion';
import { Leaf, Award, Users, Target } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-neutral-50 text-gray-800">

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
                <a href="/#services" className="hover:text-green-700 transition-colors">Services</a>
                <a href="/#portfolio" className="hover:text-green-700 transition-colors">Portfolio</a>
                <a href="/about" className="hover:text-green-700 transition-colors">About</a>
                <a href="/#feedback" className="hover:text-green-700 transition-colors">
                Feedback/Questions
                </a>
                </nav>
            </motion.header>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-12 lg:py-16">

                

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-sm"
                >
                    <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm tracking-wide uppercase mb-6">
                        <Leaf className="w-4 h-4" />
                        About Amend Landscaping
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900">
                        Our Story
                    </h1>
                </div>

                    <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                        <p>
                            Here at{' '}
                            <span className="font-semibold text-gray-900">
                                Amend Landscaping LLC
                            </span>
                            , we provide reliable and affordable lawn care and
                            landscaping services to residential and commercial
                            properties throughout Fort Wayne, Indiana.
                        </p>

                        <p>
                            Established in{' '}
                            <span className="font-semibold text-gray-900">
                                2024
                            </span>
                            , Amend Landscaping LLC was founded by{' '}
                            <span className="font-semibold text-gray-900">
                                16-year-old Raydin Garrett
                            </span>
                            , a hungry high school student looking to make a
                            difference for his future.
                        </p>

                        <p>
                            Amend has since grown to service multiple
                            residential properties, as well as smaller
                            commercial properties throughout the area.
                        </p>

                        <p>
                            Our focus is simple:
                            <span className="font-semibold text-gray-900">
                                {' '}
                                quality work, dependable service, professional
                                results, and most importantly, happy clients.
                            </span>
                        </p>

                        <p>
                            Whether you need recurring lawn maintenance,
                            seasonal cleanups, mulch installations, or property
                            upkeep, we're here to help keep your property
                            looking its best.
                        </p>
                    </div>

                    {/* Values */}
                    <div className="grid md:grid-cols-3 gap-8 mt-14 pt-12 border-t border-gray-100">

                        <div>
                            <Award className="w-10 h-10 text-green-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Quality Work
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Every project is completed with attention to
                                detail and a commitment to professional results.
                            </p>
                        </div>

                        <div>
                            <Users className="w-10 h-10 text-green-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Dependable Service
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                We show up when we say we will and deliver
                                reliable, consistent service every time.
                            </p>
                        </div>

                        <div>
                            <Target className="w-10 h-10 text-green-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Happy Clients
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our success is measured by satisfied customers
                                and long-term relationships built on trust.
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-14 pt-12 border-t border-gray-100 text-center">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Ready to transform your property?
                        </h2>

                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                            Let Amend Landscaping help maintain and enhance your
                            outdoor spaces with reliable, professional service.
                        </p>

                        <a
                            href="/book"
                            className="inline-flex items-center px-8 py-4 rounded-2xl bg-green-700 text-white font-bold hover:bg-green-800 transition-colors"
                        >
                            Request a Service
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12 text-center">
                <h3 className="text-2xl font-extrabold text-green-700 tracking-tight mb-3">
                    Amend
                    <span className="text-gray-800">Landscaping</span>
                </h3>

                <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">
                    © {new Date().getFullYear()} Amend Landscaping.
                </p>
            </footer>
        </div>
    );
};

export default About;