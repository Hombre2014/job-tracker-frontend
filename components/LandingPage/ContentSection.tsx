'use client';

type SectionId = 'applications' | 'documents' | 'contacts';

interface ContentSectionProps {
  id?: SectionId;
  name: string;
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
  return (
    <section
      id={id}
      className={`w-full py-16 px-4 bg-gradient-to-br ${colorClass}`}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {icon}
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          {name}
        </h2>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-2 max-w-2xl">
          {description}
        </p>
        {paragraph && (
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
            {paragraph}
          </p>
        )}
        <div className="w-full max-w-md h-40 bg-white/60 dark:bg-gray-800/60 rounded-xl flex items-center justify-center shadow-inner border border-dashed border-gray-300 dark:border-gray-700">
          <span className="text-gray-400 text-sm">
            [Placeholder for {name.toLowerCase()} screenshot or illustration]
          </span>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
