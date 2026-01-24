'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { useAppSelector } from '@/redux/hooks';

const ContactUs = () => {
  const [state, handleSubmit] = useForm('mjgywqon');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check authentication state for adaptive styling
  const { accessToken: reduxAccessToken } = useAppSelector(
    (state) => state.user,
  );
  const accessToken =
    reduxAccessToken ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null);
  const isAuthenticated = !!accessToken;

  // Logged-in users: padding for sidebar layout, not logged-in: mt-36 for navbar
  const topSpacing = isAuthenticated ? 'pt-20' : 'mt-36';

  return (
    <div
      className={`mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 ${topSpacing} pb-36`}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Have questions or feedback? We&apos;d love to hear from you.
        </p>
      </div>

      {state.succeeded ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-16 h-16 text-green-500 mx-auto mb-4"
          >
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-2">
            Thank you for contacting us!
          </h2>
          <p className="text-green-700 dark:text-green-400 mb-6">
            We&apos;ve received your message and will get back to you soon.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02]"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <>
          {state.errors &&
            Object.keys(state.errors).length > 0 &&
            !state.submitting && (
              <div
                role="alert"
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-center"
              >
                <p className="text-red-700 dark:text-red-400">
                  Something went wrong. Please try again later.
                </p>
              </div>
            )}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-slate-700"
          >
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                id="name"
                type="text"
                name="name"
                placeholder="Your name"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
              <ValidationError
                field="name"
                prefix="Name"
                errors={state.errors}
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                required
                id="email"
                type="email"
                name="email"
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
              <ValidationError
                field="email"
                prefix="Email"
                errors={state.errors}
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                required
                id="message"
                name="message"
                placeholder="Tell us how we can help you..."
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
              ></textarea>
              <ValidationError
                field="message"
                prefix="Message"
                errors={state.errors}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={state.submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:transform-none"
            >
              {state.submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ContactUs;
