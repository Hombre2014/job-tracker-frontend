'use client';

import React from 'react';
import Link from 'next/link';

const HowTo = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="fixed inset-0 bg-white dark:bg-slate-900 -z-10" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-36 pb-36">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            How to Use JobTracker
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            A comprehensive guide to help you make the most of JobTracker&apos;s
            features and streamline your job search.
          </p>
        </div>

        <div className="space-y-12">
          {/* Getting Started */}
          <section className="bg-amber-50 dark:bg-slate-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Getting Started
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Create Your Account
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Sign up with your email address and create a secure
                    password. Verify your email to activate your account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Set Up Your Profile
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Add your personal information and preferences to customize
                    your JobTracker experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Start Adding Applications
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Begin tracking your job applications by adding company
                    names, positions, and application dates.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Managing Applications */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Managing Your Job Applications
            </h2>
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  📋 Adding a New Application
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-3">
                  Click the &quot;Add Job&quot; button to create a new
                  application entry. Fill in the company name, position, job
                  description, and any relevant links.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 ml-4">
                  <li>Company name is required</li>
                  <li>Add the job posting URL for easy reference</li>
                  <li>Set the application date to track your timeline</li>
                  <li>Add notes about the position or company</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  🔄 Using the Kanban Board
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-3">
                  Our Kanban board visualizes your application pipeline. Drag
                  and drop applications between columns as they progress:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 ml-4">
                  <li>
                    <strong>Wishlist:</strong> Companies you&apos;re interested
                    in
                  </li>
                  <li>
                    <strong>Applied:</strong> Applications you&apos;ve submitted
                  </li>
                  <li>
                    <strong>Interview:</strong> Scheduled or completed
                    interviews
                  </li>
                  <li>
                    <strong>Offer:</strong> Job offers received
                  </li>
                  <li>
                    <strong>Rejected:</strong> Applications that didn&apos;t
                    move forward
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  ✏️ Editing Applications
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Click on any application card to view details. Use the edit
                  button to update information, add interview dates, or include
                  follow-up notes.
                </p>
              </div>
            </div>
          </section>

          {/* Document Management */}
          <section className="bg-blue-50 dark:bg-slate-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Document Management
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
              Keep all your job search documents organized in one place:
            </p>
            <div className="space-y-3 text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <strong>Upload Documents:</strong> Store multiple versions of
                  your resume, cover letters, portfolios, and certificates.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏷️</span>
                <div>
                  <strong>Categorize Files:</strong> Tag documents by type
                  (Resume, Cover Letter, Portfolio, etc.) for easy filtering.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔗</span>
                <div>
                  <strong>Link to Applications:</strong> Attach relevant
                  documents to specific job applications.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⬇️</span>
                <div>
                  <strong>Download Anytime:</strong> Access your documents
                  whenever you need them, from any device.
                </div>
              </div>
            </div>
          </section>

          {/* Contact Management */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Managing Contacts
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Build and maintain your professional network within JobTracker:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ml-4">
                <li>
                  Add recruiters, hiring managers, and professional contacts
                </li>
                <li>Store contact information, company, and role</li>
                <li>Link contacts to relevant job applications</li>
                <li>Add notes about your interactions and conversations</li>
                <li>Set reminders for follow-ups</li>
              </ul>
            </div>
          </section>

          {/* Tips and Best Practices */}
          <section className="bg-green-50 dark:bg-slate-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              💡 Tips & Best Practices
            </h2>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ✓
                </span>
                <span>
                  Update your applications regularly to keep track of their
                  current status
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ✓
                </span>
                <span>
                  Use the notes field to record interview questions, feedback,
                  or important details
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ✓
                </span>
                <span>
                  Set reminders for follow-up emails or upcoming interviews
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ✓
                </span>
                <span>
                  Keep your documents up-to-date and tailored to different types
                  of positions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ✓
                </span>
                <span>
                  Regularly review your wishlist and convert prospects into
                  active applications
                </span>
              </li>
            </ul>
          </section>

          {/* Help Section */}
          <section className="text-center py-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Need More Help?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              If you have questions or need assistance, we&apos;re here to help!
            </p>
            <Link
              href="/contact-us"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] inline-block"
            >
              Contact Support
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HowTo;
