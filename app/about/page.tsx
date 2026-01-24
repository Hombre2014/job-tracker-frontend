'use client';

import React from 'react';
import Link from 'next/link';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="fixed inset-0 bg-white dark:bg-slate-900 -z-10" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-36 pb-36">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            About JobTracker
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Your comprehensive solution for managing job applications,
            documents, and professional contacts all in one place.
          </p>
        </div>

        <div className="space-y-12">
          {/* Mission Section */}
          <section className="bg-amber-50 dark:bg-slate-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              JobTracker was created to simplify the job search process. We
              understand that managing multiple job applications, keeping track
              of interviews, organizing documents, and maintaining professional
              contacts can be overwhelming. Our mission is to provide a
              streamlined platform that brings all these essential tools
              together.
            </p>
          </section>

          {/* Features Section */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  📋 Application Tracking
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Keep track of all your job applications with our intuitive
                  Kanban board. Move applications through different stages from
                  Applied to Offer.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  📄 Document Management
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Upload and organize your resumes, cover letters, and other
                  important documents. Access them whenever you need them.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  👥 Contact Management
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Maintain a database of recruiters, hiring managers, and
                  professional contacts. Never lose track of important
                  connections.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  🔍 Smart Organization
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Filter, search, and organize your applications by company,
                  status, date, and more. Find what you need instantly.
                </p>
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section className="bg-blue-50 dark:bg-slate-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              JobTracker is built using cutting-edge web technologies to ensure
              a fast, secure, and reliable experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
              <li>Next.js 14 for optimal performance and SEO</li>
              <li>TypeScript for type-safe, maintainable code</li>
              <li>Redux Toolkit for efficient state management</li>
              <li>Tailwind CSS for beautiful, responsive design</li>
              <li>Secure authentication and data encryption</li>
            </ul>
          </section>

          {/* CTA Section */}
          <section className="text-center py-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Join thousands of job seekers who are already using JobTracker to
              organize their job search.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02]"
              >
                Sign Up Free
              </Link>
              <Link
                href="/contact-us"
                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-semibold py-3 px-8 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02]"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
