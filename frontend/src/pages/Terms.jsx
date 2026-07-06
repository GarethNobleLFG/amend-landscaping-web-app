import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Header from '../components/Header';
import { Helmet } from 'react-helmet-async';

const Terms = () => {
    return (
        <div className="min-h-screen bg-neutral-50 text-gray-800">
            <Helmet>
                <title>Terms of Service | Amend Landscaping LLC</title>
            </Helmet>
            <Header />

            <div className="max-w-4xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm uppercase tracking-wide mb-6">
                        <FileText className="w-4 h-4" />
                        User Agreement
                    </div>
                    <h1 className="text-5xl font-black text-gray-900">Terms of Service</h1>
                    <p className="mt-4 text-gray-600">Last Updated: July 6, 2026</p>
                </motion.div>

                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-sm space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600">
                            By accessing amendlandscapingllc.com or requesting our services, you agree to be bound by these Terms of Service and all applicable laws in the State of Indiana.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Estimates and Quotes</h2>
                        <p className="text-gray-600">
                            Any quote provided through the website is an estimate based on information provided. We reserve the right to adjust pricing upon physical inspection of the property or if the service scope changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Limitation of Liability</h2>
                        <p className="text-gray-600">
                            Amend Landscaping LLC is not liable for damage to hidden items (e.g., shallow invisible fences, unmarked irrigation heads, or cables) not disclosed in writing prior to service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Governing Law</h2>
                        <p className="text-gray-600">
                            These terms are governed by the laws of the State of Indiana. Any disputes shall be resolved in the courts of Allen County, IN.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;