import { useEffect, useState } from 'react';
import { Trash2, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import {
    useGetFeedback,
    useDeleteFeedback
} from '../hooks/feedbackHooks';

function FeedbackTab() {
    const {
        feedback,
        fetchFeedback,
        isLoading
    } = useGetFeedback();

    const {
        deleteFeedback,
        isLoading: deleting
    } = useDeleteFeedback();

    useEffect(() => {
        fetchFeedback();
    }, [fetchFeedback]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Delete this feedback entry?'
        );

        if (!confirmed) return;

        const result = await deleteFeedback(id);

        if (result.success) {
            fetchFeedback();
        } else {
            alert(result.error || 'Failed to delete feedback');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
        );
    }

    const ExpandableMessage = ({ message }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const isLong = message.length > 120;

        return (
            <div className="max-w-xl">
                <div className={`whitespace-pre-wrap break-words text-gray-700 transition-all duration-300 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                    {message}
                </div>
                {isLong && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 flex items-center gap-1 text-[10px] font-black text-green-700 hover:text-green-800 transition-colors uppercase tracking-widest"
                    >
                        {isExpanded ? (
                            <>Show Less <ChevronUp className="w-3 h-3" /></>
                        ) : (
                            <>Read More <ChevronDown className="w-3 h-3" /></>
                        )}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Mail className="w-6 h-6 text-green-600" />
                    Feedback & Inquiries
                </h2>
            </div>

            {feedback.length === 0 ? (
                <div className="py-16 text-center">
                    <p className="text-gray-500">
                        No feedback submissions yet.
                    </p>
                </div>
            ) : (
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-4 font-semibold">
                                Email
                            </th>
                            <th className="text-left px-6 py-4 font-semibold">
                                Message
                            </th>
                            <th className="text-left px-6 py-4 font-semibold">
                                Submitted
                            </th>
                            <th className="text-center px-6 py-4 font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {feedback.map((item) => (
                            <tr
                                key={item.id}
                                className="border-t border-gray-100"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {item.email}
                                </td>

                                <td className="px-6 py-4">
                                    <ExpandableMessage message={item.message} />
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(
                                        item.createdAt
                                    ).toLocaleString()}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() =>
                                            handleDelete(item.id)
                                        }
                                        disabled={deleting}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default FeedbackTab;