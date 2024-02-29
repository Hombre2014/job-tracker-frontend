'use client';

interface ContentSectionProps {
  id?: string;
  name: string;
  description: string;
}

const ContentSection = ({ name, description, id }: ContentSectionProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full" id={id}>
      <h2 className="text-2xl font-bold">Content Section</h2>
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-lg">{description}</p>
    </div>
  );
};

export default ContentSection;
