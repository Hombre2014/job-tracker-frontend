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
  statusChangedAt: string;
  jobPostStatus:
    | 'Job Created'
    | 'Deadline'
    | 'Applied'
    | 'Interview'
    | 'Offer Received'
    | 'Job Moved';
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
  status: string;
  postUrl: string;
  columnId: string;
  timeStamp: string;
  companyName: string;
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
  initialString: string;
  items: Board[] | Column[];
  itemsType?: 'boards' | 'columns';
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
  sendData?: (fieldName: string, value: string) => void;
}
