'use client';

import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { AddJobSchemaShort } from '@/schemas';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getBoardWithColumns } from '@/redux/boards/boardsThunk';
import ComboBoardListBox from '@/components/Forms/AddJobShort/ComboBoardListBox';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const AddJobShortForm = ({ columnOrder }: { columnOrder: number }) => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const { boards } = useAppSelector((state) => state.boards);
  const [boardColumns, setBoardColumns] = useState(
    boards.find((board) => board.id === board_id)!.columns
  );

  const initialColumnName = boardColumns![columnOrder].name;
  const initialBoardName = boards.find((board) => board.id === board_id)!.name;

  const chosenBoard = localStorage.getItem('chosenBoard') || initialBoardName;
  const chosenColumn =
    localStorage.getItem('chosenColumn') || initialColumnName;

  useEffect(() => {
    const changedBoard = boards.find((board) => board.name === chosenBoard);
    const changedBoardId = changedBoard?.id;
    const values = {
      accessToken,
      boardId: changedBoardId,
    };

    dispatch(getBoardWithColumns(values));
    setBoardColumns(
      boards.find((board) => board.id === changedBoardId)!.columns
    );
  }, [board_id, chosenBoard, chosenColumn, boardColumns]);

  const form = useForm({
    resolver: zodResolver(AddJobSchemaShort),
    defaultValues: {
      company: '',
      jobTitle: '',
      board: '',
      list: '',
    },
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany(e.target.value);
    localStorage.setItem('company', e.target.value);
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
    localStorage.setItem('jobTitle', e.target.value);
  };

  useEffect(() => {
    if (initialColumnName) {
      const columnId = boardColumns!.find(
        (column) => column.name === initialColumnName
      )?.id;
      localStorage.setItem('columnId', columnId as string);
      localStorage.setItem('chosenColumn', initialColumnName);
    }
  }, [initialColumnName, boardColumns]);

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem className="!text-left">
              <span className="flex justify-between">
                <FormLabel className="text-gray-800 font-semibold">
                  Company
                </FormLabel>
                <FormLabel className="text-gray-400">Required</FormLabel>
              </span>
              <Input
                {...field}
                value={company}
                placeholder="Company name"
                onChange={(e) => handleCompanyChange(e)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem className="!text-left">
              <span className="flex justify-between">
                <FormLabel className="text-gray-800 font-semibold">
                  Job Title
                </FormLabel>
                <FormLabel className="text-gray-400">Required</FormLabel>
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
                  <FormLabel className="text-gray-800 font-semibold">
                    Board
                  </FormLabel>
                  <FormLabel className="text-gray-400">Required</FormLabel>
                </span>
                <ComboBoardListBox
                  {...field}
                  items={boards}
                  itemsType="boards"
                  searchItem="Boards"
                  value={form.watch('board')} // Controlled value
                  initialString={initialBoardName}
                  onChange={(selectedBoard) => {
                    const newBoard = boards.find(
                      (board) => board.name === selectedBoard
                    );
                    const firstColumn =
                      newBoard?.columns[0]?.name || initialColumnName;

                    // Update form state
                    form.setValue('board', selectedBoard); // Update selected board
                    form.setValue('list', firstColumn); // Update list to first column of new board

                    // Update localStorage
                    localStorage.setItem('chosenBoard', selectedBoard);
                    localStorage.setItem('chosenColumn', firstColumn);
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
                  <FormLabel className="text-gray-800 font-semibold">
                    List
                  </FormLabel>
                  <FormLabel className="text-gray-400">Required</FormLabel>
                </span>
                <ComboBoardListBox
                  {...field}
                  searchItem="Lists"
                  itemsType="columns"
                  items={boardColumns} // Dynamic columns based on chosen board
                  initialString={initialColumnName}
                  onChange={(selectedColumn) => {
                    form.setValue('list', selectedColumn); // Update list field
                    localStorage.setItem('chosenColumn', selectedColumn);
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
