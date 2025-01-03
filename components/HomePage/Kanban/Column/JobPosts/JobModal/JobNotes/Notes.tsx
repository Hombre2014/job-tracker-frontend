import TextEditor from '../JobEdit/TextEditor';

const Notes = () => {
  const handleFieldChange = (
    fieldName: keyof JobApplication,
    value: string,
    status?: string
  ) => {
    console.log(fieldName, value);
  };

  return (
    <TextEditor
      value=""
      id="notes"
      title="Notes"
      backColor="lightyellow"
      buttonVisibility={true}
      sendData={handleFieldChange}
      initialText="Type your notes here..."
    />
  );
};

export default Notes;
