import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';

export const FeedbackPage = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto text-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Event Feedback & Ratings
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-lg mx-auto">
          Sprint 4 User Story: PBI-15 (Event Feedback, Ratings & Reviews). Scheduled for final sprint (Weeks 11–14).
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          <span>Status: Backlog / Sprint 4 Planned</span>
        </div>
      </div>
    </div>
  );
};
