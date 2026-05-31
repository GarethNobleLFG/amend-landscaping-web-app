import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion as motionElement } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, ArrowLeft, Check, User, Sparkles, MapPin } from 'lucide-react';
import { useCreateAppointment } from '../../hooks/appointmentHooks';
import SuccessModal from './SuccessModal';

const availableServices = [
    { id: 'mowing', label: 'Precision Mowing' },
    { id: 'landscaping', label: 'Custom Landscaping' },
    { id: 'tree_trimming', label: 'Arborist / Tree Trimming' },
    { id: 'cleanup', label: 'Seasonal Yard Cleanup' },
    { id: 'fertilization', label: 'Fertilization & Weed Control' },
    { id: 'design', label: '3D Backyard Design' }
];

const slideImages = [
    '/sample-imgs/betsys-cropped.jpg',
    '/sample-imgs/istockphoto-1312760160-612x612.jpg',
    '/sample-imgs/istockphoto-1347784849-612x612.jpg',
    '/sample-imgs/rsz_dsc_0034.jpg',
    '/sample-imgs/images.jpg'
];

export default function Booking() {
    const [step, setStep] = useState(1);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    // Dynamically retrieve the commercial boolean flag from router state
    const isCommercial = !!location.state?.isCommercial;

    // Dynamically retrieve the commercial boolean flag from router state
    const isCommercial = !!location.state?.isCommercial;

    const { createAppointment, isLoading, error } = useCreateAppointment();

    const handleBackClick = () => {
        if (step === 2) {
            prevStep();
        } else {
            // Intelligent back router
            if (isCommercial) {
                navigate('/commercial');
            } else {
                navigate('/');
            }
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slideImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const prevIndex = (currentIndex - 1 + slideImages.length) % slideImages.length;
    const nextIndex = (currentIndex + 1) % slideImages.length;

    const [formData, setFormData] = useState({
        servicesRequested: [],
        description: '',
        scheduledDate: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceToggle = (serviceId) => {
        setFormData(prev => {
            const isSelected = prev.servicesRequested.includes(serviceId);
            if (isSelected) {
                return { ...prev, servicesRequested: prev.servicesRequested.filter(id => id !== serviceId) };
            } else {
                return { ...prev, servicesRequested: [...prev.servicesRequested, serviceId] };
            }
        });
    };

    const nextStep = () => window.scrollTo(0, 0) || setStep(prev => prev + 1);
    const prevStep = () => window.scrollTo(0, 0) || setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const servicesObj = formData.servicesRequested.reduce((acc, curr) => {
            acc[curr] = true;
            return acc;
        }, {});

        // Package the exact structure expected by the database models
        const payload = {
            ...formData,
            servicesRequested: servicesObj,
            is_commercial: isCommercial, // Matches model validation
            scheduledDate: formData.scheduledDate === '' ? null : formData.scheduledDate
        };

        const result = await createAppointment(payload);

        if (result.success) {
            setSubmitSuccess(true);
        } else {
            console.error("Booking Error:", result.error);
        }
    };

    // Animation variants for smooth multi-step transitions
    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
    };

    return (
        <div className="relative min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-green-200 py-12 px-4 sm:px-6 flex flex-col items-center overflow-hidden">

            {/* Top Left Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <button
                    onClick={handleBackClick}
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-gray-700 font-bold px-4 py-3 rounded-xl shadow-lg border border-gray-100 hover:bg-green-50 hover:text-green-700 transition-all hover:-translate-x-1"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">
                        {step === 2 ? (isCommercial ? 'Back to Requirements' : 'Back to Services') : (isCommercial ? 'Back to Commercial' : 'Back to Home')}
                    </span>
                </button>
            </div>

            {/* Background Image Collage */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-100/50 rounded-full blur-[140px] z-0"></div>
                <AnimatePresence mode="popLayout">
                    {/* Left Floating Image */}
                    <motionElement.img
                        key={`prev-${currentIndex}`}
                        src={slideImages[prevIndex]}
                        initial={{ opacity: 0, x: '-60%', y: '10%', rotate: -15, scale: 0.8 }}
                        animate={{ opacity: 0.8, x: '-15%', y: '-10%', rotate: -8, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 1.2, ease: "anticipate" }}
                        className="absolute top-[15%] left-[5%] w-[35%] max-w-[400px] h-[45%] object-cover rounded-3xl shadow-2xl border-4 border-white z-10 hidden lg:block"
                    />

                    {/* Right Floating Image */}
                    <motionElement.img
                        key={`next-${currentIndex}`}
                        src={slideImages[nextIndex]}
                        initial={{ opacity: 0, x: '60%', y: '-10%', rotate: 15, scale: 0.8 }}
                        animate={{ opacity: 0.8, x: '15%', y: '10%', rotate: 8, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 1.2, ease: "anticipate" }}
                        className="absolute bottom-[10%] right-[5%] w-[35%] max-w-[400px] h-[45%] object-cover rounded-3xl shadow-2xl border-4 border-white z-10 hidden lg:block"
                    />
                </AnimatePresence>
            </div>

            {/* Header */}
            <div className="relative z-20 max-w-3xl w-full mb-12 text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-black text-green-800 tracking-tight mb-8 select-none">
                    Amend <Leaf className="w-6 h-6 text-green-600 fill-green-600/20" /> {isCommercial ? 'Commercial' : 'Landscaping'}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4 drop-shadow-sm">
                    {isCommercial ? 'Commercial Registration' : 'Book an Appointment'}
                </h1>
                
                <p className="text-lg text-gray-700 font-medium drop-shadow-sm max-w-lg mx-auto">
                    {isCommercial 
                        ? 'Register your property profile to get scheduled contracts, bids, and customized service standards.' 
                        : "Tell us what your yard needs, and we'll handle the rest."}
                </p>

                {/* Progress Bar */}
                <div className="flex items-center justify-center gap-4 mt-8 max-w-md mx-auto">
                    <div className={`h-2 rounded-full flex-1 transition-colors duration-500 shadow-sm ${step >= 1 ? 'bg-green-500' : 'bg-white border border-gray-200'}`}></div>
                    <div className={`h-2 rounded-full flex-1 transition-colors duration-500 shadow-sm ${step >= 2 ? 'bg-green-500' : 'bg-white border border-gray-200'}`}></div>
                </div>
                <div className="flex justify-between max-w-md mx-auto mt-2 text-sm font-bold text-gray-500">
                    <span className={step >= 1 ? 'text-green-700' : ''}>
                        {isCommercial ? '1. Requirements' : '1. Services'}
                    </span>
                    <span className={step >= 2 ? 'text-green-700' : ''}>
                        {isCommercial ? '2. Company Details' : '2. Details'}
                    </span>
                </div>
            </div>

            {/* Multi-step Form Container */}
            <div className="relative z-20 w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/50 p-8 md:p-12 overflow-hidden">

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold">
                        {error}
                    </div>
                )}

                <AnimatePresence mode="wait">

                    {/* ----- STEP 1: SERVICES OR REQUIREMENTS ----- */}
                    {step === 1 && (
                        <motionElement.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <Sparkles className="w-8 h-8 text-green-500" />
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {isCommercial ? 'Select desired service programs' : 'What does your yard need?'}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {availableServices.map((service) => {
                                    const isSelected = formData.servicesRequested.includes(service.id);
                                    return (
                                        <div
                                            key={service.id}
                                            onClick={() => handleServiceToggle(service.id)}
                                            className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-200 hover:bg-white bg-white/50'
                                                }`}
                                        >
                                            <span className={`font-bold ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>{service.label}</span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                                                }`}>
                                                {isSelected && <Check className="w-4 h-4" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    {isCommercial ? 'Property Details / Contract Cycles (Optional)' : 'Tell us more about the project (Optional)'}
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full bg-white/80 border border-gray-200 rounded-xl p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all resize-none"
                                    placeholder={isCommercial 
                                        ? "E.g., Office park with 3 green belts. Requesting bi-weekly maintenance schedules and winterizations." 
                                        : "E.g., I have a large oak tree that needs structural pruning, and the front flower beds need fresh mulch."}
                                ></textarea>
                            </div>

                            <button
                                onClick={nextStep}
                                disabled={formData.servicesRequested.length === 0}
                                className="mt-auto w-full flex items-center justify-center gap-2 bg-green-700 disabled:bg-gray-300 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 disabled:hover:bg-gray-300 transition-colors shadow-lg"
                            >
                                Next: {isCommercial ? 'Company & Rep Details' : 'Personal Details'} <ArrowRight className="w-5 h-5" />
                            </button>
                        </motionElement.div>
                    )}

                    {/* ----- STEP 2: DETAILS ----- */}
                    {step === 2 && (
                        <motionElement.form key="step2" onSubmit={handleSubmit} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <User className="w-8 h-8 text-green-500" />
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {isCommercial ? 'Company & Rep Details' : 'Your Information'}
                                </h2>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            {isCommercial ? 'Company Name *' : 'Full Name *'}
                                        </label>
                                        <input 
                                            required 
                                            type="text" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleInputChange} 
                                            className="w-full bg-white/80 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-medium" 
                                            placeholder={isCommercial ? "Amend Landscaping LLC" : "John Doe"} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            {isCommercial ? 'Representative / Contact Phone *' : 'Phone Number *'}
                                        </label>
                                        <input 
                                            required 
                                            type="tel" 
                                            name="phoneNumber" 
                                            value={formData.phoneNumber} 
                                            onChange={handleInputChange} 
                                            className="w-full bg-white/80 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-medium" 
                                            placeholder="(555) 123-4567" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {isCommercial ? 'Organization Email Address *' : 'Email Address *'}
                                    </label>
                                    <input 
                                        required 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-white/80 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-medium" 
                                        placeholder={isCommercial ? "facilities@corporate.com" : "john@example.com"} 
                                    />
                                </div>

                                <div className="pt-4 pb-2 flex items-center gap-2 text-green-700 font-bold border-b border-gray-100">
                                    <MapPin className="w-5 h-5" /> {isCommercial ? 'Commercial Site Address' : 'Service Address'}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {isCommercial ? 'Property Street Address *' : 'Street Address *'}
                                    </label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-white/80 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-medium" 
                                        placeholder={isCommercial ? "100 Corporate Parkway, Suite 200" : "123 Oak Street"} 
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                                        <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/80 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-medium" placeholder="Springfield" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">State *</label>
                                        <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-white/80 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-medium" placeholder="IL" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Zip Code *</label>
                                        <input required type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="w-full bg-white/80 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-medium" placeholder="62701" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-auto">
                                <button type="button" onClick={prevStep} className="flex-1 max-w-[120px] flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors">
                                    <ArrowLeft className="w-5 h-5" /> Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-700 disabled:bg-green-400 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg"
                                >
                                    {isLoading ? 'Submitting Registration...' : (isCommercial ? 'Submit Contract Registration' : 'Submit Request')}
                                </button>
                            </div>
                        </motionElement.form>
                    )}

                </AnimatePresence>
            </div>

            <SuccessModal
                isOpen={submitSuccess}
                firstName={isCommercial ? `${formData.name}` : formData.name.split(' ')[0]}
            />

        </div>
    );
}