'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { IoMdContact } from 'react-icons/io';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import Modal from '@/components/Misc/Modal';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/redux/hooks';
import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/redux/user/userSlice';
import {
  getBothNotifications,
  createUpdateDeleteNotifications,
} from '@/redux/notifications/notificationsThunk';

const Settings = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { lastName } = useAppSelector((state) => state.user);
  const [newLastName, setNewLastName] = useState(lastName);
  const { firstName } = useAppSelector((state) => state.user);
  const [newFirstName, setNewFirstName] = useState(firstName);
  const { email, profilePicUrl } = useAppSelector((state) => state.user);
  const [newEmail, setNewEmail] = useState(email);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const { daily, weekly, loading } = useAppSelector(
    (state) => state.notifications
  );
  const [weeklyDigest, setWeeklyDigest] = useState(!!weekly);
  const [dailyDigest, setDailyDigest] = useState(!!daily);
  const [notificationsDirty, setNotificationsDirty] = useState(false);

  // Removed automatic updateUser call - should only update when user explicitly saves

  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      setAccessToken(token);
      if (token) {
        dispatch(getBothNotifications(token));
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      setAccessToken(null);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!notificationsDirty) {
      setWeeklyDigest(!!weekly);
      setDailyDigest(!!daily);
    }
  }, [weekly, daily, notificationsDirty]);

  const handleWeeklyDigest = () => {
    setNotificationsDirty(true);
    setWeeklyDigest((prev) => !prev);
  };

  const handleDailyDigest = () => {
    setNotificationsDirty(true);
    setDailyDigest((prev) => !prev);
  };

  const handleDownloadData = () => {
    // TODO: Implement data download functionality
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation modal
  };

  const handleSaveNotifications = async () => {
    if (!accessToken) {
      toast.error('Access token not available. Please log in again.', {
        autoClose: 3000,
        position: 'top-right',
      });
      return;
    }

    try {
      const timezoneOffset = new Date().getTimezoneOffset();
      const notifications = {
        daily: dailyDigest
          ? {
              time: '09:00' as const,
              timezoneOffset: -timezoneOffset,
            }
          : null,
        weekly: weeklyDigest
          ? {
              time: '09:00' as const,
              dayOfWeek: 'MONDAY' as const,
              timezoneOffset: -timezoneOffset,
            }
          : null,
      };

      await dispatch(
        createUpdateDeleteNotifications({
          accessToken,
          notifications,
        })
      ).unwrap();

      setNotificationsDirty(false);

      toast.success('Notification preferences updated successfully!', {
        autoClose: 3000,
        position: 'top-right',
      });

      router.back();
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error(
        'Failed to update notification preferences. Please try again.',
        {
          autoClose: 3000,
          position: 'top-right',
        }
      );
    }
  };

  const handleSaveProfile = async () => {
    if (!accessToken) {
      toast.error('Access token not available. Please log in again.', {
        autoClose: 3000,
        position: 'top-right',
      });
      return;
    }

    try {
      await dispatch(
        updateUser({
          role: 'user',
          email: newEmail,
          lastName: newLastName,
          firstName: newFirstName,
          accessToken: accessToken,
        })
      ).unwrap();

      toast.success('Profile updated successfully!', {
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        position: 'top-right',
        hideProgressBar: false,
      });

      // Close the modal by navigating back to the previous page
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.', {
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        position: 'top-right',
        hideProgressBar: false,
      });
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFile = files[0];
      setPreviewImageUrl(URL.createObjectURL(selectedFile));

      if (!accessToken) {
        toast.error('Access token not available. Please log in again.', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }

      try {
        await dispatch(
          updateUser({
            email: newEmail,
            role: 'user',
            lastName: newLastName,
            firstName: newFirstName,
            profilePic: selectedFile,
            accessToken: accessToken,
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

  const [activeTab, setActiveTab] = useState<'account' | 'notifications'>(
    'account'
  );

  return (
    <Modal stylings="sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-5/12">
      <div className="flex mx-auto bg-white dark:bg-slate-800 w-full h-auto rounded-md">
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
                <IoMdContact size={50} className="dark:text-slate-300" /> // Show the default icon if no photo is available
              )}
            </label>
            <p className="text-xl font-bold pt-2 dark:text-white">
              {newFirstName} {newLastName}
            </p>
            <span className="pl-0 dark:text-slate-300">{email}</span>
          </div>
          <div className="flex w-full">
            <div className="flex flex-col gap-2 p-4 min-w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('account')}
                className={cn(
                  'flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 pl-2 mr-2 rounded-md dark:text-white',
                  activeTab === 'account'
                    ? 'border border-blue-500 bg-blue-300/30 dark:bg-blue-600/40 hover:bg-blue-300/30 dark:hover:bg-blue-600/40'
                    : ''
                )}
              >
                My Account
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className={cn(
                  'flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 pl-2 mr-2 rounded-md dark:text-white',
                  activeTab === 'notifications'
                    ? 'border border-blue-500 bg-blue-300/30 dark:bg-blue-600/40 hover:bg-blue-300/30 dark:hover:bg-blue-600/40'
                    : ''
                )}
              >
                Notes & Notifications
              </button>
            </div>
            {activeTab === 'account' && (
              <div className="bg-base-100 dark:bg-slate-800 rounded-box p-6 w-full min-h-[460px] border border-slate-200 dark:border-slate-600 mr-4 mb-4">
                <div className="w-full border-b border-slate-200 dark:border-slate-600 pb-2 dark:text-white">
                  General Info
                </div>
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
                          className="mt-4 mb-2 cursor-pointer dark:text-slate-300"
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
                    <p className="dark:text-slate-300">Profile photo</p>
                  </div>
                  <div className="w-3/4">
                    <form className="space-y-6">
                      <div className="flex flex-col gap-4 mt-4">
                        <label className="dark:text-white">First Name</label>
                        <Input
                          type="text"
                          placeholder="John"
                          value={newFirstName}
                          onChange={(e) => setNewFirstName(e.target.value)}
                          className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white"
                        />
                        <label className="dark:text-white">Last Name</label>
                        <Input
                          type="text"
                          placeholder="Doe"
                          value={newLastName}
                          onChange={(e) => setNewLastName(e.target.value)}
                          className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white"
                        />
                        <label className="dark:text-white">Email Address</label>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-base-100 dark:bg-slate-800 rounded-box p-6 w-full min-h-[460px] border border-slate-200 dark:border-slate-600 mb-4 mr-4">
                <div className="w-full border-b border-slate-200 dark:border-slate-600 pb-2 dark:text-white">
                  Email Subscriptions
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text dark:text-slate-300">
                      Weekly Digest
                    </span>
                    <input
                      checked={weeklyDigest}
                      type="checkbox"
                      className="checkbox border-slate-300 dark:border-slate-600"
                      onChange={handleWeeklyDigest}
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text dark:text-slate-300">
                      Daily Digest
                    </span>
                    <input
                      checked={dailyDigest}
                      type="checkbox"
                      className="checkbox border-slate-300 dark:border-slate-600"
                      onChange={handleDailyDigest}
                    />
                  </label>
                </div>
                <div className="flex flex-col w-fit mt-6">
                  <Button
                    variant="ghost"
                    onClick={handleDownloadData}
                    className="justify-start text-gray-600 dark:text-slate-400"
                  >
                    Download my data
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleDeleteAccount}
                    className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete my account
                  </Button>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    onClick={handleSaveNotifications}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default Settings;
