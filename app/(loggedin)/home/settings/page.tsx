'use client';

import Image from 'next/image';

import Modal from '@/components/Misc/Modal';
import { useAppSelector } from '@/redux/hooks';
import { useState } from 'react';
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
import { cn } from '@/lib/utils';
import { AccountSettingsSchema } from '@/schemas';
import { Input } from '@/components/ui/input';

const Settings = () => {
  const { firstName } = useAppSelector((state) => state.user);
  const { lastName } = useAppSelector((state) => state.user);
  const { email } = useAppSelector((state) => state.user);
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [open, setOpen] = useState(true);

  const handleSubmit = () => {
    console.log('submit');
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
              {newFirstName} {newLastName}
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
                className={cn(
                  'tab focus:!bg-blue-500 !rounded-md ml-2 focus:!text-white',
                  open ? 'bg-blue-500 text-white' : 'bg-white text-black',
                  open ? 'text-white' : 'text-black'
                )}
                aria-label="My Account"
                defaultChecked
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="flex flex-col gap-4">
                        <label>First Name</label>
                        <Input
                          type="text"
                          placeholder="John"
                          value={newFirstName}
                          onChange={(e) => setNewFirstName(e.target.value)}
                        />
                        <label>Last Name</label>
                        <Input
                          type="text"
                          placeholder="Doe"
                          value={newLastName}
                          onChange={(e) => setNewLastName(e.target.value)}
                        />
                      </div>
                    </form>
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
