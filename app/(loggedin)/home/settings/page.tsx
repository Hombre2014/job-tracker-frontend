'use client';

import Image from 'next/image';

import Modal from '@/components/Misc/Modal';
import { useAppSelector } from '@/redux/hooks';
import { useState, useTransition } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AccountSettingsSchema } from '@/schemas';
import { Input } from '@/components/ui/input';

const Settings = () => {
  const { firstName } = useAppSelector((state) => state.user);
  const { lastName } = useAppSelector((state) => state.user);
  const { email } = useAppSelector((state) => state.user);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(true);

  const form = useForm<z.infer<typeof AccountSettingsSchema>>({
    resolver: zodResolver(AccountSettingsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = (data: z.infer<typeof AccountSettingsSchema>) => {
    console.log(data);
  };

  return (
    <Modal>
      <div className="flex mx-auto bg-white w-full h-auto">
        <section className="w-full">
          <div className="flex flex-col items-start p-6">
            <Image
              src="/images/Yuriy.jpg"
              alt="User profile picture"
              width={50}
              height={50}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold">
              {firstName} {lastName}
            </h1>
            <button className="btn btn-sm btn-ghost pl-0">{email}</button>
          </div>
          <div
            role="tablist"
            className="tabs tabs-lifted flex flex-col justify-start items-start w-full"
          >
            <div className="w-full pt-40">
              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab focus:!bg-blue-500 !rounded-md ml-2 focus:!text-white"
                aria-label="My Account"
                defaultChecked
                style={{
                  backgroundColor: open ? '#3b82f6' : 'white',
                  color: open ? 'white' : 'black',
                }}
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 rounded-box p-6 w-auto min-h-[600px] ml-60 mt-[-360px] border-b"
              >
                <div className="w-full border-b pb-2">General Info</div>
                <div className="flex gap-8">
                  <div className="w-1/4">
                    <Image
                      src="/images/Yuriy.jpg"
                      alt="User profile picture"
                      width={50}
                      height={50}
                      className="mt-4 mb-2"
                    />
                    <p>Profile photo</p>
                  </div>
                  <div className="w-3/4">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="flex flex-col gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isPending}
                                    type="text"
                                    placeholder="John"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isPending}
                                    type="text"
                                    placeholder="Doe"
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
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full">
              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab focus:bg-blue-500 !rounded-md ml-2 absolute top-[400px] focus:text-white"
                aria-label="Notes & Notifications"
                onClick={() => setOpen(false)}
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 rounded-box p-6 w-auto min-h-[600px] ml-60 mt-[-360px]"
              >
                Email Subscriptions
              </div>
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default Settings;
