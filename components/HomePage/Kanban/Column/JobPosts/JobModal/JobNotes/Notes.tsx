import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BsThreeDots } from 'react-icons/bs';

import TextEditor from '../JobEdit/TextEditor';
import { Card, CardDescription } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  createJobApplicationNote,
  getAllJobApplicationNotes,
} from '@/redux/notes/notesThunk';

const Notes = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const { firstName, lastName } = useAppSelector((state) => state.user);

  useEffect(() => {
    const updatePayload = {
      accessToken,
      jobApplicationId: job_id,
    };
    dispatch(getAllJobApplicationNotes(updatePayload));
  }, [accessToken, dispatch, job_id]);

  const { notes } = useAppSelector((state) => state.notes);

  const handleFieldChange = (
    fieldName: keyof JobApplication,
    value: string,
    status?: string
  ) => {
    const updatePayload = {
      noteContent: value,
      jobApplicationId: job_id,
      accessToken: localStorage.getItem('accessToken'),
    };

    // Check if the note is not empty
    if (value.trim() === '') {
      return;
    }

    dispatch(createJobApplicationNote(updatePayload));
  };

  return (
    <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
      <TextEditor
        value=""
        id="notes"
        title="Notes"
        backColor="lightyellow"
        buttonVisibility={true}
        placeholder="Add a note"
        sendData={handleFieldChange}
      />

      <div className="flex flex-row-reverse flex-wrap w-full gap-4 justify-end">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex flex-col basis-[calc(33.333%-16px)] gap-1"
          >
            <Card className="w-full min-h-60 max-h-60 overflow-y-auto bg-yellow-100 relative rounded-sm  hover:border-gray-400">
              <BsThreeDots className="absolute top-2 right-4 size-6 bg-white rounded-lg p-1 border border-gray-500  hover:border-gray-800" />
              <CardDescription
                className="p-4 mt-6"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            </Card>
            <div className="flex justify-between items-center mx-2">
              <span>
                <p>
                  {firstName} {lastName}
                </p>
              </span>
              <span>
                {(() => {
                  const now = Date.now();
                  const createdAt = new Date(note.createdAt);
                  const updatedAt = note.updatedAt
                    ? new Date(note.updatedAt)
                    : createdAt;

                  // Add the timezone adjustment
                  const adjustedTime = updatedAt.getTime() + 60 * 60 * 1000; // Add 1 hour like in JobPostCard
                  const diffInSeconds = Math.floor((now - adjustedTime) / 1000);

                  const formatTimeUnit = (value: number, unit: string) => {
                    return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
                  };

                  if (diffInSeconds < 60) {
                    return formatTimeUnit(diffInSeconds, 'second');
                  } else if (diffInSeconds < 3600) {
                    const diffInMinutes = Math.floor(diffInSeconds / 60);
                    return formatTimeUnit(diffInMinutes, 'minute');
                  } else if (diffInSeconds < 86400) {
                    const diffInHours = Math.floor(diffInSeconds / 3600);
                    return formatTimeUnit(diffInHours, 'hour');
                  } else {
                    const diffInDays = Math.floor(diffInSeconds / 86400);
                    return formatTimeUnit(diffInDays, 'day');
                  }
                })()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
