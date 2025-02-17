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
  | 'Applied'
  | 'Deadline'
  | 'Interview'
  | 'Job Moved'
  | 'Job Created'
  | 'Offer Received';

type Notes = {
  id: string;
  order: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  jobApplicationId: string;
};

type Email = {
  id: string;
  email: string;
  type: 'WORK' | 'PERSONAL';
};

type Phone = {
  id: string;
  phone: string;
  type: 'WORK' | 'PERSONAL';
};

type CompanyIds = {
  id: string;
};

type Contact = {
  id: string;
  userId: string;
  boardId: string;
  emails: Email[];
  phones: Phone[];
  comment: string;
  photoUrl: string;
  location: string;
  lastName: string;
  jobTitle: string;
  firstName: string;
  githubUrl: string;
  createdAt: string;
  updatedAt: string;
  twitterUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  companyIds: CompanyIds[];
};

type JobApplication = {
  id: string;
  title: string;
  color: string;
  salary: string;
  notes: Notes[];
  postUrl: string;
  location: string;
  deadline: string;
  company: Company;
  column_id: string;
  contacts: Contact[];
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
  notes: Notes[];
  postUrl: string;
  columnId: string;
  deadline: string;
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
  firstColumnOfTheBoard?: string;
  itemsType?: 'boards' | 'columns';
}

interface AlertDialogProps {
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
  open?: boolean;
  stylings?: string;
  dialogTitle: string;
  dialogText?: string;
  buttonCancel: string;
  buttonConfirm: string;
  contentWidth?: string;
  isFormValid?: boolean;
  children?: React.ReactNode;
  actionFunction?: () => void;
  destructiveVariant?: boolean;
  buttonLabel?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
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
  autoSave?: boolean;
  placeholder?: string;
  buttonVisibility?: boolean;
  sendData?: (fieldName: keyof JobApplication, value: string) => void;
}

interface ColorPickerProps {
  id: string;
  value?: string;
  sendData: (fieldName: keyof JobApplication, value: string) => void;
}
