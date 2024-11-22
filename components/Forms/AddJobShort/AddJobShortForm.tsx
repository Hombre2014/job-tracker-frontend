'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { AddJobSchemaShort } from '@/schemas';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getBoards, getBoardWithColumns } from '@/redux/boards/boardsThunk';
import ComboBoardListBox from '@/components/Forms/AddJobShort/ComboBoardListBox';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
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
  const currenColumnName = boardColumns![columnOrder].name;
  const currentBoardName = boards.find((board) => board.id === board_id)!.name;
  const chosenBoard = localStorage.getItem('chosenBoard');

  useEffect(() => {
    // Get the board id from the local storage board's name
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
  }, [dispatch, board_id, chosenBoard, accessToken]);

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
    if (currenColumnName) {
      const columnId = boardColumns!.find(
        (column) => column.name === currenColumnName
      )?.id;
      localStorage.setItem('columnId', columnId as string);
    }
  }, [currenColumnName, boardColumns]);

  useEffect(() => {
    dispatch(getBoards(accessToken as string));
  }, [dispatch, accessToken]);

  console.log('currenColumnName: ', currenColumnName);
  console.log('currentBoardName: ', currentBoardName);

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
                placeholder="Company name"
                {...field}
                value={company}
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
                placeholder="Job Title"
                {...field}
                value={jobTitle}
                onChange={(e) => handleJobTitleChange(e)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="flex justify-between gap-4 pb-4">
          <FormField
            control={form.control}
            name="board"
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
                  itemsType="boards"
                  items={boards}
                  searchItem="Boards"
                  // value={chosenBoard}
                  initialString={currentBoardName}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="list"
            render={({ field }) => (
              <FormItem className="!text-left w-1/2">
                <span className="flex justify-between">
                  <FormLabel className="text-gray-800 font-semibold">
                    List
                  </FormLabel>
                  <FormLabel className="text-gray-400">Required</FormLabel>
                </span>
                <ComboBoardListBox
                  itemsType="columns"
                  items={boardColumns}
                  searchItem="Lists"
                  // value={currenColumnName}
                  initialString={currenColumnName}
                  {...field}
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
