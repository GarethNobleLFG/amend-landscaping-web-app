import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useCreateFeedback } from '../hooks/feedbackHooks';

function FeedbackForm() {
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
 
  const [successMessage, setSuccessMessage] = useState('');
  const { createFeedback, isLoading } = useCreateFeedback();

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await createFeedback(formData);

    if (result.success) {
        setSuccessMessage(
            'Thank you! Your feedback has been submitted successfully.'
        );

        setFormData({
            email: '',
            message: ''
        });

        setErrors({});

        setTimeout(() => {
            setSuccessMessage('');
        }, 5000);
    } else {
        setErrors({
            submit:
                result.error ||
                'Unable to submit feedback. Please try again.'
        });
    }
};

  return (
    <section id="feedback" className="py-24 px-6 bg-neutral-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-green-700 font-extrabold tracking-[0.2em] uppercase text-sm mb-4">
            Feedback & Inquiries
          </h2>

          <h3 className="text-4xl font-black text-gray-900 mb-4">
            We'd love to hear from you
          </h3>

          <p className="text-lg text-gray-600">
            Questions, suggestions, or general feedback? Send us a message.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
        >
          {successMessage && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-4 text-green-700">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          {errors.submit && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
              {errors.submit}
            </div>
          )}

          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-700">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition ${
                  errors.email
                    ? 'border-red-400'
                    : 'border-gray-200 focus:border-green-500'
                }`}
              />
            </div>

            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-8">
            <label className="block font-semibold mb-2 text-gray-700">
              Message
            </label>

            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

              <textarea
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                className={`w-full pl-12 pr-4 py-4 rounded-xl border resize-none outline-none transition ${
                  errors.message
                    ? 'border-red-400'
                    : 'border-gray-200 focus:border-green-500'
                }`}
              />
            </div>

            {errors.message && (
              <p className="mt-2 text-sm text-red-500">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Feedback
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

export default FeedbackForm;