import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Image as ImageIcon, X, Upload, Loader2 } from 'lucide-react';
import { useGetImages, useUploadImage, useDeleteImage } from '../hooks/imageRegistryHooks';
import { compressImage } from '../util/compressImage';

const ImageRegistryTab = () => {
    const { images, fetchImages, isLoading } = useGetImages();
    const { uploadImage, isLoading: isUploading } = useUploadImage();
    const { deleteImage } = useDeleteImage();

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => { fetchImages(); }, [fetchImages]);

    /* Around Line 20 */
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsProcessing(true); // Start loading animation
        try {
            const compressed = await compressImage(file);
            setSelectedFile(compressed);
            setPreviewUrl(compressed);
        } catch (error) {
            console.error("Compression/HEIC fail:", error);
            alert("Failed to process image. Please try a standard JPEG or PNG.");
        }
        finally {
            setIsProcessing(false); // Stop loading animation
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const result = await uploadImage(selectedFile);
        if (result.success) {
            fetchImages();
            setShowUploadModal(false);
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            const success = await deleteImage(id);
            if (success) fetchImages();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ImageIcon className="text-green-600" /> Image Registry
                </h2>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-md"
                >
                    <Plus className="w-5 h-5" /> Upload Image
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600 w-10 h-10" /></div>
            ) : images.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-sm p-16 text-center border border-gray-100 flex flex-col items-center justify-center"
                >
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <ImageIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Registry is empty</h3>
                    <p className="text-gray-500 text-lg mb-8 max-w-md">
                        You haven't uploaded any images yet. Start by uploading an image to use it for your service banners.
                    </p>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-green-600/10 text-green-700 border-2 border-green-600/20 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-600 hover:text-white transition-all"
                    >
                        <Plus className="w-5 h-5" /> Add Your First Image
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <AnimatePresence>
                        {images.map((img) => (
                            <motion.div
                                key={img.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                            >
                                <img src={img.image_data} alt="Registry" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                        title="Delete Image"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <span className="text-[10px] text-white font-mono bg-black/50 px-2 py-0.5 rounded truncate w-4/5 text-center">
                                        ID: {img.id.slice(0, 8)}...
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-md rounded-3xl p-8 relative z-10 shadow-2xl"
                        >
                            <button onClick={() => setShowUploadModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X /></button>
                            <h3 className="text-2xl font-bold mb-6">Upload to Registry</h3>

                            <div className="space-y-6">
                                <label className="block">
                                    <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl transition-all ${previewUrl ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400'}`}>
                                        {isProcessing ? (
                                            <div className="text-center py-4">
                                                <Loader2 className="mx-auto h-12 w-12 text-green-600 animate-spin mb-2" />
                                                <p className="text-sm text-gray-600 font-bold">Converting Image...</p>
                                                <p className="text-xs text-gray-400">Optimizing for web (HEIC taking extra time)</p>
                                            </div>
                                        ) : previewUrl ? (
                                            <div className="text-center">
                                                <img src={previewUrl} className="mx-auto h-32 w-32 object-cover rounded-xl mb-2 shadow-md" />
                                                <p className="text-xs text-green-600 font-bold">Image Optimized!</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <span className="relative cursor-pointer bg-white rounded-md font-bold text-green-600 hover:text-green-500">Select a file</span>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</p>
                                            </div>
                                        )}
                                        <input type="file" className="sr-only" accept="image/*,.heic,.heif" onChange={handleFileChange} />
                                    </div>
                                </label>

                                <button
                                    disabled={!selectedFile || isUploading}
                                    onClick={handleUpload}
                                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isUploading ? <Loader2 className="animate-spin" /> : 'Confirm Upload'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageRegistryTab;