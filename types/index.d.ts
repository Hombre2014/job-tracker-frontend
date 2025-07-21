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
  companies: Company[];
  jobApplications: JobApplication[];
};

interface CreateContactModalProps {
  showButton: boolean;
  isVisible?: boolean;
  buttonLabel?: string;
  dialogTitle?: string;
  onClose?: () => void;
  buttonConfirm?: string;
  userContactsPage?: boolean;
  onContactCreated?: () => void;
  contactToEdit?: Contact | null;
  onContactUpdated?: (updatedContact: Contact) => void;
}

interface CreateContactFormProps {
  defaultJobPost: boolean;
  isUserContactsPage?: boolean;
  contactToEdit?: Contact | null;
  jobsConnectedToContact: JobApplication[];
  setPendingImage: (file: File | null) => void;
  onValidationChange: (isValid: boolean) => void;
  setJobsConnectedToContact: (jobs: JobApplication[]) => void;
}

interface ContactsListProps {
  contacts: Contact[];
  refetchContacts?: () => void;
}

interface ContactSideBarProps {
  jobs: any;
  user: any;
  job_id: string;
  jobsConnectedToContact: JobApplication[];
  onJobsChange: (jobs: JobApplication[]) => void;
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

type JobDocument = WorkDocument & {
  fileSize?: number;
  createdAt?: string;
  updatedAt?: string;
  fileExtension?: string;
  uploadedBy?: {
    lastName: string;
    firstName: string;
    profilePicUrl?: string;
  };
  jobApplications?: JobApplication[];
};

interface ComboBoxProps {
  items: Board[];
  searchItem: string;
  initialString?: string;
}

interface LinkDocumentProps {
  searchItem: string;
  docs: JobDocument[];
  initialString: string;
  onDocumentSelect?: (documentTitle: string, documentId: string) => void;
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

interface SocialMediaLinksProps {
  twitterUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  handleFieldChange: (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

interface CompaniesInputProps {
  companies: string[];
  companyIds: string[];
  currentInput: string;
  showDropdown: boolean;
  matchingCompanies: string[];
  setCompanyIds: (ids: string[]) => void;
  setCurrentInput: (input: string) => void;
  onCompanySelect: (company: string) => void;
  setCompanies: (companies: string[]) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ComboJobsBoxProps {
  buttonWidth: string;
  jobPosts: JobApplication[];
  jobsConnectedToContact: JobApplication[];
  onJobSelect: (jobTitle: string, jobId: string) => void;
}

// Type interfaces for Documents thunks
interface GetDocumentParams {
  documentId: string;
  accessToken: string;
}

interface UploadDocumentParams {
  file: File;
  title: string;
  boardId: string;
  accessToken: string;
  description: string;
  category: DocumentCategory;
}

interface AttachDocumentParams {
  jobId: string;
  documentId: string;
  accessToken: string;
}

interface DetachDocumentParams {
  jobId: string;
  documentId: string;
  accessToken: string;
}

interface DeleteDocumentParams {
  documentId: string;
  accessToken: string;
}

type JobApplication = {
  id: string;
  title: string;
  color: string;
  salary: string;
  notes: Notes[];
  postUrl: string;
  boardId?: string;
  location: string;
  deadline: string;
  company: Company;
  column_id: string;
  createdAt: string;
  updatedAt: string;
  contacts: Contact[];
  description: string;
  status: jobPostStatus;
  statusChangedAt: string;
  documents: JobDocument[];
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

interface DocumentCardProps {
  document: JobDocument;
  onDelete?: (documentId: string) => void;
  onEdit?: (document: JobDocument) => void;
  onDownload?: (document: JobDocument) => void;
}

interface UploadDocumentModalProps {
  isVisible?: boolean;
  onClose?: () => void;
  showButton?: boolean;
  buttonLabel?: string;
  dialogTitle?: string;
  defaultJobId?: string;
  onUploadSuccess?: () => void;
}

interface EditDocumentsProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  documentToEdit: JobDocument;
}
