import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Header from '../components/Header';
import { Helmet } from 'react-helmet-async';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-neutral-50 text-gray-800">
            <Helmet>
                <title>Privacy Policy | Amend Landscaping LLC</title>
            </Helmet>
            <Header />

            <div className="max-w-4xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm uppercase tracking-wide mb-6">
                        <Shield className="w-4 h-4" />
                        Trust & Security
                    </div>
                    <h1 className="text-5xl font-black text-gray-900">Privacy Policy</h1>
                    <p className="mt-4 text-gray-600">Last Updated: July 6, 2026</p>
                </motion.div>

                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-sm space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p className="text-gray-600 mb-4">
                            We collect information you provide directly to us when requesting a quote, booking a service, or sending feedback. This includes:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li><strong>Contact Information:</strong> Name, email address, and phone number.</li>
                            <li><strong>Service Details:</strong> Physical address (for service visits), property type (residential/commercial), and specific landscaping needs.</li>
                            <li><strong>Communications:</strong> Any messages sent via our feedback or inquiry forms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-600 mb-4">We use the collected data to:</p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li>Provide professional price estimates and quotes.</li>
                            <li>Schedule and perform requested landscaping or lawn maintenance services.</li>
                            <li>Communicate regarding appointments, weather delays, or service updates.</li>
                            <li>Improve our website and customer service experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Retention & Sharing</h2>
                        <p className="text-gray-600">
                            We do not sell, rent, or trade your personal information. Data is stored securely in our private database and is only accessible by authorized Amend Landscaping personnel for the purpose of completing your requested services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your Rights</h2>
                        <p className="text-gray-600">
                            You may request to view, update, or delete your contact information at any time by contacting us directly at <span className="font-semibold">amendlandscapingllc@gmail.com</span>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;