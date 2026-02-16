'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect } from 'react';

import { useAppSelector } from '@/redux/hooks';

const HowTo = () => {
  // Check authentication state for adaptive styling
  const { accessToken: reduxAccessToken } = useAppSelector(
    (state) => state.user,
  );
  const [isAuthenticated, setIsAuthenticated] =
    React.useState(!!reduxAccessToken);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check localStorage after hydration to avoid mismatch
  useEffect(() => {
    const token = reduxAccessToken || localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, [reduxAccessToken]);

  // Logged-in users: padding for sidebar layout, not logged-in: mt-36 for navbar
  const topSpacing = isAuthenticated ? 'pt-20' : 'mt-36';

  return (
    <div
      className={`mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 ${topSpacing} pb-36`}
    >
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
                  Sign up with your email address and create a secure password.
                  Verify your email to activate your account.
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
                  Begin tracking your job applications by adding company names,
                  positions, and application dates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* New Section: Adding a Job with Company Autocomplete */}
        <section className="bg-blue-100 dark:bg-slate-700 rounded-xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
            Adding a New Job Application with Company Autocomplete
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-200 mb-6 text-center">
            JobTracker makes it easy to add new job applications by helping you
            quickly find and select the correct company name using our smart
            autocomplete feature.
          </p>
          <ol className="list-decimal list-inside space-y-4 text-slate-700 dark:text-slate-200 max-w-2xl mx-auto">
            <li>
              <strong>Start typing the company name:</strong> In the{' '}
              <span className="font-semibold">Company</span> field, enter the
              first 2–3 letters of the company you want to add. For example,
              type{' '}
              <span className="bg-slate-200 dark:bg-slate-600 px-1 rounded">
                Mic
              </span>{' '}
              for Microsoft.
            </li>
            <li>
              <strong>View suggestions:</strong> As you type, a dropdown will
              appear with a list of matching company names and their logos. This
              helps you quickly find the correct company and avoid typos.
            </li>
            <li>
              <strong>Select the correct company:</strong> Click on the company
              name from the suggestions list. The company name and logo will
              automatically fill the field.
            </li>
            <li>
              <strong>Continue filling out the form:</strong> Complete the rest
              of the job application details as usual.
            </li>
          </ol>
          <div className="flex justify-center mt-8">
            <Image
              priority
              unoptimized
              width={1200}
              height={800}
              src="/gifs/Add_a_job.gif"
              alt="Demo: Adding a job with company autocomplete"
              className="rounded-lg border border-blue-400 shadow-md max-w-full h-auto"
              style={{
                zIndex: 2,
                position: 'relative',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
            />
          </div>
        </section>

        {/* Browser Extension Section */}
        <section className="bg-purple-100 dark:bg-slate-700 rounded-xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
            Using the JobTracker Browser Extension
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-200 mb-6 text-center">
            Save time by automatically capturing job details directly from
            LinkedIn, Indeed, and other job boards with just a couple of clicks!
          </p>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-4 text-slate-700 dark:text-slate-200 max-w-2xl mx-auto">
              <li>
                <strong>Install the Extension:</strong> Add the JobTracker
                browser extension from the Chrome Web Store (link available from
                your dashboard).
              </li>
              <li>
                <strong>Browse Job Listings:</strong> Navigate to any job
                posting on LinkedIn, Indeed, or other supported job boards.
              </li>
              <li>
                <strong>Click the Extension Icon:</strong> When you&apos;re
                viewing a job you want to save, click the JobTracker extension
                icon in your browser toolbar. The extension will automatically
                scrape the job details including:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Job Title</li>
                  <li>Company Name and Logo</li>
                  <li>Location</li>
                  <li>Job Description</li>
                  <li>Salary Information (when available)</li>
                  <li>Direct Link to the Job Posting</li>
                </ul>
              </li>
              <li>
                <strong>Review and Select Board:</strong> The extension popup
                will display the captured information. Choose which board you
                want to save the job to (e.g., &quot;Wishlist&quot;,
                &quot;Applied&quot;, etc.).
              </li>
              <li>
                <strong>Save to JobTracker:</strong> Click the &quot;Save
                Job&quot; button. The job will be instantly added to your
                selected board. If you have JobTracker open in another tab, it
                will automatically update without needing to refresh!
              </li>
            </ol>
          </div>

          {/* LinkedIn Example */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 text-center">
              Example: Saving a Job from LinkedIn
            </h3>
            <div className="flex justify-center">
              <Image
                priority
                unoptimized
                width={1200}
                height={800}
                src="/gifs/linkedin-demo.gif"
                alt="Demo: Using browser extension to save a job from LinkedIn"
                className="rounded-lg border border-purple-400 shadow-md max-w-full h-auto"
                style={{
                  zIndex: 2,
                  position: 'relative',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                }}
              />
            </div>
          </div>

          {/* Indeed Example */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 text-center">
              Example: Saving a Job from Indeed
            </h3>
            <div className="flex justify-center">
              <Image
                priority
                unoptimized
                width={1200}
                height={800}
                src="/gifs/indeed-demo.gif"
                alt="Demo: Using browser extension to save a job from Indeed"
                className="rounded-lg border border-purple-400 shadow-md max-w-full h-auto"
                style={{
                  zIndex: 2,
                  position: 'relative',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                }}
              />
            </div>
          </div>

          <div className="bg-purple-200 dark:bg-slate-600 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Benefits of Using the Extension</span>
            </h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-300 font-bold mt-1">
                  ✓
                </span>
                <span>
                  <strong>Save Time:</strong> No need to manually copy and paste
                  job details
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-300 font-bold mt-1">
                  ✓
                </span>
                <span>
                  <strong>Avoid Errors:</strong> Automatically captures accurate
                  information
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-300 font-bold mt-1">
                  ✓
                </span>
                <span>
                  <strong>Stay Organized:</strong> Jobs are instantly saved to
                  your chosen board
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-300 font-bold mt-1">
                  ✓
                </span>
                <span>
                  <strong>Tab Reuse:</strong> If JobTracker is already open, it
                  reuses that tab automatically
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-300 font-bold mt-1">
                  ✓
                </span>
                <span>
                  <strong>Company Logos:</strong> Automatically fetches and
                  displays company logos
                </span>
              </li>
            </ul>
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
                Click the &quot;Add Job&quot; button to create a new application
                entry. Fill in the company name, position, job description, and
                any relevant links.
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
                Our Kanban board visualizes your application pipeline. Drag and
                drop applications between columns as they progress:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 ml-4">
                <li>
                  <strong>Wishlist:</strong> Companies you&apos;re interested in
                </li>
                <li>
                  <strong>Applied:</strong> Applications you&apos;ve submitted
                </li>
                <li>
                  <strong>Interview:</strong> Scheduled or completed interviews
                </li>
                <li>
                  <strong>Offer:</strong> Job offers received
                </li>
                <li>
                  <strong>Rejected:</strong> Applications that didn&apos;t move
                  forward
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
                <strong>Link to Applications:</strong> Attach relevant documents
                to specific job applications.
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
                Use the notes field to record interview questions, feedback, or
                important details
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
                Regularly review your wishlist and convert prospects into active
                applications
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                🔌
              </span>
              <span>
                <strong>Browser Extension - Sync Issue:</strong> If the
                extension shows &quot;Sync required&quot; message, click the
                &quot;Rescan & Sync&quot; button at the top right of the
                extension popup to refresh the job data
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                🔌
              </span>
              <span>
                <strong>Browser Extension - No Data Fetched:</strong> If
                clicking the extension icon doesn&apos;t load any job details,
                try refreshing the job posting page and then click the extension
                icon again. This is especially helpful on LinkedIn where pages
                load dynamically
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
  );
};

export default HowTo;
