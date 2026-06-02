import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useGetImages } from '../hooks/imageRegistryHooks';

const ImageSelectorModal = ({ isOpen, onClose, onSelect }) => {
    const { images, fetchImages, isLoading } = useGetImages();

    useEffect(() => {
        if (isOpen) fetchImages();
    }, [isOpen, fetchImages]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={onClose}
            />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl p-8 relative z-10 shadow-2xl flex flex-col"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold">Select from Registry</h3>
                        <p className="text-sm text-gray-500">Pick a previously uploaded image for this service.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-green-600 w-10 h-10" />
                            <p className="mt-4 text-gray-500 font-medium">Loading your registry...</p>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
                            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium text-lg">No images found in registry.</p>
                            <p className="text-sm text-gray-400">Upload images in the Image Registry tab first.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((img) => (
                                <motion.button
                                    key={img.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        onSelect(img.id, img.image_data);
                                        onClose();
                                    }}
                                    className="group relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border-2 border-transparent hover:border-green-500 transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    <img 
                                        src={img.image_data} 
                                        alt="Registry Selection" 
                                        className="w-full h-full object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-white text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Select Image</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ImageSelectorModal;