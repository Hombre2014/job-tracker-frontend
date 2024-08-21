'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { AddJobSchemaShort } from '@/schemas';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/redux/hooks';
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
  const { boards } = useAppSelector((state) => state.boards);
  const boardColumns = boards.find((board) => board.id === board_id)!.columns;
  const currenColumnName = boardColumns![columnOrder].name;

  const form = useForm({
    resolver: zodResolver(AddJobSchemaShort),
    defaultValues: {
      company: '',
      jobTitle: '',
      board: '',
      list: '',
    },
  });

  const onSubmit = (values: z.infer<typeof AddJobSchemaShort>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem className="!text-left">
              <span className="flex justify-between">
                <FormLabel className="text-gray-800 font-semibold">
                  Company
                </FormLabel>
                <FormLabel>Required</FormLabel>
              </span>
              <FormControl>
                <Input placeholder="Company name" {...field} />
              </FormControl>
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
                <FormLabel>Required</FormLabel>
              </span>
              <FormControl>
                <Input placeholder="Job Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between gap-4 pb-8">
          <FormField
            control={form.control}
            name="board"
            render={({ field }) => (
              <FormItem className="!text-left w-1/2">
                <span className="flex justify-between">
                  <FormLabel className="text-gray-800 font-semibold">
                    Board
                  </FormLabel>
                  <FormLabel>Required</FormLabel>
                </span>
                <FormControl>
                  <ComboBoardListBox
                    itemsType="boards"
                    items={boards}
                    searchItem="Boards"
                    initialString=""
                    {...field}
                  />
                </FormControl>
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
                  <FormLabel>Required</FormLabel>
                </span>
                <FormControl>
                  <ComboBoardListBox
                    itemsType="columns"
                    items={boardColumns}
                    searchItem="Lists"
                    initialString={currenColumnName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default AddJobShortForm;
