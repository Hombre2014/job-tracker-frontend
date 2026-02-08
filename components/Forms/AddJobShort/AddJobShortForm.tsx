'use client';

import { useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useCallback } from 'react';

import { AddJobSchemaShort } from '@/schemas';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createCompany } from '@/redux/companies/companiesThunk';
import { CompanyAutocomplete } from '@/components/CompanyAutocomplete';
import { CompanySuggestion } from '@/services/companyAutocompleteService';
import ComboBoardListBox from '@/components/Forms/AddJobShort/ComboBoardListBox';
import { initExtensionMessageListener } from '@/lib/extensionMessageListener';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface AddJobShortFormProps {
  columnOrder: number;
  onValidationChange?: (isValid: boolean) => void;
  // Incremental refactor: surface an in-memory draft so parents (modals) don't rely on localStorage.
  onDraftChange?: (draft: {
    company: string;
    jobTitle: string;
    companyId?: string;
    location?: string;
    description?: string;
    postUrl?: string;
    salary?: string;
    companyDomain?: string;
    companyLogo?: string | null;
  }) => void;
}

const AddJobShortForm = ({
  columnOrder,
  onValidationChange,
  onDraftChange,
}: AddJobShortFormProps) => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [company, setCompany] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [selectedCompany, setSelectedCompany] =
    useState<CompanySuggestion | null>(null);
  // Track companyLogo in state for reactivity
  const [companyLogo, setCompanyLogo] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('companyLogo') : null,
  );
  const searchParams = useSearchParams();
  const [jobTitle, setJobTitle] = useState('');
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const getAccessToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const { boards } = useAppSelector((state) => state.boards);
  const initialBoard = boards.find((b) => b.id === board_id);

  if (!initialBoard) {
    throw new Error(`Board with id ${board_id} not found`);
  }

  const [selectedBoardId, setSelectedBoardId] = useState(initialBoard.id);
  const [selectedBoardName, setSelectedBoardName] = useState(initialBoard.name);
  const [boardColumns, setBoardColumns] = useState(initialBoard.columns);
  const [selectedColumnId, setSelectedColumnId] = useState(
    initialBoard.columns[columnOrder]?.id,
  );
  const [selectedColumnName, setSelectedColumnName] = useState(
    initialBoard.columns[columnOrder]?.name,
  );
  const [firstColumnOfTheBoard, setFirstColumnOfTheBoard] = useState(
    initialBoard.columns[0]?.name,
  );
  const initialColumnName = initialBoard.columns[columnOrder]?.name;
  const initialBoardName = initialBoard.name;

  // Update columns and first column when selectedBoardId changes
  useEffect(() => {
    const newBoard = boards.find((b) => b.id === selectedBoardId);
    if (!newBoard) return;
    setSelectedBoardName(newBoard.name);
    setBoardColumns(newBoard.columns);
    const firstCol = newBoard.columns[0];
    setFirstColumnOfTheBoard(firstCol?.name);
    // If previously selected column doesn't belong to new board, reset
    if (!newBoard.columns.some((c) => c.id === selectedColumnId)) {
      setSelectedColumnId(firstCol?.id);
      setSelectedColumnName(firstCol?.name);
    }
  }, [selectedBoardId, boards, selectedColumnId]);

  // Centralize localStorage writes for board/column
  useEffect(() => {
    if (selectedBoardName)
      localStorage.setItem('chosenBoard', selectedBoardName);
    if (selectedBoardId) localStorage.setItem('chosenBoardId', selectedBoardId);
    if (firstColumnOfTheBoard)
      localStorage.setItem('firstColumnOfTheBoard', firstColumnOfTheBoard);
    if (selectedColumnName)
      localStorage.setItem('chosenColumn', selectedColumnName);
    if (selectedColumnId) localStorage.setItem('columnId', selectedColumnId);
  }, [
    selectedBoardId,
    selectedBoardName,
    firstColumnOfTheBoard,
    selectedColumnName,
    selectedColumnId,
  ]);

  const form = useForm({
    resolver: zodResolver(AddJobSchemaShort),
    defaultValues: {
      list: '',
      board: '',
      company: '',
      jobTitle: '',
    },
  });

  // Handle URL search parameters (for browser extension integration)
  useEffect(() => {
    const syncField = (key: string, value: string | null) => {
      if (value && value.trim()) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    };

    const urlCompany = searchParams.get('company');
    const urlJobTitle =
      searchParams.get('jobTitle') || searchParams.get('title');
    const urlLocation = searchParams.get('location');
    const urlDescription = searchParams.get('description');
    const urlPostUrl = searchParams.get('url');
    const urlSalary = searchParams.get('salary');

    if (urlCompany) {
      setCompany(urlCompany);
      form.setValue('company', urlCompany);
      localStorage.setItem('company', urlCompany);
    }
    if (urlJobTitle) {
      setJobTitle(urlJobTitle);
      form.setValue('jobTitle', urlJobTitle);
      localStorage.setItem('jobTitle', urlJobTitle);
    }

    syncField('jobLocation', urlLocation);
    syncField('jobDescription', urlDescription);
    syncField('jobPostUrl', urlPostUrl);
    syncField('jobSalary', urlSalary);
  }, [searchParams, form]);

  const emitDraft = useCallback(
    (
      next?: Partial<{
        company: string;
        jobTitle: string;
        companyId?: string;
        location?: string;
        description?: string;
        postUrl?: string;
        salary?: string;
        companyDomain?: string;
        companyLogo?: string | null;
      }>,
    ) => {
      if (onDraftChange) {
        onDraftChange({
          company,
          jobTitle,
          companyId,
          location:
            searchParams.get('location') ||
            localStorage.getItem('jobLocation') ||
            '',
          description:
            searchParams.get('description') ||
            localStorage.getItem('jobDescription') ||
            '',
          postUrl:
            searchParams.get('url') || localStorage.getItem('jobPostUrl') || '',
          salary:
            searchParams.get('salary') ||
            localStorage.getItem('jobSalary') ||
            '',
          companyDomain: companyUrl || '',
          companyLogo:
            typeof next?.companyLogo !== 'undefined'
              ? next.companyLogo
              : companyLogo,
          ...(next || {}),
        });
      }
    },
    [
      onDraftChange,
      company,
      jobTitle,
      companyId,
      searchParams,
      companyUrl,
      companyLogo,
    ],
  );

  // Listen for messages from browser extension (direct communication)
  useEffect(() => {
    const cleanup = initExtensionMessageListener((data) => {
      // Populate form with data from extension
      if (data.company) {
        setCompany(data.company);
        form.setValue('company', data.company);
        localStorage.setItem('company', data.company);
      }
      if (data.title) {
        setJobTitle(data.title);
        form.setValue('jobTitle', data.title);
        localStorage.setItem('jobTitle', data.title);
      }

      // Store company data for logo/domain
      if (data.companyDomain) {
        setCompanyUrl(data.companyDomain);
        localStorage.setItem('companyUrl', data.companyDomain);
      }
      if (data.companyLogo) {
        localStorage.setItem('companyLogo', data.companyLogo);
        setCompanyLogo(data.companyLogo);
      }

      // Store extra fields in localStorage
      if (data.location) localStorage.setItem('jobLocation', data.location);
      else localStorage.removeItem('jobLocation');
      if (data.salary) localStorage.setItem('jobSalary', data.salary);
      else localStorage.removeItem('jobSalary');
      if (data.url) localStorage.setItem('jobPostUrl', data.url);
      else localStorage.removeItem('jobPostUrl');
      if (data.description)
        localStorage.setItem('jobDescription', data.description);
      else localStorage.removeItem('jobDescription');

      // Trigger draft update, passing extension-sourced domain/logo directly
      emitDraft({
        company: data.company,
        jobTitle: data.title,
        location: data.location,
        salary: data.salary,
        postUrl: data.url,
        companyDomain: data.companyDomain,
        companyLogo: data.companyLogo,
      });
    });

    // Cleanup listener on unmount
    return cleanup;
  }, [form, emitDraft]);

  const handleCompanyChange = (value: string) => {
    setCompany(value);
    form.setValue('company', value);
    localStorage.setItem('company', value);

    // Clear domain/logo when user overrides the company text
    setCompanyUrl('');
    localStorage.removeItem('companyUrl');
    localStorage.removeItem('companyLogo');
    setCompanyLogo(null);

    emitDraft({
      company: value,
      companyDomain: '',
      companyLogo: null,
    });

    // If user edits the field, clear selected company and companyId
    setSelectedCompany(null);
    setCompanyId(undefined);
    localStorage.removeItem('companyId');
  };

  const handleCompanySelect = (companyObj: CompanySuggestion) => {
    const companyName = companyObj.name;
    const companyDomain = companyObj.domain;
    const companyLogo = companyObj.logo;

    setCompany(companyName);
    setCompanyUrl(companyDomain);
    setSelectedCompany(companyObj);
    form.setValue('company', companyName);
    localStorage.setItem('company', companyName);
    setCompanyLogo(companyLogo ?? null);

    // Defer company creation to the parent component (on Save)
    // Clear any existing companyId so the parent knows to create/find it
    setCompanyId(undefined);
    localStorage.removeItem('companyId');

    // Emit draft with company details for creation
    emitDraft({
      company: companyName,
      companyId: undefined,
      companyDomain,
      companyLogo,
    });
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
    localStorage.setItem('jobTitle', e.target.value); // legacy persistence
    form.setValue('jobTitle', e.target.value);
    emitDraft({ jobTitle: e.target.value });
  };

  const watchCompany = form.watch('company');
  const watchJobTitle = form.watch('jobTitle');

  useEffect(() => {
    const isValid = watchCompany.length > 0 && watchJobTitle.length > 0;
    if (onValidationChange) {
      onValidationChange(isValid);
    }
    emitDraft();
  }, [watchCompany, watchJobTitle, onValidationChange, emitDraft]);

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          name="company"
          control={form.control}
          render={({ field }) => (
            <FormItem className="!text-left relative">
              <span className="flex justify-between">
                <FormLabel className="text-gray-800 dark:text-white font-semibold">
                  Company
                </FormLabel>
                <FormLabel className="text-gray-400 dark:text-slate-400">
                  Required
                </FormLabel>
              </span>
              <CompanyAutocomplete
                value={company}
                onChange={handleCompanyChange}
                selectedCompany={selectedCompany}
                onCompanySelect={handleCompanySelect}
                placeholder="Search for a company..."
              />

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="jobTitle"
          control={form.control}
          render={({ field }) => (
            <FormItem className="!text-left">
              <span className="flex justify-between">
                <FormLabel className="text-gray-800 dark:text-white font-semibold">
                  Job Title
                </FormLabel>
                <FormLabel className="text-gray-400 dark:text-slate-400">
                  Required
                </FormLabel>
              </span>
              <Input
                required
                {...field}
                value={jobTitle}
                aria-required="true"
                placeholder="Job Title"
                onChange={(e) => handleJobTitleChange(e)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="flex justify-between gap-4 pb-4">
          <FormField
            name="board"
            control={form.control}
            render={({ field }) => (
              <FormItem className="!text-left w-1/2">
                <span className="flex justify-between">
                  <FormLabel className="text-gray-800 dark:text-white font-semibold">
                    Board
                  </FormLabel>
                  <FormLabel className="text-gray-400 dark:text-slate-400">
                    Required
                  </FormLabel>
                </span>
                <ComboBoardListBox
                  {...field}
                  itemsType="boards"
                  searchItem="Boards"
                  value={selectedBoardName}
                  initialBoardString={initialBoardName}
                  items={boards.map((b) => ({ id: b.id, name: b.name }))}
                  onSelectItem={(item) => {
                    setSelectedBoardId(item.id);
                    // Immediate persistence to ensure redirect uses updated board
                    localStorage.setItem('chosenBoardId', item.id);
                    localStorage.setItem('chosenBoard', item.name);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="list"
            control={form.control}
            render={({ field }) => (
              <FormItem className="!text-left w-1/2">
                <span className="flex justify-between">
                  <FormLabel className="text-gray-800 dark:text-white font-semibold">
                    List
                  </FormLabel>
                  <FormLabel className="text-gray-400 dark:text-slate-400">
                    Required
                  </FormLabel>
                </span>
                <ComboBoardListBox
                  {...field}
                  searchItem="Lists"
                  itemsType="columns"
                  value={selectedColumnName}
                  initialColumnString={initialColumnName}
                  items={boardColumns.map((c) => ({ id: c.id, name: c.name }))}
                  onSelectItem={(item) => {
                    setSelectedColumnId(item.id);
                    setSelectedColumnName(item.name);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </span>
      </form>
    </Form>
  );
};

export default AddJobShortForm;
