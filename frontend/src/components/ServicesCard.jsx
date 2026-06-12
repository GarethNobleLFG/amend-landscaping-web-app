import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Wrench, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';
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
          className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {service ? 'Update the details for this service.' : 'Enter a name for the new service.'}
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Name
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              placeholder="e.g. Lawn Mowing & Edging"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Description
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              rows={3}
              placeholder="e.g. Full lawn mowing, edging, and cleanup"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Banner Image
            </label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-100 group">
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSelectorOpen(true)}
                    className="bg-white text-gray-900 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition shadow-sm"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={() => { setImageId(null); setImagePreview(''); }}
                    className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSelectorOpen(true)}
                className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-green-400 hover:bg-green-50/20 transition"
              >
                <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs font-semibold text-gray-600">Select Banner Image</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Browse from Image Registry</span>
              </button>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Listing Rank (Lower shows first)
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="0"
              value={listingRank}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setListingRank(value === '' ? 0 : parseInt(value, 10));
                }
              }}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Available for Booking</span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isAvailable ? 'bg-green-500' : 'bg-gray-200'
                }`}
            >
              <span className={`absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isAvailable ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !name.trim()}
              className="flex-2 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition"
            >
              {saving ? 'Saving…' : service ? 'Save Changes' : 'Create Service'}
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
};

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-7 w-full max-sm text-center"
      >
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Service?</h2>
        <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Keep It
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition"
          >
            {isDeleting ? 'Deleting…' : 'Yes, Delete'}
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