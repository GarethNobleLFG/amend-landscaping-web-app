import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/userHooks';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            const user = JSON.parse(userStr);
            if (user.admin) {
                navigate('/admin-dashboard');
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);

        if (result.success) {
            if (result.user && result.user.admin) {
                navigate('/admin-dashboard');
            } 
            else {
                alert('You do not have administrator permissions.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden border border-gray-100"
            >
                <div className="bg-green-700 p-8 text-center relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full mb-4 shadow-md">
                            <ShieldCheck className="w-8 h-8 text-green-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Admin Access</h2>
                        <p className="text-green-100 mt-1 text-sm">Sign in to manage appointments</p>
                    </div>
                    {/* Decorative background shapes */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-green-600 opacity-50 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-green-500 opacity-50 blur-2xl"></div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                            <input
                                required
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-white transition-all font-medium"
                                placeholder="Enter admin username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-white transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-8 flex items-center justify-center gap-2 bg-green-700 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-600 transition-all shadow-md active:scale-[0.98] disabled:bg-gray-400 disabled:active:scale-100"
                    >
                        {isLoading ? 'Authenticating...' : (
                            <>
                                Sign In <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" /> Secure environment
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
