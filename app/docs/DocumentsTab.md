# Documents Tab Implementation Plan

## 📋 Complete Implementation Plan for Document Upload Feature

This document outlines the step-by-step implementation plan for the Documents tab functionality, including file upload, document management, and job application linking.

---

## **Phase 1: Core Modal Structure & File Upload**

### **Step 1.1: Create UploadDocumentModal.tsx**

- **Location**: `components/Misc/UploadDocumentModal.tsx`
- **Features**:
  - Create the modal component with the same structure as CreateContactModal
  - Add file input with drag & drop functionality
  - Implement title input field
  - Add category dropdown using DocumentCategory enum
  - Add optional description textarea
  - Style to match the UploadDocumentModal.PNG screenshot
- **Requirements**:
  - File upload (required)
  - Title input (required)
  - Category selection from DocumentCategory enum (required)
  - Description textarea (optional)
  - Form validation with Upload button enable/disable

### **Step 1.2: Integrate Upload Button**

- **Location**: `components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/Documents.tsx`
- **Features**:
  - Modify Documents.tsx to open UploadDocumentModal when "+ Upload" is clicked
  - Pass necessary props (current job context, board info)
- **Integration**:
  - Import and use UploadDocumentModal
  - Handle modal open/close state
  - Pass current job_id and board_id as props

### **Step 1.3: Form Validation & State Management**

- **Features**:
  - Implement form validation (file, title, category required)
  - Enable/disable Upload button based on validation
  - Handle file preview/display
  - Show file size and type information
- **Validation Rules**:
  - File: Required (show file name, size, type)
  - Title: Required (min 1 character)
  - Category: Required (must select from dropdown)
  - Description: Optional

---

## **Phase 2: Jobs Linking Functionality** ✅ **COMPLETED**

### **Step 2.1: Create Jobs Sidebar Component** ✅ **COMPLETED**

- **Location**: `components/Forms/AddDocument/DocumentSideBar.tsx` ✅
- **Features**: ✅
  - Extract and adapt the jobs linking logic from ContactSideBar.tsx ✅
  - Create DocumentSideBar.tsx with "Linked to" section ✅
  - Implement job selection dropdown (same as ComboJobsBox.tsx) ✅
  - Pre-populate current job when opened from job modal ✅
- **Sections**: ✅
  - "Linked to" header ✅
  - Jobs subsection with add/remove functionality ✅
  - Created by section (user info) ✅

### **Step 2.2: Job Management** ✅ **COMPLETED**

- **Features**: ✅
  - Allow adding/removing jobs from selection ✅
  - Display selected jobs with unlink functionality ✅
  - Handle multiple job attachments on upload ✅
- **Functionality**: ✅
  - Use ComboJobsBox pattern for job selection ✅
  - Show selected jobs with three dots menu for unlinking ✅
  - Filter out already selected jobs from dropdown ✅
  - Default to current job when opened from job modal ✅

### **Step 2.3: Modal Integration** ✅ **COMPLETED**

- **Integration**: ✅
  - Replace dummy job linking section with DocumentSideBar ✅
  - Pass user object and callback functions ✅
  - Update upload logic to handle multiple job attachments ✅
  - Reset job selections when modal closes ✅

### **Step 2.4: UI/UX Improvements** ✅ **COMPLETED**

- **Modal Enhancements**: ✅
  - Add scrollbar to left content area to prevent modal height increase ✅
  - Move UploadDocumentModal to Forms/AddDocument folder for better organization ✅
  - Update import paths accordingly ✅
  - Improve layout proportions (3/4 left, 1/4 right) ✅

---

## **Phase 3: Upload & Attachment Logic**

### **Step 3.1: Implement Upload Functionality**

- **Features**:
  - Connect uploadDocument thunk to form submission
  - Handle file upload with FormData
  - Show loading states and error handling
- **Thunk Integration**:
  - Use existing `uploadDocument` thunk from documentsThunk.ts
  - Pass file, title, boardId, category, description, accessToken
  - Handle success/error responses

### **Step 3.2: Job Application Attachments**

- **Features**:
  - Use attachDocumentToJobApplication thunk for each selected job
  - Handle multiple attachments sequentially or in parallel
  - Close modal on successful upload
