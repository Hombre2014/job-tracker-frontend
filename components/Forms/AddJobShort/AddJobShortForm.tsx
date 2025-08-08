'use client';

import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useCallback } from 'react';

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
  console.log('🔄 AddJobShortForm render - columnOrder:', columnOrder);
  
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const [showDropdown, setShowDropdown] = useState(false);
  const { boards } = useAppSelector((state) => state.boards);
  const [boardColumns, setBoardColumns] = useState(
    boards.find((board) => board.id === board_id)!.columns
  );
  const initialColumnName = boardColumns![columnOrder].name;
  const [matchingCompanies, setMatchingCompanies] = useState<string[]>([]);
  const initialBoardName = boards.find((board) => board.id === board_id)!.name;
  const chosenBoard = localStorage.getItem('chosenBoard') || initialBoardName;
  const [firstColumnOfTheBoard, setFirstColumnOfTheBoard] =
    useState(initialColumnName);

  useEffect(() => {
    console.log('🔄 AddJobShortForm - effect: chosenBoard changed to:', chosenBoard);
    const changedBoard = boards.find((board) => board.name === chosenBoard);

    if (changedBoard) {
      console.log('📋 Setting first column of board to:', changedBoard.columns[0].name);
      setFirstColumnOfTheBoard(changedBoard.columns[0].name);
      localStorage.setItem(
        'firstColumnOfTheBoard',
        changedBoard.columns[0].name
      );
      setBoardColumns(changedBoard.columns);
    }
  }, [chosenBoard, boards]);

  const form = useForm({
    resolver: zodResolver(AddJobSchemaShort),
    defaultValues: {
      list: '',
      board: '',
      company: '',
      jobTitle: '',
    },
  });

  console.log('📋 Form state - company:', form.watch('company'), 'jobTitle:', form.watch('jobTitle'));
  console.log('🔢 Local state - company:', company, 'jobTitle:', jobTitle);

  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      const debouncedFn = debounce((term: string) => {
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
      }, 300);
      
      debouncedFn(searchTerm);
    },
    [dispatch, accessToken]
  );

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('📝 Company field changed to:', value);
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
    console.log('🏢 Company selected from dropdown:', selectedCompany);
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

    console.log('📡 Dispatching getCompanyThatStartsWith for selected company');
    const result = await dispatch(getCompanyThatStartsWith(values)).unwrap();
    const existingCompany = result.find(
      (comp: any) => comp.name === fullCompanyName
    );
    if (existingCompany) {
      console.log('💾 Setting companyId to localStorage:', existingCompany.id);
      localStorage.setItem('companyId', existingCompany.id);
    }
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📝 Job title field changed to:', e.target.value);
    setJobTitle(e.target.value);
    localStorage.setItem('jobTitle', e.target.value);
    form.setValue('jobTitle', e.target.value);
  };

  const watchCompany = form.watch('company');
  const watchJobTitle = form.watch('jobTitle');

  useEffect(() => {
    const isValid = watchCompany.length > 0 && watchJobTitle.length > 0;
    console.log('✅ Form validation - company:', watchCompany, 'jobTitle:', watchJobTitle, 'isValid:', isValid);
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
                <FormLabel className="text-gray-400 dark:text-slate-400">Required</FormLabel>
              </span>
              <Input
                {...field}
                value={company}
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
                <FormLabel className="text-gray-400 dark:text-slate-400">Required</FormLabel>
              </span>
              <Input
                {...field}
                value={jobTitle}
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
                  <FormLabel className="text-gray-400 dark:text-slate-400">Required</FormLabel>
                </span>
                <ComboBoardListBox
                  {...field}
                  items={boards}
                  itemsType="boards"
                  searchItem="Boards"
                  initialBoardString={initialBoardName}
                  firstColumnOfTheBoard={firstColumnOfTheBoard}
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
                  <FormLabel className="text-gray-400 dark:text-slate-400">Required</FormLabel>
                </span>
                <ComboBoardListBox
                  {...field}
                  searchItem="Lists"
                  itemsType="columns"
                  items={boardColumns}
                  initialColumnString={initialColumnName}
                  firstColumnOfTheBoard={firstColumnOfTheBoard}
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
