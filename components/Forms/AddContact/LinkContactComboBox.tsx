'use client';

import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LinkContactComboBoxProps {
  availableContacts: Contact[];
  onLinkContact: (contact: Contact) => void;
}

const LinkContactComboBox: React.FC<LinkContactComboBoxProps> = ({
  onLinkContact,
  availableContacts,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Filter contacts based on search term
  const filteredContacts = availableContacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      contact.jobTitle.toLowerCase().includes(searchLower) ||
      (contact.companies.length > 0 &&
        contact.companies.some(
          (company: any) =>
            company.name && company.name.toLowerCase().includes(searchLower)
        ))
    );
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleSelectContact = (contact: Contact) => {
    onLinkContact(contact);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getContactName = (contact: Contact) => {
    return `${contact.firstName} ${contact.lastName}`.trim();
  };

  const getContactCompany = (contact: Contact) => {
    return contact.companies.length > 0 ? contact.companies[0].name : null;
  };
  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {' '}
      <Button
        type="button"
        variant="outline"
        onClick={handleToggleDropdown}
        className="flex items-center gap-2 px-3 py-2 text-sm border-dashed border-2 hover:bg-gray-50"
      >
        <span className="text-lg">+</span>
        Link Contact
      </Button>
      {isOpen && (
        <Card className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-hidden z-50 shadow-lg">
          <div className="p-3 border-b">
            <Input
              type="text"
              value={searchTerm}
              className="w-full"
              onChange={handleSearchChange}
              placeholder="Search contacts..."
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm
                  ? 'No contacts found matching your search.'
                  : 'No contacts available to link.'}
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSelectContact(contact)}
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    {contact.photoUrl ? (
                      <Image
                        width={40}
                        height={40}
                        src={contact.photoUrl}
                        alt={getContactName(contact)}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {contact.firstName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {getContactName(contact)}
                    </div>
                    {getContactCompany(contact) && (
                      <div className="text-sm text-gray-500 truncate">
                        {getContactCompany(contact)}
                      </div>
                    )}
                    {contact.jobTitle && (
                      <div className="text-xs text-gray-400 truncate">
                        {contact.jobTitle}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LinkContactComboBox;
