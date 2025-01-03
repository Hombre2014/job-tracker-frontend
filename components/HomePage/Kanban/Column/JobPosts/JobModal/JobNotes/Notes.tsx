import { useParams } from 'next/navigation';

import TextEditor from '../JobEdit/TextEditor';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  createJobApplicationNote,
  getAllJobApplicationNotes,
} from '@/redux/notes/notesThunk';

const Notes = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();

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
    <TextEditor
      value=""
      id="notes"
      title="Notes"
      backColor="lightyellow"
      buttonVisibility={true}
      placeholder="Add a note"
      sendData={handleFieldChange}
    />
  );
};

export default Notes;
