import { useState, useRef, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { CompanyLogo } from '@/components/CompanyLogo';
import { useCompanyAutocomplete } from '@/hooks/useCompanyAutocomplete';
import { CompanySuggestion } from '@/services/companyAutocompleteService';
import { cn } from '@/lib/utils';

interface CompanyAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCompanySelect: (company: CompanySuggestion) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const CompanyAutocomplete = ({
  value,
  onChange,
  onCompanySelect,
  placeholder = 'Search for a company...',
  disabled = false,
  className,
}: CompanyAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [justSelected, setJustSelected] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { suggestions, isLoading } = useCompanyAutocomplete(value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open dropdown when suggestions are available (but not after selection)
  useEffect(() => {
    if (suggestions.length > 0 && !justSelected) {
      setIsOpen(true);
      setSelectedIndex(-1);
    }
    // Reset justSelected flag when user starts typing again (value changes)
  }, [suggestions, justSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
    setJustSelected(false); // User is typing again, reset selection flag
  };

  const handleSelectCompany = (company: CompanySuggestion) => {
    onChange(company.name);
    onCompanySelect(company);
    setIsOpen(false);
    setSelectedIndex(-1);
    setJustSelected(true); // Mark that selection just happened
    // Blur the input to prevent dropdown from reopening
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectCompany(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <ul className="max-h-[300px] overflow-y-auto py-1">
            {suggestions.map((company, index) => (
              <li
                key={`${company.domain}-${index}`}
                onClick={() => handleSelectCompany(company)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  selectedIndex === index && 'bg-accent text-accent-foreground',
                )}
              >
                <CompanyLogo
                  domain={company.domain}
                  companyName={company.name}
                  size="sm"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium truncate">{company.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {company.domain}
                  </div>
                </div>
                {selectedIndex === index && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen &&
        !isLoading &&
        value.length >= 2 &&
        suggestions.length === 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No companies found
            </div>
          </div>
        )}
    </div>
  );
};

export default CompanyAutocomplete;
