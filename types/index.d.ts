type MenuItemProps = {
  linkName: string;
  icon: JSX.Element;
};

type Company = {
  id: string;
  url: string;
  name: string;
  industry: string;
  description: string;
};

type jobPostStatus =
  | 'Job Created'
  | 'Deadline'
  | 'Applied'
  | 'Interview'
  | 'Offer Received'
  | 'Job Moved';

type JobApplication = {
  id: string;
  title: string;
  color: string;
  salary: string;
  postUrl: string;
  location: string;
  deadline: string;
  company: Company;
  column_id: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  status: jobPostStatus;
  statusChangedAt: string;
};

interface Column {
  id: string;
  name: string;
  order: number;
  board_id: string;
  jobApplications: JobApplication[];
}

interface Board {
  id: string;
  name: string;
  userId: string;
  columns: Column[];
  isArchived: boolean;
}

interface JobPostCardProps {
  id: string;
  title: string;
  color: string;
  postUrl: string;
  columnId: string;
  timeStamp: string;
  companyName: string;
  status: jobPostStatus;
  statusChangedTime: string;
}

interface WorkDocument {
  id: string;
  url: string;
  title: string;
  userId: string;
  boardId: string;
  category: string;
  description?: string;
}

interface ComboBoxProps {
  items: Board[];
  searchItem: string;
  initialString?: string;
}

interface LinkDocumentProps {
  searchItem: string;
  docs: WorkDocument[];
  initialString: string;
}

interface ComboBoardListBoxProps {
  searchItem: string;
  items: Board[] | Column[];
  initialBoardString?: string;
  initialColumnString?: string;
  itemsType?: 'boards' | 'columns';
  firstColumnOfTheBoard?: string;
  sendDataToParent: (value: string) => void;
}

interface AlertDialogProps {
  buttonLabel?: React.ReactNode;
  buttonVariant?:
    | null
    | 'link'
    | 'none'
    | 'ghost'
    | 'normal'
    | 'default'
    | 'outline'
    | 'secondary'
    | 'outlineNew'
    | 'destructive'
    | undefined;
  stylings?: string;
  dialogTitle: string;
  dialogText?: string;
  buttonCancel: string;
  buttonConfirm: string;
  children?: React.ReactNode;
  actionFunction?: () => void;
}

interface InputElementProps {
  id: string;
  value?: string;
  stylings?: string;
  labelName?: string;
  fieldName?: string;
  defaultValue?: string;
  placeholderName?: string;
  sendData?: (fieldName: keyof JobApplication, value: string) => void;
}

interface TextEditorProps {
  id: string;
  title?: string;
  value?: string;
  backColor?: string;
  initialText?: string;
  buttonVisibility?: boolean;
  sendData?: (fieldName: keyof JobApplication, value: string) => void;
}

interface ColorPickerProps {
  id: string;
  value?: string;
  sendData: (fieldName: keyof JobApplication, value: string) => void;
}
