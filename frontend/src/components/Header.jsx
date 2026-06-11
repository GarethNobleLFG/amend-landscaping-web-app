import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ showNav = true, showBackToHome = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Services', href: isHome ? '#services' : '/#services' },
        { name: 'Policies', href: '/policies' },
        { name: 'About', href: '/about' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Feedback/Questions', href: isHome ? '#feedback' : '/#feedback' },
    ];

    const handleLogoClick = () => {
        if (isHome) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
        setIsMenuOpen(false);
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full px-6 lg:px-12 py-5 bg-white lg:bg-white/80 border-b border-gray-200/50 shadow-sm flex justify-between items-center sticky top-0 z-50 will-change-transform transition-all font-medium"
        >
            <div
                onClick={handleLogoClick}
                className="flex items-center gap-2 text-2xl font-black text-green-800 tracking-tight cursor-pointer"
            >
                <img
                    src="/logo.png"
                    alt="Amend Landscaping Logo"
                    className="h-14 md:h-16 w-auto object-contain -mt-1"
                />
                {/* Text hidden on mobile, visible on medium screens and up */}
                <span className="hidden md:inline">Amend</span> 
                <span className="text-gray-900 hidden md:inline">Landscaping</span>
            </div>

            <div className="flex items-center gap-8">
                {/* Desktop Navigation */}
                {showNav && (
                    <nav className="space-x-8 hidden md:flex items-center text-gray-600">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="hover:text-green-700 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                )}

                <div className="flex items-center gap-4">
                    {showBackToHome && (
                        <button
                            onClick={() => {
                                navigate('/');
                                setIsMenuOpen(false);
                            }}
                            className={`text-gray-600 hover:text-green-700 transition-colors font-bold text-sm tracking-wide uppercase px-4 py-2 hover:bg-neutral-100 rounded-lg ${showNav ? 'hidden md:block' : ''}`}
                        >
                            Back To Home
                        </button>
                    )}

                    {/* Mobile Hamburger Toggle */}
                    {showNav && (
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-green-700"
                        >
                            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown - Solid white background outside the blurred header flow */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-2xl md:hidden">
                    <nav className="flex flex-col p-6 space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-lg text-gray-700 hover:text-green-700 font-semibold"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </motion.header>
    );
};

export default Header;