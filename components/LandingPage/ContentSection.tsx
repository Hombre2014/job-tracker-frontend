'use client';

import React from 'react';
import Image from 'next/image';

type SectionId = 'applications' | 'documents' | 'contacts';

interface ContentSectionProps {
  name: string;
  id?: SectionId;
  description: string;
}

const sectionColors: Record<SectionId, string> = {
  applications:
    'from-blue-100 via-blue-50 to-white dark:from-blue-900 dark:via-gray-900 dark:to-black',
  documents:
    'from-purple-100 via-pink-50 to-white dark:from-purple-900 dark:via-gray-900 dark:to-black',
  contacts:
    'from-green-100 via-green-50 to-white dark:from-green-900 dark:via-gray-900 dark:to-black',
};

const sectionImages: Record<SectionId, string> = {
  applications: '/images/Add_Job.png',
  documents: '/images/Documents.png',
  contacts: '/images/Contacts.png',
};

const sectionIcons: Record<SectionId, JSX.Element> = {
  applications: (
    <span className="inline-block bg-blue-500 text-white rounded-full p-4 shadow-lg mb-4">
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    </span>
  ),
  documents: (
    <span className="inline-block bg-purple-500 text-white rounded-full p-4 shadow-lg mb-4">
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M7 7v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" />
        <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      </svg>
    </span>
  ),
  contacts: (
    <span className="inline-block bg-green-500 text-white rounded-full p-4 shadow-lg mb-4">
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M17 20h5v-2a4 4 0 0 0-3-3.87" />
        <path d="M9 20H4v-2a4 4 0 0 1 3-3.87" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </span>
  ),
};

const sectionParagraphs: Record<SectionId, string> = {
  applications:
    'Bring all your job search details together—no more scattered spreadsheets or sticky notes. Track every opportunity, from company data and job descriptions to interview dates, contacts, and more. Your entire job search, organized and accessible in one place.',
  documents:
    'Easily upload and manage your resumes, cover letters, and supporting documents. Attach them to jobs, activities, or contacts, so you always have the right file at your fingertips when you need it most.',
  contacts:
    'Keep track of everyone you meet along your journey—recruiters, interviewers, and networking connections. Store contact info, add notes, and never lose touch with the people who can help you land your next role.',
};

const ContentSection = ({ name, description, id }: ContentSectionProps) => {
  const colorClass = id ? sectionColors[id] : 'from-gray-100 to-white';
  const icon = id ? sectionIcons[id] : null;
  const paragraph = id ? sectionParagraphs[id] : '';
  const imageSrc = id ? sectionImages[id] : '/images/Job_Search_Board.png';

  return (
    <section
      id={id}
      className={`w-full py-40 px-8 bg-gradient-to-br ${colorClass}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
        <div className="flex-1 flex flex-col items-start justify-center text-left">
          {icon}
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            {name}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-xl">
            {description}
          </p>
          {paragraph && (
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-4 max-w-xl">
              {paragraph}
            </p>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <div className="w-full aspect-[4/3] bg-gradient-to-tr from-white/80 via-gray-50/80 to-gray-100/80 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 rounded-2xl shadow-xl flex items-center justify-center">
            <Image
              width={1200}
              height={900}
              src={imageSrc}
              sizes="(min-width: 768px) 50vw, 90vw"
              alt={`Screenshot of ${name.toLowerCase()} feature`}
              className="w-full h-full object-contain rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
