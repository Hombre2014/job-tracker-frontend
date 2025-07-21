'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { IoMdContact } from 'react-icons/io';

import { cn } from '@/lib/utils';
import Modal from '@/components/Misc/Modal';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/redux/hooks';
import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/redux/user/userThunk';

const Settings = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(true);
  const accessToken = localStorage.getItem('accessToken');
  const { lastName } = useAppSelector((state) => state.user);
  const [newLastName, setNewLastName] = useState(lastName);
  const { firstName } = useAppSelector((state) => state.user);
  const [newFirstName, setNewFirstName] = useState(firstName);
  const { email, profilePicUrl } = useAppSelector((state) => state.user);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  useEffect(() => {
    dispatch(
      updateUser({
        email,
        accessToken,
        role: 'user',
        lastName: newLastName,
        firstName: newFirstName,
      })
    );
  }, [newFirstName, newLastName, dispatch, accessToken, email]);

  const handleWeeklyDigest = () => {
    // TODO: Implement weekly digest functionality
  };

  const handleDailyDigest = () => {
    // TODO: Implement daily digest functionality
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFile = files[0];
      setPreviewImageUrl(URL.createObjectURL(selectedFile));

      try {
        await dispatch(
          updateUser({
            email,
            role: 'user',
            lastName: newLastName,
            firstName: newFirstName,
            profilePic: selectedFile,
            accessToken: accessToken as string,
          })
        ).unwrap();

        toast.success('Profile photo updated successfully!', {
          position: 'bottom-right',
        });
      } catch (error) {
        console.error('Error updating profile photo:', error);
        toast.error('Failed to update profile photo.', {
          position: 'bottom-right',
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  return (
    <Modal stylings="sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-5/12">
      <div className="flex mx-auto bg-white w-full h-auto rounded-md">
        <section className="w-full">
          <div className="flex flex-col items-start p-6">
            <label htmlFor="file-input">
              {previewImageUrl ? (
                <Image
                  width={50}
                  height={50}
                  src={previewImageUrl} // Show the preview image if available
                  className="rounded-full"
                  alt="User profile picture"
                />
              ) : profilePicUrl ? (
                <Image
                  width={50}
                  height={50}
                  src={profilePicUrl} // Show the user's current photo if available
                  className="rounded-full"
                  alt="User profile picture"
                />
              ) : (
                <IoMdContact size={50} /> // Show the default icon if no photo is available
              )}
            </label>
            <p className="text-xl font-bold pt-2">
              {newFirstName} {newLastName}
            </p>
            <span className="pl-0">{email}</span>
          </div>
          <div className="tabs tabs-lifted flex flex-col justify-start items-start w-full">
            <div className="w-full pt-40">
              <input
                type="radio"
                defaultChecked
                name="my_tabs_2"
                id="tab-account"
                aria-label="My Account"
                className={cn(
                  'tab focus:!bg-blue-500 !rounded-md ml-2 focus:!text-white',
                  open ? 'bg-blue-500 text-white' : 'bg-white text-black',
                  open ? 'text-white' : 'text-black'
                )}
              />
              <div
                role="tabpanel"
                aria-labelledby="tab-account"
                className="tab-content bg-base-100 rounded-box p-6 w-auto min-h-[600px] ml-64 mt-[-340px] border-b"
              >
                <div className="w-full border-b pb-2">General Info</div>
                <div className="flex gap-6">
                  <div className="w-1/4">
                    <label htmlFor="file-input">
                      {previewImageUrl ? (
                        <Image
                          width={50}
                          height={50}
                          src={previewImageUrl}
                          alt="User profile picture"
                          className="mt-4 mb-2 cursor-pointer rounded-full"
                        />
                      ) : profilePicUrl ? (
                        <Image
                          width={50}
                          height={50}
                          src={profilePicUrl}
                          alt="User profile picture"
                          className="mt-4 mb-2 cursor-pointer rounded-full"
                        />
                      ) : (
                        <IoMdContact
                          size={50}
                          className="mt-4 mb-2 cursor-pointer"
                        />
                      )}
                      <input
                        type="file"
                        id="file-input"
                        accept="image/*"
                        name="file-input"
                        title="file-input"
                        onChange={handleFileInput}
                        className="file-input file-input-ghost max-w-xs opacity-0 absolute top-[100px] h-[62px] w-[50px]"
                      />
                    </label>
                    <p>Profile photo</p>
                  </div>
                  <div className="w-3/4">
                    <form className="space-y-6">
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
                id="tab-notifications"
                onClick={() => setOpen(false)}
                aria-label="Notes & Notifications"
                className="tab focus:bg-blue-500 !rounded-md ml-2 absolute top-[400px] focus:text-white"
              />
              <div
                role="tabpanel"
                aria-labelledby="tab-notifications"
                className="tab-content bg-base-100 rounded-box p-6 w-auto min-h-[600px] ml-64 mt-[-340px]"
              >
                <div className="w-full border-b pb-2">Email Subscriptions</div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Weekly Digest</span>
                    <input
                      defaultChecked
                      type="checkbox"
                      className="checkbox"
                      onClick={handleWeeklyDigest}
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Daily Digest</span>
                    <input
                      defaultChecked
                      type="checkbox"
                      className="checkbox"
                      onClick={handleDailyDigest}
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col w-fit">
                <Button
                  variant="none"
                  className="relative bottom-20 ml-2 text-gray-600 hover:!bg-none"
                >
                  Download my data
                </Button>
                <Button
                  variant="none"
                  className="relative bottom-20 ml-2 text-red-600 hover:!bg-none"
                >
                  Delete my account
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default Settings;
