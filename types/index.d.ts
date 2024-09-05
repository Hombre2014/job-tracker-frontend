type MenuItemProps = {
  linkName: string;
  icon: JSX.Element;
};

type Company = {
  id: string;
  name: string;
  description: string;
  url: string;
  industry: string;
};

type JobApplication = {
  id: string;
  column_id: string;
  title: string;
  post_url: string;
  salary: string;
  location: string;
  description: string;
  color: string;
  deadline: string;
  company_id: string;
  jobPostStatus:
    | 'Job Created'
    | 'Deadline'
    | 'Applied'
    | 'Interview'
    | 'Offer Received'
    | 'Job Moved';
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
  columns: Column[];
  isArchived: boolean;
  userId: string;
}

interface JobPostShort {
  id: string;
  title: string;
  companyName: string;
  description: string;
  columnId: string;
}

interface JobPostCardProps {
  title: string;
  companyName: string;
  status: string;
  timeStamp: string;
  id: string;
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

interface ComboBoardListBoxProps {
  items: Board[] | Column[];
  itemsType?: 'boards' | 'columns';
  searchItem: string;
  initialString: string;
}

interface AlertDialogProps {
  buttonLabel?: React.ReactNode;
  buttonVariant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'outlineNew'
    | 'secondary'
    | 'ghost'
    | 'normal'
    | 'none'
    | null
    | undefined;
  dialogTitle: string;
  dialogText?: string;
  buttonConfirm: string;
  buttonCancel: string;
  actionFunction?: () => void;
  stylings?: string;
  children?: React.ReactNode;
}
