import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BsThreeDots } from 'react-icons/bs';

import TextEditor from '../JobEdit/TextEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import {
  createJobApplicationNote,
  updateJobApplicationNote,
  deleteJobApplicationNote,
  getAllJobApplicationNotes,
} from '@/redux/notes/notesThunk';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Notes = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const { notes } = useAppSelector((state) => state.notes);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const { firstName, lastName } = useAppSelector((state) => state.user);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const currentNote = notes.find((note) => note.id === editingNoteId);

  useEffect(() => {
    dispatch(getAllJobApplicationNotes(job_id as string));
  }, [dispatch, job_id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInsideEditor =
        ((event.target as Element).closest('.rsw-editor') &&
          (event.target as Element).closest('#edit-note')) ||
        (event.target as Element).closest('#edit-note');

      const isClickInsideToolbar = (event.target as Element).closest(
        '.rsw-toolbar'
      );

      if (editingNoteId && !isClickInsideEditor && !isClickInsideToolbar) {
        const editingNote = notes.find((note) => note.id === editingNoteId);
        if (editingNote && editingNoteContent !== editingNote.content) {
          const updatePayload = {
            noteId: editingNoteId,
            noteContent: editingNoteContent,
          };

          dispatch(updateJobApplicationNote(updatePayload)).then(() => {
            dispatch(getAllJobApplicationNotes(job_id as string));
          });
        }
        setEditingNoteId(null);
        setEditingNoteContent('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingNoteId, editingNoteContent, dispatch, notes, job_id]);

  const handleFieldChange = (
    fieldName: keyof JobApplication,
    value: string,
    status?: string
  ) => {
    if (value.trim() === '') {
      return;
    }

    const updatePayload = {
      noteContent: value,
      jobApplicationId: job_id,
    };

    dispatch(createJobApplicationNote(updatePayload));
  };

  const getTimeAgo = (note: any) => {
    const now = Date.now();
    const createdAt = new Date(note.createdAt);
    const updatedAt = note.updatedAt ? new Date(note.updatedAt) : createdAt;
    const adjustedTime = updatedAt.getTime();
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
  };

  const handleEditNote = (note: any) => {
    setEditingNoteId(note.id);
    setEditingNoteContent(note.content);
    setOpenDropdownId(null);
  };

  const handleContentUpdate = (
    fieldName: keyof JobApplication,
    value: string
  ) => {
    setEditingNoteContent(value);
  };

  const handleDeleteNote = (noteId: string) => {
    dispatch(deleteJobApplicationNote(noteId)).then(() => {
      dispatch(getAllJobApplicationNotes(job_id as string));
    });
    setOpenDropdownId(null);
  };

  const handleCancel = () => {
    setOpenDropdownId(null);
  };

  const sortedNotes = [...notes].reverse();

  return (
    <div className="flex flex-col gap-2 max-h-[570px] overflow-y-auto">
      <TextEditor
        value=""
        id="notes"
        title="Notes"
        buttonVisibility={true}
        placeholder="Add a note"
        sendData={handleFieldChange}
      />

      {editingNoteId && (
        <div className="mb-4">
          <TextEditor
            id="edit-note"
            placeholder=""
            autoSave={true}
            title="Edit Note"
            buttonVisibility={false}
            value={editingNoteContent}
            sendData={handleContentUpdate}
          />
          <div className="flex justify-between items-center mx-2 text-sm text-muted-foreground">
            <span>
              <p>
                {firstName} {lastName}
              </p>
            </span>
            <span>{currentNote && getTimeAgo(currentNote)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-row flex-wrap w-full gap-4">
        {sortedNotes
          .filter((note) => note.id !== editingNoteId)
          .map((note) => (
            <div
              key={note.id}
              className="flex flex-col basis-[calc(33.333%-16px)] gap-1"
            >
              <Card
                className="w-full min-h-60 max-h-60 overflow-y-auto bg-yellow-50 dark:bg-slate-700 dark:text-white relative rounded-sm hover:border-gray-400 dark:hover:border-gray-300 cursor-pointer"
                onClick={() => handleEditNote(note)}
              >
                <div className="sticky top-0 right-0 z-10 flex justify-end w-full">
                  <DropdownMenu
                    open={openDropdownId === note.id}
                    onOpenChange={(isOpen: boolean) =>
                      setOpenDropdownId(isOpen ? note.id : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="invisible" className="!mr-2 !mt-2">
                        <BsThreeDots className="size-6 bg-white dark:bg-slate-300 dark:text-slate-900 rounded-lg p-1 border border-gray-500 dark:border-gray-600 hover:border-gray-800 dark:hover:border-gray-100" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 rsw-dropdown-menu">
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="rsw-dropdown-menu-item"
                      >
                        <AlertDialogModal
                          cleanupType="none"
                          buttonCancel="Cancel"
                          buttonVariant="ghost"
                          buttonConfirm="Delete"
                          dialogTitle="Delete Note"
                          buttonLabel="Delete Note"
                          destructiveVariant={true}
                          onOpenChange={(isOpen: boolean) => {
                            if (!isOpen) handleCancel();
                          }}
                          actionFunction={() => handleDeleteNote(note.id)}
                          dialogText="Are you sure you want to delete this note?"
                          stylings="ml-0 pl-2 font-normal inline-flex justify-start w-full text-left"
                        />
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="rsw-dropdown-menu-item"
                        onClick={() => handleEditNote(note)}
                      >
                        Edit Note
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardContent
                  className="pl-2 pt-0 pr-8 cursor-text text-gray-900 dark:text-gray-100"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              </Card>
              <div className="flex justify-between items-center mx-2 text-sm text-muted-foreground">
                <span>
                  <p>
                    {firstName} {lastName}
                  </p>
                </span>
                <span>{getTimeAgo(note)}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Notes;
