import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { CompanyLogo } from '@/components/CompanyLogo';
import { useCompanyAutocomplete } from '@/hooks/useCompanyAutocomplete';
import { CompanySuggestion } from '@/services/companyAutocompleteService';
export interface CompanyAutocompleteProps {
  value: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onCompanySelect: (company: CompanySuggestion) => void;
  selectedCompany?: CompanySuggestion | null;
}

export const CompanyAutocomplete = (props: CompanyAutocompleteProps) => {
  const {
    value,
    onChange,
    className,
    onCompanySelect,
    disabled = false,
    placeholder = 'Search for a company...',
    selectedCompany = null,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [justSelected, setJustSelected] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false); // Track if user has typed

  const { suggestions, isLoading, error } = useCompanyAutocomplete(value);

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
    if (userInteracted && suggestions.length > 0 && !justSelected) {
      setIsOpen(true);
      setSelectedIndex(-1);
    }
    // Reset justSelected flag when user starts typing again (value changes)
  }, [suggestions, justSelected, userInteracted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setUserInteracted(true); // User has typed
    setIsOpen(true);
    setJustSelected(false); // User is typing again, reset selection flag
  };

  const handleSelectCompany = (company: CompanySuggestion) => {
    onChange(company.name);
    onCompanySelect(company);
    setIsOpen(false);
    setSelectedIndex(-1);
    setJustSelected(true); // Mark that selection just happened
    setUserInteracted(false); // Reset user interaction after selection
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
          onFocus={() => {
            // Only open dropdown if user has typed in this session
            if (userInteracted && suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={selectedCompany?.domain ? 'pr-10 w-full' : 'w-full'}
        />
        {selectedCompany?.domain && !isOpen && !isLoading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            <CompanyLogo
              domain={selectedCompany.domain}
              companyName={selectedCompany.name}
              size="sm"
            />
          </span>
        )}
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
              <li key={`${company.domain}-${index}`}>
                <button
                  type="button"
                  onClick={() => handleSelectCompany(company)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectCompany(company);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 w-full text-left cursor-pointer transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    selectedIndex === index &&
                      'bg-accent text-accent-foreground',
                  )}
                  tabIndex={0}
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
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen &&
        !isLoading &&
        value.length >= 2 &&
        suggestions.length === 0 &&
        !error && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No companies found
            </div>
          </div>
        )}

      {isOpen && error && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <div className="px-3 py-4 text-center text-sm text-destructive">
            Failed to load suggestions. Please try again.
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyAutocomplete;
