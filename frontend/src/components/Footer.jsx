import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-14 pb-10">
            <div className="max-w-7xl mx-auto px-6">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

                    {/* Brand */}
                    <div>
                        <h3 className="text-xl md:text-2xl font-extrabold text-green-700 tracking-tight flex items-center justify-center md:justify-start gap-2">
                            <img
                                src="/logo.webp"
                                loading="lazy"
                                alt="Amend Landscaping Logo"
                                className="h-12 md:h-16 w-auto object-contain -mt-1"
                            />
                            Amend
                            <span className="text-gray-800">Landscaping LLC</span>
                        </h3>

                        <p className="mt-3 text-sm text-gray-600">
                            Est. 2024 — Landscaping & Lawn Maintenance in Fort Wayne
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                            Commercial & Residential Services
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3">Contact</h4>

                        <p className="text-sm text-gray-600">
                            📍 6128 Stellhorn Rd, Fort Wayne, IN 46815
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                            📞 (260) 715-6959
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                            ✉️ amendlandscaping@gmail.com
                        </p>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3">Follow Us</h4>

                        <a
                            href="https://instagram.com/amendlandscapingllc"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600 hover:text-green-700 transition"
                        >
                            <FaInstagram className="w-4 h-4" />
                            @amendlandscapingllc
                        </a>

                        <a
                            href="https://facebook.com/amendlandscapingllc"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600 hover:text-green-700 transition mt-2"
                        >
                            <FaFacebook className="w-4 h-4" />
                            Amend Landscaping LLC
                        </a>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="mt-10 border-t border-gray-100 pt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                    <a href="/about" className="hover:text-green-700 transition">
                        About Us
                    </a>

                    <a href="/pricing" className="hover:text-green-700 transition">
                        Pricing
                    </a>

                    <a href="/policies" className="hover:text-green-700 transition">
                        Policies
                    </a> 

                    <a href="/privacy" className="hover:text-green-700 transition">
                        Privacy
                    </a>

                    <a href="/terms" className="hover:text-green-700 transition">
                        Terms
                    </a>

                    <a href="/commercial" className="hover:text-green-700 transition">
                        Commercial Property Registration
                    </a>
                </div>

                {/* Bottom */}
                <div className="mt-8 text-center text-xs text-gray-400 font-bold tracking-widest uppercase">
                    © {new Date().getFullYear()} Amend Landscaping LLC. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;