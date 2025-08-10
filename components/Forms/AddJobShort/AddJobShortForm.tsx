'use client';

import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { AddJobSchemaShort } from '@/schemas';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import ComboBoardListBox from '@/components/Forms/AddJobShort/ComboBoardListBox';
import {
  createCompany,
  getCompanyThatStartsWith,
} from '@/redux/companies/companiesThunk';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const AddJobShortForm = ({
  columnOrder,
  onValidationChange,
}: {
  columnOrder: number;
  onValidationChange?: (isValid: boolean) => void;
}) => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const [showDropdown, setShowDropdown] = useState(false);
  const { boards } = useAppSelector((state) => state.boards);
  const initialBoard = boards.find((b) => b.id === board_id)!;
  const [selectedBoardId, setSelectedBoardId] = useState(initialBoard.id);
  const [selectedBoardName, setSelectedBoardName] = useState(initialBoard.name);
  const [boardColumns, setBoardColumns] = useState(initialBoard.columns);
  const [selectedColumnId, setSelectedColumnId] = useState(
    initialBoard.columns[columnOrder]?.id
  );
  const [selectedColumnName, setSelectedColumnName] = useState(
    initialBoard.columns[columnOrder]?.name
  );
  const [firstColumnOfTheBoard, setFirstColumnOfTheBoard] = useState(
    initialBoard.columns[0]?.name
  );
  const [matchingCompanies, setMatchingCompanies] = useState<string[]>([]);
  const initialColumnName = initialBoard.columns[columnOrder].name;
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

  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        if (term.length >= 2) {
          const values = {
            accessToken,
            companyName: term,
          };
          dispatch(getCompanyThatStartsWith(values))
            .unwrap()
            .then((result) => {
              const companyNames: string[] = result.map(
                (company: { name: string }) => company.name
              );
              setMatchingCompanies(companyNames);
              setShowDropdown(true);
            })
            .catch((error) => {
              console.error('Search error:', error);
              setMatchingCompanies([]);
              setShowDropdown(false);
            });
        } else {
          setMatchingCompanies([]);
          setShowDropdown(false);
        }
      }, 300),
    [dispatch, accessToken]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompany(value);
    form.setValue('company', value);
    debouncedSearch(value);
  };

  const handleCompanyBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      // Only proceed if no company was selected from dropdown
      if (localStorage.getItem('companySelected') === 'true') {
        localStorage.removeItem('companySelected');
        return;
      }

      if (matchingCompanies.includes(company)) {
        localStorage.setItem('company', company);
        // Get the existing company's ID
        const existingCompany = matchingCompanies.find(
          (comp) => comp === company
        );

        if (existingCompany) {
          const values = {
            accessToken,
            companyName: company,
          };

          dispatch(getCompanyThatStartsWith(values))
            .unwrap()
            .then((result) => {
              const companyData = result.find(
                (comp: any) => comp.name === company
              );
              if (companyData) {
                localStorage.setItem('companyId', companyData.id);
              }
            });
        }
      } else {
        localStorage.setItem('company', company);
        dispatch(createCompany({ accessToken, name: company }))
          .unwrap()
          .then((result) => {
            const newCompanyId = result.id;
            localStorage.setItem('companyId', newCompanyId);
          });
      }
    }, 200);
  };

  const handleCompanySelect = async (selectedCompany: string) => {
    const fullCompanyName = selectedCompany;
    setCompany(fullCompanyName);
    form.setValue('company', fullCompanyName);
    setShowDropdown(false);
    localStorage.setItem('company', fullCompanyName);
    localStorage.setItem('companySelected', 'true');

    const values = {
      accessToken,
      companyName: fullCompanyName,
    };

    const result = await dispatch(getCompanyThatStartsWith(values)).unwrap();
    const existingCompany = result.find(
      (comp: any) => comp.name === fullCompanyName
    );
    if (existingCompany) {
      localStorage.setItem('companyId', existingCompany.id);
    }
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
    localStorage.setItem('jobTitle', e.target.value);
    form.setValue('jobTitle', e.target.value);
  };

  const watchCompany = form.watch('company');
  const watchJobTitle = form.watch('jobTitle');

  useEffect(() => {
    const isValid = watchCompany.length > 0 && watchJobTitle.length > 0;
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [watchCompany, watchJobTitle, onValidationChange]);

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
              <Input
                required
                {...field}
                value={company}
                aria-required="true"
                placeholder="Company name"
                onBlur={handleCompanyBlur}
                onChange={handleCompanyChange}
              />
              {showDropdown && matchingCompanies.length > 0 && (
                <div className="absolute z-10 w-full bg-white dark:bg-slate-800 mt-1 border border-gray-200 dark:border-slate-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {matchingCompanies.map((matchingCompany, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer dark:text-white"
                      onClick={() => handleCompanySelect(matchingCompany)}
                    >
                      {matchingCompany}
                    </div>
                  ))}
                </div>
              )}

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
