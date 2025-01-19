import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';

import { Input } from '@/components/ui/input';

interface CompaniesInputProps {
  companies: string[];
  setCompanies: (companies: string[]) => void;
}

const CompaniesInput = ({ companies, setCompanies }: CompaniesInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setCompanies([...companies, inputValue.trim()]);
      localStorage.setItem(
        'companies',
        JSON.stringify([...companies, inputValue.trim()])
      );
      setInputValue('');
    }
  };

  const handleRemoveCompany = (company: string) => {
    setCompanies(companies.filter((c) => c !== company));
    localStorage.setItem(
      'companies',
      JSON.stringify(companies.filter((c) => c !== company))
    );
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <Input
        type="text"
        value={inputValue}
        onKeyDown={handleKeyDown}
        placeholder='i.e: "Google"'
        onChange={handleInputChange}
        className="outline-none bg-transparent border border-gray-300 rounded-md px-2 py-1 w-full focus:border-blue-500 focus:ring-blue-500"
      />
      <div className="flex flex-wrap gap-2">
        {companies.map((company) => (
          <div
            key={company}
            className="flex items-center bg-gray-200 rounded-full px-2 py-[2px]"
          >
            <span className="mr-2">{company}</span>
            <RiCloseLine
              className="cursor-pointer"
              onClick={() => handleRemoveCompany(company)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesInput;