- **Process Flow**:
  1. Upload document using uploadDocument thunk
  2. Get documentId from response
  3. For each selected job, call attachDocumentToJobApplication
  4. Close modal and refresh Documents tab

---

## **Phase 4: Documents Display & Management**

### **Step 4.1: Create DocumentCard.tsx**

- **Location**: `components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/DocumentCard.tsx`
- **Features**:
  - Design card layout matching DocumentCards.PNG
  - Display: filename (truncated), extension, file size
  - Add file type icon with document type pill (DOCS, PDF, etc.)
  - Show uploader info and time ago calculation
  - Add category badge with color coding
- **Card Elements**:
  - File name (truncated with ellipsis if long)
  - File extension and size on second row
  - Large file type icon with pill-shaped document type overlay
  - User photo and name
  - Upload time ("xx seconds/minutes/days ago")
  - Category badge with custom colors
  - Three dots menu button

### **Step 4.2: Documents Tab Updates**

- **Location**: `components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/Documents.tsx`
- **Features**:
  - Replace "no documents" message with document grid
  - Add document count badge to Documents tab (like Notes/Contacts)
  - Implement auto-refresh after upload
- **Updates Needed**:
  - Fetch and display documents for current job
  - Grid layout for DocumentCard components
  - Handle empty state vs. populated state

### **Step 4.3: Create Document Category Colors**

- **Location**: `constants/documentColors.ts`
- **Features**:
  - Define color constants for each DocumentCategory enum value
  - Apply consistent color scheme across badges
- **Color Mapping**:

  ```typescript
  export const documentCategoryColors = {
    [DocumentCategory.Resume]: '#3B82F6', // Blue
    [DocumentCategory.CoverLetter]: '#10B981', // Green
    [DocumentCategory.Portfolio]: '#8B5CF6', // Purple
    [DocumentCategory.Certification]: '#F59E0B', // Amber
    [DocumentCategory.Transcript]: '#EF4444', // Red
    [DocumentCategory.OfferLetter]: '#06B6D4', // Cyan
    [DocumentCategory.JobPost]: '#84CC16', // Lime
    [DocumentCategory.WritingSample]: '#F97316', // Orange
    [DocumentCategory.Recommendation]: '#EC4899', // Pink
    [DocumentCategory.Other]: '#6B7280', // Gray
  };
  ```

---

## **Phase 5: Document Actions & Edit Modal**

### **Step 5.1: Three Dots Menu**

- **Features**:
  - Add dropdown menu with "Edit Document" and "Delete Document"
  - Implement same dropdown pattern as ContactCard
- **Menu Items**:
  - Edit Document (opens EditDocumentModal)
  - Delete Document (shows confirmation dialog)

### **Step 5.2: Create EditDocumentModal.tsx**

- **Location**: `components/Misc/EditDocumentModal.tsx`
- **Features**:
  - Design modal matching EditDocumentModal.PNG
  - Display document preview (PDF, images)
  - Add editable fields: title, category, description
  - Add Download button functionality
- **Modal Sections**:
  - Document preview area (left side)
  - Edit form (right side)
  - Download button (top left)
  - Save/Cancel buttons (bottom)

### **Step 5.3: Delete Functionality**

- **Features**:
  - Create confirmation dialog (same as contact deletion)
  - Implement detachDocumentFromJobApplication thunk
  - Implement deleteDocument thunk
  - Handle cleanup and UI updates
- **Delete Process**:
  1. Show confirmation dialog with "Discard" and "Delete" buttons
  2. If confirmed, detach document from all job applications
  3. Delete the document using deleteDocument thunk
  4. Update UI and refresh Documents tab

---

## **Phase 6: Document Preview & Download**

### **Step 6.1: Document Viewer**

- **Features**:
  - Implement PDF viewer (using react-pdf or similar)
  - Add image preview for JPEG/PNG
  - Handle unsupported file types gracefully
- **Supported Formats**:
  - ✅ PDF: react-pdf library (free)
  - ✅ Images: Native browser support (JPEG, PNG, GIF, WebP)
  - ✅ Text files: Native browser support
  - ❌ DOC/DOCX: Display download option only

### **Step 6.2: Download Functionality**

- **Features**:
  - Implement document download via API
  - Handle file streaming and browser download
