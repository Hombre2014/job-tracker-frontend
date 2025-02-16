import { RiCloseLine } from 'react-icons/ri';
import { Input } from '@/components/ui/input';

interface CompaniesInputProps {
  companies: string[];
  companyIds: string[];
  currentInput: string;
  showDropdown: boolean;
  matchingCompanies: string[];
  setCompanyIds: (ids: string[]) => void;
  setCurrentInput: (input: string) => void;
  onCompanySelect: (company: string) => void;
  setCompanies: (companies: string[]) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompaniesInput = ({
  companies,
  onKeyDown,
  companyIds,
  setCompanies,
  currentInput,
  showDropdown,
  onInputChange,
  setCompanyIds,
  onCompanySelect,
  matchingCompanies,
}: CompaniesInputProps) => {
  const handleRemoveCompany = (company: string, index: number) => {
    const newCompanies = companies.filter((_, i) => i !== index);
    const newCompanyIds = companyIds.filter((_, i) => i !== index);
    setCompanies(newCompanies);
    setCompanyIds(newCompanyIds);
    localStorage.setItem('companies', JSON.stringify(newCompanies));
    localStorage.setItem('companyIds', JSON.stringify(newCompanyIds));
  };

  return (
    <div className="w-full flex flex-col gap-2 relative">
      <Input
        type="text"
        value={currentInput}
        onKeyDown={onKeyDown}
        onChange={onInputChange}
        placeholder='i.e: "Google"'
        className="outline-none bg-transparent border border-gray-300 rounded-md px-2 py-1 w-full focus:border-blue-500 focus:ring-blue-500"
      />
      {showDropdown && matchingCompanies.length > 0 && (
        <div className="absolute z-10 w-full bg-white mt-1 border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto top-[40px]">
          {matchingCompanies.map((company, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onCompanySelect(company)}
            >
              {company}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {companies.map((company, index) => (
          <div
            key={company}
            className="flex items-center bg-gray-200 rounded-full px-2 py-[2px]"
          >
            <span className="mr-2">{company}</span>
            <RiCloseLine
              className="cursor-pointer"
              onClick={() => handleRemoveCompany(company, index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesInput;
