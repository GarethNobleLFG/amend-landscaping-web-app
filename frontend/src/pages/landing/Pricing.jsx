import { motion } from 'framer-motion';
import { Leaf, Scissors, Sparkles, Trash2 } from 'lucide-react';
import Header from '../../components/Header';

const Pricing = () => {
    return (
        <div className="min-h-screen bg-neutral-50 text-gray-800">

            {/* Navigation (same style as landing/about if you want consistency) */}
            <Header />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-16">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm uppercase tracking-wide mb-6">
                        <Leaf className="w-4 h-4" />
                        Transparent Pricing
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-gray-900">
                        Simple, honest <span className="text-green-700">pricing</span>
                    </h1>

                    <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                        Clear starting rates so you know exactly what to expect before we begin any work.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Mowing */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm"
                    >
                        <Scissors className="w-10 h-10 text-green-600 mb-4" />

                        <h3 className="text-2xl font-bold mb-2">Mowing</h3>
                        <p className="text-gray-600 mb-6">
                            Residential & commercial lawn mowing services.
                        </p>

                        <div className="text-3xl font-black text-green-700">
                            $40
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Minimum starting price
                        </p>
                    </motion.div>

                    {/* Mulch / Rock */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm"
                    >
                        <Sparkles className="w-10 h-10 text-green-600 mb-4" />

                        <h3 className="text-2xl font-bold mb-2">
                            Mulch / Rock Installations
                        </h3>

                        <p className="text-gray-600 mb-6">
                            Professional installation for landscaping upgrades.
                        </p>

                        <div className="text-3xl font-black text-green-700">
                            $0.75
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            per sq ft (starting price)
                        </p>
                    </motion.div>

                    {/* Cleanups */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm"
                    >
                        <Trash2 className="w-10 h-10 text-green-600 mb-4" />

                        <h3 className="text-2xl font-bold mb-2">Cleanups</h3>

                        <p className="text-gray-600 mb-6">
                            Seasonal and property cleanup services.
                        </p>

                        <div className="text-3xl font-black text-green-700">
                            $75 – $225
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            per hour
                        </p>
                    </motion.div>

                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <h2 className="text-3xl font-black text-gray-900 mb-4">
                        Ready to transform your property?
                    </h2>

                    <a
                        href="/book"
                        className="inline-flex px-8 py-4 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-800 transition"
                    >
                        Request a Service
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Pricing;