- **Implementation**:
  - Create download endpoint call
  - Handle file blob response
  - Trigger browser download

---

## **Phase 7: Tab Badge Integration**

### **Step 7.1: Add Document Count Badge**

- **Location**: `app/(loggedin)/home/boards/[board_id]/job/[job_id]/job-details/page.tsx`
- **Features**:
  - Add document count to Documents tab
  - Style same as Notes and Contacts badges
- **Implementation**:
  - Count documents linked to current job
  - Display badge with document count
  - Update badge when documents are added/removed

---

## 🤔 **File Format Support Analysis**

### **Easily Supported (Free Libraries)**

- ✅ **PDF**: react-pdf library (free, widely used)
- ✅ **Images**: Native browser support (JPEG, PNG, GIF, WebP, SVG)
- ✅ **Text files**: Native browser support (TXT, CSV)

### **MS Office Documents**

- ❌ **DOC/DOCX**: Requires paid libraries or server-side conversion
  - Paid options: Office Online, GroupDocs, Aspose
  - Free alternatives: Server-side LibreOffice conversion
- 🟡 **Recommendation**: Display file info only, provide download option
- 🟡 **Future enhancement**: Implement server-side conversion to PDF

### **Recommended Approach**

Start with PDF and images for preview, show download button for unsupported formats. This provides immediate value while keeping implementation simple and cost-effective.

---

## File Type Support & User Communication

### Supported File Types

#### Preview Supported (Display + Download)

- **Images**: .jpg, .jpeg, .png, .gif, .bmp, .webp, .svg
- **PDF**: .pdf
- **Text**: .txt, .md, .markdown, .json, .csv
- **Code**: .js, .ts, .jsx, .tsx, .html, .css, .xml
- **Plain text formats**: .log, .config, .env (for display purposes)

#### Download Only (No Preview)

- **Office Documents**: .doc, .docx, .xls, .xlsx, .ppt, .pptx
- **Google Docs**: .gdoc, .gsheet, .gslides
- **Archives**: .zip, .rar, .7z, .tar, .gz
- **Executables**: .exe, .msi, .app, .dmg
- **Other**: .pdf (encrypted), .bin, proprietary formats

### User Communication Strategy

#### 1. Upload Modal Information

**Location**: Top of UploadDocumentModal

```tsx
<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
  <h4 className="font-medium text-blue-900 mb-1">File Type Support</h4>
  <p className="text-sm text-blue-700">
    <strong>Preview supported:</strong> Images, PDF, text files, code files
  </p>
  <p className="text-sm text-blue-700">
    <strong>Download only:</strong> Office docs, archives, executables, and
    other file types
  </p>
  <button
    type="button"
    className="text-blue-600 underline text-xs mt-1"
    onClick={() => setShowDetailedInfo(!showDetailedInfo)}
  >
    {showDetailedInfo ? 'Hide' : 'Show'} detailed format list
  </button>
  {showDetailedInfo && (
    <div className="mt-2 text-xs text-blue-600">
      <p>
        <strong>Preview:</strong> .jpg, .png, .pdf, .txt, .md, .json, .html,
        .css, .js, .ts
      </p>
      <p>
        <strong>Download:</strong> .doc, .docx, .xls, .xlsx, .zip, .exe, and
        others
      </p>
    </div>
  )}
</div>
```

#### 2. Document Card Indicators

**Visual indicators on document cards:**

- **Preview available**: Eye icon (👁️) with "Click to preview"
- **Download only**: Download icon (⬇️) with "Download file"
- **File size and type always visible**

#### 3. Preview Modal Fallback

**When user clicks preview on unsupported file:**

```tsx
<div className="text-center p-8">
  <DownloadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
  <h3 className="text-lg font-medium text-gray-900 mb-2">
    Preview not available
  </h3>
  <p className="text-gray-600 mb-4">
    This file type (.{fileExtension}) cannot be previewed in the browser.
  </p>
  <Button onClick={handleDownload} className="mb-2">
    <DownloadIcon className="h-4 w-4 mr-2" />
    Download {document.title}
  </Button>
  <p className="text-xs text-gray-500">
    File size: {formatFileSize(document.file_size)}
  </p>
</div>
```

#### 4. Help/Info Section

