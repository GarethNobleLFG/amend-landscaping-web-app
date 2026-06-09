import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useLandingImages, useAddLandingImage, useDeleteLandingImage } from '../hooks/landingImageHooks';
import ImageSelectorModal from './ImageSelectorModal';

const LandingImagesTab = () => {
    const { images, fetchLandingImages, isLoading } = useLandingImages();
    const { addLandingImage, isLoading: isAdding } = useAddLandingImage();
    const { deleteLandingImage } = useDeleteLandingImage();

    const [showSelector, setShowSelector] = useState(false);

    useEffect(() => { fetchLandingImages(); }, [fetchLandingImages]);

    const handleSelectImage = async (imageId) => {
        const result = await addLandingImage(imageId);
        if (result.success) {
            fetchLandingImages();
        } else {
            alert(result.error || 'Failed to add image to landing page');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Remove this image from the landing page? (It will still remain in the registry)')) {
            const result = await deleteLandingImage(id);
            if (result.success) fetchLandingImages();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <ImageIcon className="text-green-600" /> Landing Page Assets
                    </h2>
                    <p className="text-gray-500 text-sm">Manage the images displayed on the homepage hero section.</p>
                </div>
                <button
                    onClick={() => setShowSelector(true)}
                    disabled={isAdding}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-md disabled:opacity-50"
                >
                    {isAdding ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    Add from Registry
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600 w-10 h-10" /></div>
            ) : images.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm p-16 text-center border border-gray-100 flex flex-col items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No landing images set</h3>
                    <p className="text-gray-500 mb-8">Select images from your registry to display them on the landing page.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    <AnimatePresence>
                        {images.map((img) => (
                            <motion.div
                                key={img.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                            >
                                <img 
                                    src={img.url} 
                                    alt="Landing" 
                                    className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <ImageSelectorModal 
                isOpen={showSelector}
                onClose={() => setShowSelector(false)}
                onSelect={(id) => handleSelectImage(id)}
            />
        </div>
    );
};

export default LandingImagesTab;