import React from 'react';
import { BarChart3, GitPullRequest } from 'lucide-react';

export const ReportsDashboardPage = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto text-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Report & Insights Management
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-lg mx-auto">
          Sprint 3 User Stories: PBI-13, PBI-14 (Financial Reports, Category Breakdown, Date Range Search & Filters).
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm font-medium">
          <GitPullRequest className="w-4 h-4" />
          <span>Assigned to: <strong>Sathsaranie R.M.N.K (IT25102625)</strong> — Branch: <code>feature/it25102625-reports</code></span>
        </div>
      </div>
    </div>
  );
};

export const ReportsPage = ReportsDashboardPage;
