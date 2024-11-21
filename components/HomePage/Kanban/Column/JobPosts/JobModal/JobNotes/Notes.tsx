import TextEditor from '../JobEdit/TextEditor';

const Notes = () => {
  return (
    <TextEditor
      id="notes"
      backColor="lightyellow"
      initialText="Type your notes here..."
      buttonVisibility={true}
    />
  );
};

export default Notes;
