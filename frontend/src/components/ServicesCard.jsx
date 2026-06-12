import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Wrench, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import {
  useGetAllServices, useCreateService, useUpdateService, useDeleteService,
} from '../hooks/serviceHooks';
import ImageSelectorModal from './ImageSelectorModal';

// ── Service Form Modal ───────────────────────────────────────────────────────
const ServiceFormModal = ({ isOpen, service, onClose, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(service?.name ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [isAvailable, setIsAvailable] = useState(service?.is_available ?? true);
  const [listingRank, setListingRank] = useState(service?.listing_rank ?? 0);

  // Track the ID for the database and the data for the preview
  const [imageId, setImageId] = useState(service?.image_id ?? null);
  const [imagePreview, setImagePreview] = useState(service?.imageUrl ?? '');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const { createService } = useCreateService();
  const { updateService } = useUpdateService();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);

    // We send imageId (the UUID) to the backend
    const result = service
      ? await updateService(service.id, name.trim(), description.trim(), isAvailable, imageId, listingRank)
      : await createService(name.trim(), description.trim(), isAvailable, imageId, listingRank);

    setSaving(false);
    if (result.success) onSaved();
    else alert(result.error);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="bg-white rounded-[1.5rem] shadow-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

            {/* --- Left Column: Header & Fields --- */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-none">
                  {service ? 'Edit Service' : 'Add New Service'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {service ? 'Update details below.' : 'Fill in the details for your new service.'}
                </p>
              </div>

              <div className="space-y-3">
                {/* Service Name Input */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                    Service Name
                  </label>
                  <input
                    // Removed shadow-sm and kept the larger padding/rounded corners
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-4 text-base font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                    placeholder="e.g. Lawn Mowing"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Listing Rank Input */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                    Listing Rank (Priority)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    // Applied the same flat bulky style here
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-4 text-base font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                    placeholder="0"
                    value={listingRank}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        setListingRank(e.target.value === '' ? 0 : parseInt(e.target.value, 10));
                      }
                    }}
                  />
                  <div className="flex flex-col mt-1 mb-2 ml-1">
                    <p className="text-[10px] text-gray-400">
                      Lower numbers appear first on the site (e.g., 0, 1, 2)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Right Column: Banner Image (Fixed Shape) --- */}
            <div className="flex flex-col">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Banner Image
              </label>
              {imagePreview ? (
                // Update height to h-[220px] here
                <div className="relative rounded-2xl overflow-hidden border border-gray-100 group h-[250px] w-full shadow-inner">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  {/* ... overlay content ... */}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSelectorOpen(true)}
                  // Update height to h-[220px] here
                  className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl h-[250px] hover:border-green-400 hover:bg-green-50/20 transition group"
                >
                  <ImageIcon className="w-6 h-6 text-gray-300 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-500">Pick Banner</span>
                </button>
              )}
            </div>

            {/* --- Full Width: Description --- */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                className="w-full h-[16vh] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                rows={2}
                placeholder="Brief description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* --- Full Width: Availability Toggle --- */}
            <div className="md:col-span-2 flex items-center gap-3 py-3 border-t border-gray-100 mt-1">
              <span className="text-sm font-semibold text-gray-700">Available</span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isAvailable ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* --- Action Buttons (Equal Size & Compact) --- */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !name.trim()}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition shadow-sm"
            >
              {saving ? 'Saving…' : service ? 'Update' : 'Create'}
            </button>
          </div>
        </motion.div>
      </div>

      <ImageSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={(id, data) => {
          setImageId(id);
          setImagePreview(data);
        }}
      />
    </>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center"
      >
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Service?</h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          This action cannot be undone. Are you sure you want to remove this service?
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition order-1 sm:order-2"
          >
            {isDeleting ? 'Deleting…' : 'Yes, Delete'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition order-2 sm:order-1"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Service Card ──────────────────────────────────────────────────────────────
const ServiceCard = ({ service, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-white border border-gray-100 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
  >
    {service.imageUrl && (
      <div className="w-full h-36 relative overflow-hidden bg-gray-50 border-b border-gray-100">
        <img src={service.imageUrl} alt="Service" className="..." />
      </div>
    )}

    <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{service.name}</p>
          {service.description && (
            <p className="text-xs text-gray-500 mt-1 leading-snug">{service.description}</p>
          )}
        </div>
        <span className="text-xs text-gray-400 font-medium select-none">
          Rank: {service.listing_rank}
        </span>
      </div>

      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${service.is_available
        ? 'bg-green-50 text-green-700'
        : 'bg-red-50 text-red-600'
        }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${service.is_available ? 'bg-green-500' : 'bg-red-500'}`} />
        {service.is_available ? 'Available' : 'Unavailable'}
      </span>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onEdit(service)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-bold transition border border-green-100"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <button
          onClick={() => onDelete(service)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition border border-red-100"
        >
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    </div>
  </motion.div>
);

// ── Main ServicesTab ──────────────────────────────────────────────────────────
const ServicesTab = () => {
  const { services, fetchAllServices, isLoading, error } = useGetAllServices();
  const { deleteService } = useDeleteService();

  const [formState, setFormState] = useState({ open: false, service: null });
  const [deleteState, setDeleteState] = useState({ open: false, service: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return; fetchAllServices();
  }, [fetchAllServices]);

  const handleSaved = () => {
    setFormState({ open: false, service: null });
    fetchAllServices();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const result = await deleteService(deleteState.service.id);
    setIsDeleting(false);
    if (result.success) {
      setDeleteState({ open: false, service: null });
      fetchAllServices();
    } else {
      alert(result.error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-green-500" />
            All Services
          </h2>
          <p className="text-sm text-gray-500 mt-1">Add, edit, or toggle availability of offered services.</p>
        </div>
        <button
          onClick={() => setFormState({ open: true, service: null })}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 mb-6">
          <p className="text-red-700 text-sm font-medium">Error: {error}</p>
        </div>
      )}

      {isLoading && services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="mt-4 text-gray-500 font-medium">Loading services…</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-500">Click "Add Service" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {services.map(svc => (
              <ServiceCard
                key={svc.id}
                service={svc}
                onEdit={(s) => setFormState({ open: true, service: s })}
                onDelete={(s) => setDeleteState({ open: true, service: s })}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {formState.open && (
          <ServiceFormModal
            isOpen
            service={formState.service}
            onClose={() => setFormState({ open: false, service: null })}
            onSaved={handleSaved}
          />
        )}
        {deleteState.open && (
          <DeleteModal
            isOpen
            onClose={() => setDeleteState({ open: false, service: null })}
            onConfirm={handleDeleteConfirm}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ServicesTab;