type MenuItemProps = {
  linkName: string;
  icon: JSX.Element;
};

interface Column {
  id: string;
  name: string;
  order: number;
  boardId: string;
}

interface Board {
  id: string;
  name: string;
  columns: Column[] | null;
}

interface WorkDocument {
  id: string;
  userId: string;
  title: string;
  category: string;
  description?: string;
  url: string;
  boardId: string;
}

interface ComboBoxProps {
  items: Board[];
  searchItem: string;
  initialString?: string;
}

interface LinkDocumentProps {
  docs: WorkDocument[];
  searchItem: string;
  initialString: string;
}

interface AlertDialogProps {
  buttonLabel?: React.ReactNode;
  dialogTitle: string;
  dialogText: string;
  buttonConfirm: string;
  buttonCancel: string;
  actionFunction: () => void;
  stylings?: string;
}
