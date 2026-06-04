import { motion } from 'framer-motion';
import { Leaf, ShieldCheck } from 'lucide-react';

const Policies = () => {
    return (
        <div className="min-h-screen bg-neutral-50 text-gray-800">

            {/* Navigation */}
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
                <a href="/policies" className="hover:text-green-700 transition-colors">Policies</a>
                <a href="/about" className="hover:text-green-700 transition-colors">About</a>
                <a href="/pricing" className="hover:text-green-700 transition-colors">Pricing</a>
                <a href="/#feedback" className="hover:text-green-700 transition-colors">
                Feedback/Questions
                </a>
                </nav>
            </motion.header>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-16">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm uppercase tracking-wide mb-6">
                        <ShieldCheck className="w-4 h-4" />
                        Service Policies
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-gray-900">
                        Clear <span className="text-green-700">service expectations</span>
                    </h1>

                    <p className="mt-6 text-xl text-gray-600">
                        These policies help ensure efficient service, fair pricing,
                        and consistent quality for all clients.
                    </p>
                </motion.div>

                {/* Policies List */}
                <motion.div
                    
                    className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-sm space-y-8"
                >

                    {/* 1 */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Service Scope
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Recurring mowing services only (no one-time lawn cuts).
                        </p>
                    </div>

                    {/* 2 */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Overgrowth Fee
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Grass over 6 inches may receive a <span className="font-semibold text-gray-900">$20 overgrowth fee</span>.
                        </p>
                    </div>

                    {/* 3 */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Debris Removal
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Customers are responsible for removing trash and debris from lawns before service.
                        </p>
                    </div>

                    {/* 4 */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Personal Property
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Lawn furniture, toys, and personal items will not be moved by crew members.
                        </p>
                    </div>

                    {/* 5 */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Materials
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Materials are included in quoted pricing unless otherwise specified.
                        </p>
                    </div>

                    {/* 6 */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Cancellations / Skips
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Recurring clients may skip up to <span className="font-semibold text-gray-900">2 scheduled services per season</span>.
                        </p>
                    </div>

                </motion.div>

               
            </div>
        </div>
    );
};

export default Policies;