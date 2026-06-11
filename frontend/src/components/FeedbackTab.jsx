import { useEffect, useState } from 'react';
import { Trash2, Mail, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import {
    useGetFeedback,
    useDeleteFeedback,
    useMarkFeedbackAsRead
} from '../hooks/feedbackHooks';

function FeedbackTab({ onRefresh }) { 
    const {
        feedback,
        fetchFeedback,
        isLoading
    } = useGetFeedback();

    const {
        deleteFeedback,
        isLoading: deleting
    } = useDeleteFeedback();

    const { markAsRead } = useMarkFeedbackAsRead();

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
            if (onRefresh) onRefresh();
        }
        else {
            alert(result.error || 'Failed to delete feedback');
        }
    };

    const handleMarkAsRead = async (id, isRead) => {
        if (isRead) return;

        const result = await markAsRead(id);
        if (result.success) {
            fetchFeedback();
            if (onRefresh) onRefresh();
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
                                // Clicking the row marks it as read (if not already)
                                onClick={() => handleMarkAsRead(item.id, item.is_read)}
                                className={`border-t border-gray-100 transition-colors cursor-pointer ${item.is_read
                                    ? 'bg-gray-50/50 hover:bg-gray-100/50' // Muted background for read
                                    : 'bg-white hover:bg-green-50/30'      // Clean white for unread
                                    }`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* The Glowing Dot */}
                                        {!item.is_read && (
                                            <div className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                            </div>
                                        )}
                                        <span className={`font-medium ${item.is_read ? 'text-gray-500' : 'text-gray-900'}`}>
                                            {item.email}
                                        </span>
                                    </div>
                                </td>

                                <td className={`px-6 py-4 ${item.is_read ? 'opacity-60' : 'opacity-100'}`}>
                                    <ExpandableMessage message={item.message} />
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(item.createdAt).toLocaleString()}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {/* Optional Status Icon */}
                                        {item.is_read ? (
                                            <span className="text-gray-400 flex items-center gap-1 text-xs font-bold uppercase tracking-tighter">
                                                <CheckCircle2 className="w-4 h-4" /> Read
                                            </span>
                                        ) : (
                                            <span className="text-green-600 flex items-center gap-1 text-xs font-bold uppercase tracking-tighter">
                                                New
                                            </span>
                                        )}

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents marking as read when deleting
                                                handleDelete(item.id);
                                            }}
                                            disabled={deleting}
                                            className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
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