**Location**: Documents tab header (info icon)

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <InfoIcon className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent className="max-w-xs">
      <div className="space-y-2">
        <p className="font-medium">Supported File Types</p>
        <div className="text-xs">
          <p>
            <strong>Preview:</strong> Images, PDF, text, code files
          </p>
          <p>
            <strong>Download only:</strong> Office docs, archives, others
          </p>
          <p className="text-gray-500 mt-1">
            All file types can be uploaded and downloaded safely.
          </p>
        </div>
      </div>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

#### 5. Upload Success Message

**Enhanced feedback after upload:**

```tsx
{
  uploadSuccess && (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
      <p className="text-green-800 font-medium">Upload successful!</p>
      <p className="text-sm text-green-700">
        {isPreviewSupported(uploadedFile.type)
          ? 'File uploaded and preview available'
          : 'File uploaded - download available (preview not supported for this file type)'}
      </p>
    </div>
  );
}
```

### Implementation Notes

#### File Type Detection

```tsx
// utils/fileTypeSupport.ts
export const PREVIEW_SUPPORTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/json',
  'text/csv',
  'text/html',
  'text/css',
  'application/javascript',
  'text/javascript',
  'application/typescript',
];

export const isPreviewSupported = (mimeType: string): boolean => {
  return PREVIEW_SUPPORTED_TYPES.includes(mimeType);
};

export const getFileTypeCategory = (
  mimeType: string
): 'preview' | 'download' => {
  return isPreviewSupported(mimeType) ? 'preview' : 'download';
};
```

#### UI Component States

- **Document cards show appropriate icons/actions**
- **Preview button only appears for supported types**
- **Download button always available**
- **Clear visual distinction between preview/download-only files**

This approach ensures users always know what to expect from their uploaded files while maintaining a clean, informative interface.

---

## 📁 **Files to Create/Modify**

### **New Files to Create**

1. `components/Misc/UploadDocumentModal.tsx`
2. `components/Misc/EditDocumentModal.tsx`
3. `components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/DocumentCard.tsx`
4. `components/Forms/AddDocument/DocumentSideBar.tsx`
5. `constants/documentColors.ts`
6. `hooks/useDocumentPreview.ts` (for file preview logic)
7. `utils/fileHelpers.ts` (for file size formatting, type detection)

### **Files to Modify**

1. `components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/Documents.tsx`
2. `app/(loggedin)/home/boards/[board_id]/job/[job_id]/job-details/page.tsx`
3. `utils/ReturnIcons.tsx` (add file type icons)
4. `types/index.d.ts` (add document-related types if needed)

---

## 🚀 **Implementation Order**

### **Priority 1: Core Functionality**

1. Phase 1: Core Modal Structure & File Upload
2. Phase 3: Upload & Attachment Logic
3. Phase 4.1-4.2: Basic Documents Display

### **Priority 2: Enhanced Features**

1. Phase 2: Jobs Linking Functionality
2. Phase 4.3: Category Colors
3. Phase 7: Tab Badge Integration

### **Priority 3: Advanced Features**

1. Phase 5: Document Actions & Edit Modal
2. Phase 6: Document Preview & Download

---

## 📝 **Notes for Implementation**

### **Patterns to Follow**

- Use CreateContactModal.tsx as the template for UploadDocumentModal
- Use ContactCard.tsx pattern for DocumentCard layout
- Use ContactSideBar.tsx pattern for DocumentSideBar
- Follow same validation and form handling patterns
- Use same dropdown menu styling as contacts

### **State Management**

- Follow Redux patterns established in contacts and notes
- Use existing thunks from documentsThunk.ts
- Update Redux state after successful operations
- Handle loading states and error handling consistently

### **UI/UX Consistency**

- Match existing modal styling and behavior
- Use same color scheme and spacing
- Follow established patterns for badges, buttons, and forms
- Ensure responsive design matches rest of application

---

## ✅ **Ready to Begin Implementation**

The plan is structured to build functionality incrementally, allowing for testing and validation at each step. Each phase builds upon the previous ones, ensuring a solid foundation before adding advanced features.

**Recommended Starting Point**: Phase 1, Step 1.1 - Create UploadDocumentModal.tsx

This approach ensures we have a working file upload system before adding complex features like job linking and document management.
