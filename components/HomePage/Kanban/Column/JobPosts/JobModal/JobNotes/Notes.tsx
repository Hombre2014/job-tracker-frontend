import TextEditor from '../JobEdit/TextEditor';

const Notes = () => {
  return (
    <TextEditor
      backColor="lightyellow"
      initialText="Type your notes here..."
      buttonVisibility={true}
    />
  );
};

export default Notes;
