import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ showNav = true, showBackToHome = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    const navLinks = [
        { name: 'Services', href: isHome ? '#services' : '/#services' },
        { name: 'Policies', href: '/policies' },
        { name: 'About', href: '/about' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Feedback/Questions', href: isHome ? '#feedback' : '/#feedback' },
    ];

    const handleLogoClick = () => {
        if (isHome) {
            // If already home, scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Otherwise, navigate home
            navigate('/');
        }
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full px-6 lg:px-12 py-5 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm flex justify-between items-center sticky top-0 z-50 transition-all font-medium"
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
                Amend <Leaf className="w-6 h-6 text-green-600 fill-green-600/20" /> <span className="text-gray-900">Landscaping</span>
            </div>

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

            {showBackToHome && (
                <button
                    onClick={() => navigate('/')}
                    className="text-gray-600 hover:text-green-700 transition-colors font-bold text-sm tracking-wide uppercase px-4 py-2 hover:bg-neutral-100 rounded-lg"
                >
                    Back To Home
                </button>
            )}
        </motion.header>
    );
};

export default Header;