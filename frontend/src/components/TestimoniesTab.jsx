import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, User, Trash2, Plus, Loader2, MessageSquare } from 'lucide-react';
import { useTestimonies } from '../hooks/testimonyHooks';

const TestimoniesTab = () => {
    const { testimonies, isLoading, fetchTestimonies, addTestimony, deleteTestimony } = useTestimonies();
    const [name, setName] = useState('');
    const [quote, setQuote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchTestimonies();
    }, [fetchTestimonies]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !quote.trim()) return;

        setIsSubmitting(true);
        const result = await addTestimony({ name, quote });
        
        if (result.success) {
            setName('');
            setQuote('');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT SIDE: Form */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-600" />
                    New Testimony
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Jane Doe"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Quote</label>
                        <div className="relative">
                            <Quote className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                                placeholder="What did they say about the service?"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none min-h-[120px]"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !name || !quote}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all shadow-md shadow-green-100 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        Save Testimony
                    </button>
                </form>
            </motion.div>

            {/* RIGHT SIDE: List */}
            <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                        Live Testimonies
                    </h2>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {testimonies.length} Total
                    </span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {testimonies.length === 0 && !isLoading && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
                            >
                                <p className="text-gray-400 font-medium">No testimonies yet. Add your first one to the left!</p>
                            </motion.div>
                        )}
                        {testimonies.map((testimony) => (
                            <motion.div
                                key={testimony.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group relative"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <p className="text-gray-700 italic leading-relaxed mb-3">"{testimony.quote}"</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                                                {testimony.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900">{testimony.name}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteTestimony(testimony.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TestimoniesTab;