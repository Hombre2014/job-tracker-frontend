import { RiCloseLine } from 'react-icons/ri';

import { Input } from '@/components/ui/input';

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
  const handleRemoveCompany = (index: number) => {
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
        className="outline-none bg-transparent border border-gray-300 dark:border-slate-600 rounded-md px-2 py-1 w-full focus:border-blue-500 focus:ring-blue-500 dark:text-white"
      />
      {showDropdown && matchingCompanies.length > 0 && (
        <div 
          role="listbox"
          className="absolute z-10 w-full bg-white dark:bg-slate-800 mt-1 border border-gray-200 dark:border-slate-600 rounded-md shadow-lg max-h-60 overflow-auto top-[40px]"
        >
          {matchingCompanies.map((company, index) => (
            <div
              key={index}
              role="option"
              tabIndex={0}
              onClick={() => onCompanySelect(company)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onCompanySelect(company);
                }
              }}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none"
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
            className="flex items-center bg-gray-200 dark:bg-slate-600 rounded-full px-2 py-[2px]"
          >
            <span className="mr-2 dark:text-white">{company}</span>
            <RiCloseLine
              className="cursor-pointer dark:text-white"
              onClick={() => handleRemoveCompany(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesInput;
