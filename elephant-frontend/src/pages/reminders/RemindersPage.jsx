import React from 'react';
import { Bell, GitPullRequest } from 'lucide-react';

export const RemindersPage = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto text-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Bell className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Smart Reminder & Notification Management
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-lg mx-auto">
          Sprint 2–3 User Stories: PBI-09, PBI-10, PBI-11, PBI-12 (Custom Reminders, Email Notifications, In-App Alerts, Recurring Cron Scheduler).
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm font-medium">
          <GitPullRequest className="w-4 h-4" />
          <span>Assigned to: <strong>Abilash M (IT25102234)</strong> — Branch: <code>feature/it25102234-reminders</code></span>
        </div>
      </div>
    </div>
  );
};

export const ReminderFormPage = RemindersPage;
