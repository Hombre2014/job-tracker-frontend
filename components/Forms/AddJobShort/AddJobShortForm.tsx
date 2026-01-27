'use client';

import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useCallback } from 'react';

import { AddJobSchemaShort } from '@/schemas';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createCompany } from '@/redux/companies/companiesThunk';
import { CompanyAutocomplete } from '@/components/CompanyAutocomplete';
import { CompanySuggestion } from '@/services/companyAutocompleteService';
import ComboBoardListBox from '@/components/Forms/AddJobShort/ComboBoardListBox';
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
  const [jobTitle, setJobTitle] = useState('');
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const getAccessToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const { boards } = useAppSelector((state) => state.boards);
  const initialBoard = boards.find((b) => b.id === board_id);
  const boardNotFound = !initialBoard;
  // Always call hooks with safe defaults
  const [selectedBoardId, setSelectedBoardId] = useState(
    initialBoard?.id || '',
  );
  const [selectedBoardName, setSelectedBoardName] = useState(
    initialBoard?.name || '',
  );
  const [boardColumns, setBoardColumns] = useState(initialBoard?.columns || []);
  const [selectedColumnId, setSelectedColumnId] = useState(
    initialBoard?.columns?.[columnOrder]?.id || '',
  );
  const [selectedColumnName, setSelectedColumnName] = useState(
    initialBoard?.columns?.[columnOrder]?.name || '',
  );
  const [firstColumnOfTheBoard, setFirstColumnOfTheBoard] = useState(
    initialBoard?.columns?.[0]?.name || '',
  );
  const initialColumnName = initialBoard?.columns?.[columnOrder]?.name || '';
  const initialBoardName = initialBoard?.name || '';

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
    selectedBoardName,
    selectedBoardId,
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

  const emitDraft = useCallback(
    (
      next?: Partial<{ company: string; jobTitle: string; companyId?: string }>,
    ) => {
      if (onDraftChange) {
        onDraftChange({
          company,
          jobTitle,
          companyId,
          ...(next || {}),
        });
      }
    },
    [onDraftChange, company, jobTitle, companyId],
  );

  const handleCompanyChange = (value: string) => {
    setCompany(value);
    form.setValue('company', value);
    emitDraft({ company: value });
    // If user edits the field, clear selected company
    setSelectedCompany(null);
  };

  const handleCompanySelect = async (companyObj: CompanySuggestion) => {
    const companyName = companyObj.name;
    const companyDomain = companyObj.domain;

    setCompany(companyName);
    setCompanyUrl(companyDomain);
    setSelectedCompany(companyObj);
    form.setValue('company', companyName);
    localStorage.setItem('company', companyName);

    // Create company in backend with name and url
    try {
      const result = await dispatch(
        createCompany({
          accessToken: getAccessToken(),
          name: companyName,
          url: companyDomain,
        }),
      ).unwrap();

      const newCompanyId = result.id;
      setCompanyId(newCompanyId);
      localStorage.setItem('companyId', newCompanyId);
      emitDraft({ company: companyName, companyId: newCompanyId });
    } catch (error) {
      console.error('Error creating company:', error);
    }
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

  if (boardNotFound) {
    return <div>Board not found</div>;
  }

  return (
    <Form {...form}>
      <form className="space-y-8">{/* ...existing code... */}</form>
    </Form>
  );
};

export default AddJobShortForm;
