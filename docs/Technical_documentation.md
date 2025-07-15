# Technical Documentation

## Production Token Refresh System

### Overview

A robust, production-ready automatic token refresh system that prevents authentication failures in production environments by transparently refreshing JWT tokens before they expire and retrying failed requests.

### Architecture

#### Core Implementation

The token refresh system is implemented as an enhanced axios response interceptor that handles expired tokens automatically without user intervention.

```typescript
// File: api/client.ts
let refreshPromise: Promise<string> | null = null;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Automatic token refresh logic
  }
);
```

#### Key Components

1. **Race Condition Prevention**: Single refresh promise queue
2. **Request Retry Logic**: Automatic retry of failed requests
3. **Header Synchronization**: Updates both default and request-specific headers
4. **Graceful Fallback**: Redirects to login only when refresh fails

### Technical Implementation

#### 1. Automatic 401 Error Handling

```typescript
if (
  typeof window !== 'undefined' &&
  error.response?.status === 401 &&
  !originalRequest._retry
) {
  originalRequest._retry = true;
  // Begin refresh process
}
```

#### 2. Race Condition Prevention

**Problem**: Multiple concurrent API calls with expired tokens could trigger multiple refresh attempts.

**Solution**: Refresh promise queue ensures only one refresh at a time:

```typescript
// If refresh already in progress, wait for it
if (refreshPromise) {
  await refreshPromise;
  const newAccessToken = localStorage.getItem('accessToken');
  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
  return client(originalRequest);
}
```

#### 3. Token Refresh Process

```typescript
refreshPromise = (async () => {
  try {
    const refreshResponse = await axios.get('/auth/refresh', {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    // Extract the new tokens from the payload
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      refreshResponse.data;

    // Update localStorage
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    // Update default headers for future requests
    client.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } finally {
    refreshPromise = null; // Cleanup
  }
})();
```

#### 4. Request Retry Logic

After successful token refresh, the original failed request is automatically retried:

```typescript
const newAccessToken = await refreshPromise;
originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
return client(originalRequest); // Retry original request
```

### Production Benefits

#### Before Implementation

- **User Experience**: Sudden logouts after 30+ minutes of activity
- **Production Issue**: 401 Unauthorized errors in Vercel deployment
- **Business Impact**: Users losing work and having to re-authenticate frequently

#### After Implementation

- **Seamless Experience**: Users can work indefinitely without interruption
- **Transparent Refresh**: Token renewal happens in background
- **Production Stable**: Eliminates authentication failures in production
- **Improved Reliability**: Handles concurrent requests and race conditions

### Error Handling Strategy

#### 1. Refresh Success Path

```text
API Call → 401 Error → Token Refresh → Original Request Retry → Success
```

#### 2. Refresh Failure Path

```text
API Call → 401 Error → Token Refresh Fails → Clean Storage → Redirect to Login
```

#### 3. Concurrent Request Handling

```text
Multiple 401s → Single Refresh → All Requests Wait → All Retry with New Token
```

### Code Quality Measures

#### TypeScript Safety

- **Proper typing**: `Promise<string> | null` for refresh promise
- **Error handling**: Comprehensive try-catch blocks
- **Type guards**: Runtime checks for browser environment

#### Memory Management

- **Promise cleanup**: `refreshPromise = null` in finally block
- **Storage management**: Proper localStorage cleanup on failure
- **Header management**: Clean default headers on logout

#### Production Optimizations

- **Environment checks**: Browser-only execution
- **Existing endpoint usage**: Leverages current `/auth/refresh` API
- **Minimal changes**: Single file modification for maximum stability

### Integration Points

#### 1. Existing Authentication System

- **Compatible**: Works with current JWT implementation
- **Non-breaking**: Enhances existing login/logout flow
- **Storage**: Uses existing localStorage token management

#### 2. Redux Integration

- **Independent**: Operates at axios level, doesn't require Redux changes
- **Compatible**: Works with existing token state management
- **Flexible**: Can be enhanced with Redux updates if needed

#### 3. Error Boundaries

- **Fallback**: Maintains existing error handling patterns
- **Graceful**: Always provides fallback to login page
- **User-friendly**: No exposed technical errors to users

### Monitoring and Debugging

#### Development Logging

- **Token refresh attempts**: Logged for debugging
- **Race condition detection**: Visible in dev tools
- **Error tracking**: Comprehensive error information

#### Production Monitoring

- **Silent operation**: No console noise in production
- **Error reporting**: Maintains error tracking capabilities
- **Performance**: Minimal overhead for token operations

## Document Upload System Implementation

### System Overview

A comprehensive document upload and management system for the Job Tracker application, allowing users to upload files, link them to job applications, and manage document metadata with real-time UI updates.

### Document System Architecture

#### Components Structure

```text
components/Forms/AddDocument/
├── UploadDocumentModal.tsx       # Main upload interface
├── DocumentSideBar.tsx           # Job linking sidebar
└── DocumentCard.tsx              # Document display component

components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/
├── Documents.tsx                 # Documents tab container
└── DocumentCard.tsx              # Document card display
```

#### Redux Integration

- **Store**: `redux/documents/` - Document state management
- **Store**: `redux/jobs/` - Job application state with documents array
- **Thunks**: `uploadDocument`, `attachDocumentToJobApplication`, `getJobPost`

### Key Features

#### 1. File Upload System

- **Drag & Drop Support**: Full drag-and-drop interface with visual feedback
- **File Validation**: 10MB size limit, comprehensive type checking
- **File Preview**: Real-time file information display
- **Extension Preservation**: Critical logic to maintain file extensions

```typescript
// Extension preservation logic
const originalExtension = selectedFile.name.split('.').pop() || '';
const userTitle = title.trim();

let finalTitle = userTitle;
if (originalExtension && !userTitle.includes('.')) {
  finalTitle = `${userTitle}.${originalExtension}`;
}
```

#### 2. Job Linking System

- **Multi-Job Attachment**: Documents can be linked to multiple job applications
- **Real-time UI Updates**: Job selection with immediate feedback
- **Parallel Processing**: Efficient attachment handling

#### 3. Document Display

- **File Type Detection**: Smart extension-based type recognition
- **Color-coded Badges**: Visual file type indicators
- **File Size Display**: Enhanced with localStorage fallback
- **Responsive Grid**: Scrollable card layout

### Critical Bug Fixes (July 11, 2025)

#### Problem 1: Redux State Corruption in jobsSlice

**Location**: `redux/jobs/jobsSlice.ts` - `getJobPost.fulfilled` case

**Issue**: The reducer was incorrectly replacing the entire `jobPosts` array with a single job object:

```typescript
// WRONG - This corrupted the Redux state
.addCase(getJobPost.fulfilled, (state, action) => {
  state.jobPosts = action.payload; // ❌ Single object assigned to array
})
```

**Solution**:

```typescript
// CORRECT - Update specific job in array
.addCase(getJobPost.fulfilled, (state, action) => {
  const index = state.jobPosts.findIndex(job => job.id === action.payload.id);
  if (index !== -1) {
    state.jobPosts[index] = action.payload; // ✅ Update existing
  } else {
    state.jobPosts.push(action.payload); // ✅ Add new if not found
  }
})
```

#### Problem 2: Race Condition with Duplicate getJobPost Calls

**Location**: Multiple components calling `getJobPost` simultaneously

**Issue**: Race condition between UploadDocumentModal and Documents.tsx both calling `getJobPost`:

1. **UploadDocumentModal** calls `getJobPost` to refresh current job
2. **Documents.tsx** calls `getJobPost` via `handleDocumentsRefresh` (onUploadSuccess)
3. Two simultaneous calls create race condition causing state corruption

**Symptoms**:

- App crashes after document upload
- `jobPosts.find is not a function` errors
- Redux state corruption
- React render errors

**Root Cause Analysis**:

1. Document upload triggers `getJobPost` to refresh job data
2. `getJobPost` returns a single `JobApplication` object
3. Reducer incorrectly assigns single object to `jobPosts` array
4. Subsequent array operations fail catastrophically

**Solution**:

- **Removed duplicate refresh** from UploadDocumentModal
- **Single responsibility**: Documents.tsx exclusively handles job refresh via `onUploadSuccess`
- **Added defensive programming** in layout.tsx with `Array.isArray(jobPosts)` check

```typescript
// UploadDocumentModal.tsx - Removed duplicate refresh
// Note: Current job refresh is handled by onUploadSuccess callback
// to avoid duplicate refresh calls and race conditions

// layout.tsx - Defensive programming
const safeJobPosts = Array.isArray(jobPosts) ? jobPosts : [];
const currentJobPost = safeJobPosts.find((jobPost) => jobPost.id === job_id);
```

**Impact**: Both fixes combined resolved all document upload crashes and state inconsistencies.

### File Type Detection System

#### Extension Mapping

```typescript
// Design system integrated file type colors
const fileTypeColors = {
  pdf: 'hsl(0 84.2% 60.2%)', // Alert red for PDFs
  doc: 'hsl(221.2 83.2% 53.3%)', // Professional blue for documents
  docx: 'hsl(221.2 83.2% 53.3%)', // Professional blue for documents
  jpg: 'hsl(270.7 91% 65.1%)', // Creative purple for images
  jpeg: 'hsl(270.7 91% 65.1%)', // Creative purple for images
  png: 'hsl(270.7 91% 65.1%)', // Creative purple for images
  xls: 'hsl(142.1 76.2% 36.3%)', // Success green for spreadsheets
  // Uses HSL values that integrate with design system and ensure accessibility
} as const;
```

#### Smart Detection Logic

1. **Primary**: Extract extension from filename
2. **Fallback**: Use document category mapping
3. **Display**: Unified uppercase badges (PDF, IMG, DOC, etc.)

### State Management

#### Document State Flow

1. **Upload** → `uploadDocument` thunk (includes fileSize in request)
2. **Attach** → `attachDocumentToJobApplication` thunk (parallel)
3. **Refresh** → `getJobPost` thunk (sequential to avoid conflicts)
4. **Display** → File size retrieved from database via API response

#### Database-Backed File Size Storage (July 15, 2025)

##### Migration from localStorage to Database

The document system has been upgraded to use database-backed file size storage for improved reliability:

```typescript
// OLD APPROACH (Removed): localStorage fallback
// localStorage.setItem(`fileSize_${uploadResult.id}`, fileSize.toString());
// const storedFileSize = localStorage.getItem(`fileSize_${document.id}`);

// NEW APPROACH: Database integration
// Upload includes file size in request payload
formData.append('fileSize', file.size.toString());

// Display uses database value directly
const fileSize = document.fileSize; // From API response
```

**Benefits of Database Storage:**

- ✅ Persistent across browser sessions and devices
- ✅ No data loss when localStorage is cleared
- ✅ Consistent data reliability
- ✅ Simplified code architecture

### Performance Optimizations

#### Preventing Race Conditions

To prevent Redux state conflicts and race conditions:

```typescript
// AVOID: Multiple components calling getJobPost simultaneously
// UploadDocumentModal: dispatch(getJobPost(...))  ← Race condition!
// Documents.tsx: dispatch(getJobPost(...))        ← Race condition!

// CORRECT: Single responsibility pattern
// UploadDocumentModal: onUploadSuccess() callback only
// Documents.tsx: handles getJobPost exclusively via handleDocumentsRefresh
```

#### Sequential Job Refresh

To prevent Redux state conflicts, job refreshes are performed sequentially:

```typescript
// Avoid parallel dispatches that could corrupt state
for (const job of jobsConnectedToDocument) {
  await dispatch(getJobPost({ jobPostId: job.id, accessToken })).unwrap();
}
```

#### Optimized Re-renders

- Form validation with `useEffect` debouncing
- Conditional rendering based on upload state
- Efficient file handling with `useRef`

#### Function-level Optimizations

- **Timestamp optimization**: `Date.now()` instead of `new Date().getTime()` for better performance
- **Minimal object creation**: Reduced unnecessary Date object instantiation in frequently called functions
- **Efficient time calculations**: Optimized `getTimeAgo` function for document grid rendering

```typescript
// Optimized time calculation (called for every document card)
const now = Date.now(); // Direct timestamp - no object creation
const diffInMs = now - uploadDate.getTime();
```

#### Defensive Programming

To prevent crashes from state corruption:

```typescript
// Always validate array types before operations
const safeJobPosts = Array.isArray(jobPosts) ? jobPosts : [];
const currentJobPost = safeJobPosts.find((jobPost) => jobPost.id === job_id);

// Guard against undefined/null values
const jobDocuments = currentJob?.documents || [];
```

### Error Handling

#### Comprehensive Error Coverage

1. **File Validation**: Size, type checking with user feedback
2. **Upload Errors**: Network failures with retry suggestions
3. **State Errors**: Graceful fallbacks for refresh failures
4. **UI Errors**: Non-blocking warnings for secondary operations

```typescript
try {
  // Primary upload operation
  const uploadResult = await dispatch(uploadDocument(params)).unwrap();
} catch (error) {
  toast.error('Failed to upload document. Please try again.');
} finally {
  setIsUploading(false); // Always reset loading state
}
```

### Security Considerations

#### File Upload Security

- File size limits (10MB)
- Type validation on frontend
- Secure token-based API authentication
- No direct file execution or rendering

#### Data Privacy

- LocalStorage used only for enhancement, not sensitive data
- Access tokens properly managed through Redux
- No file content stored locally

### API Integration

#### Document Upload Flow

```typescript
// 1. Upload document
POST /documents
{
  file: FormData,
  title: string,
  category: DocumentCategory,
  description?: string,
  boardId: string
}

// 2. Attach to job (if selected)
POST /job-applications/{jobId}/documents/{documentId}

// 3. Refresh job data
GET /job-applications/{jobId}
```

### Testing Considerations

#### Critical Test Cases

1. **File Extension Preservation**: User changes title, extension retained
2. **Redux State Integrity**: Multiple uploads don't corrupt `jobPosts`
3. **Race Condition Prevention**: Simultaneous uploads don't cause state corruption
4. **Error Recovery**: Failed uploads don't leave partial state
5. **File Type Detection**: All supported types display correct badges
6. **Job Linking**: Multi-job attachment works correctly
7. **Defensive Programming**: App doesn't crash when `jobPosts` is corrupted
8. **Single Responsibility**: Only one component handles job refresh per upload

#### Race Condition Test Scenarios

- **Rapid sequential uploads**: Multiple documents uploaded quickly
- **Multi-job linking**: Document attached to multiple jobs simultaneously
- **Concurrent user actions**: Upload while other users modify same job
- **Network delays**: Slow API responses during state updates

### Future Enhancements

#### Planned Improvements

1. **Edit Functionality**: In-place document editing
2. **Advanced Preview**: PDF/image preview in modal
3. **Bulk Operations**: Multi-document upload
4. **Search/Filter**: Document search within jobs

### Maintenance Notes

#### Code Quality

- All TypeScript errors resolved
- No console.log statements in production
- Comprehensive error handling
- Clean component separation

#### Dependencies

- React 18+ for concurrent features
- Redux Toolkit for state management
- React Hook Form for form validation
- React Toastify for user feedback

## Document Management System Enhancements

### Technical Overview

Comprehensive improvements to the document management system addressing security concerns, popup blocker compatibility, type safety, and SSR compatibility across both user and board-specific document pages.

### Security & SSR Improvements

#### localStorage Access Safety

**Problem**: Direct localStorage access can crash applications during server-side rendering or when storage is disabled.

**Solution**: Secure localStorage access wrapper implemented across all document components:

```typescript
const accessToken = (() => {
  try {
    return localStorage.getItem('accessToken');
  } catch (error) {
    console.warn('Failed to access localStorage:', error);
    return null;
  }
})();
```

**Benefits**:

- SSR compatibility (Next.js safe)
- Graceful handling of disabled storage
- Debugging visibility via console warnings
- Consistent null fallback behavior

### Popup Blocker & Download Reliability

#### Enhanced Download Handling

**Problem**: Browser popup blockers and cross-origin restrictions caused unreliable document downloads.

**Solution**: Multi-layered fallback system with robust error handling:

```typescript
// Primary: New tab approach
const newTab = window.open(url, '_blank', 'noopener,noreferrer');

// Fallback: Direct download link for popup blockers
if (!newTab || newTab.closed) {
  const link = document.createElement('a');
  link.href = url;
  link.download = title || 'document';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Enhanced status detection with error handling
const checkTabStatus = setTimeout(() => {
  try {
    if (newTab && !newTab.closed) {
      toast.success('Document opened in new tab');
    } else {
      toast.success('Document has been downloaded');
    }
  } catch (error) {
    console.warn('Could not check tab status:', error);
    toast.success('Document has been processed');
  }
}, 1000);
```

**Improvements**:

- Increased timeout from 500ms to 1000ms for better reliability
- Cross-origin access protection via try-catch
- Consistent user feedback across all scenarios
- Graceful degradation for restrictive environments

### Type Safety & Route Parameters

#### Dynamic Route Parameter Validation

**Problem**: `useParams()` returns potentially undefined or array values for dynamic routes.

**Solution**: Type-safe parameter extraction with validation:

```typescript
// Extract board ID safely
const { board_id } = useParams();
const boardId = Array.isArray(board_id) ? board_id[0] : board_id;

// Validate after all hooks (React compliance)
if (!boardId) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-center text-xl text-red-500">Invalid board ID</p>
    </div>
  );
}
```

**Benefits**:

- Prevents runtime errors from undefined parameters
- Handles array values from catch-all routes
- React Hooks compliance (validation after hooks)
- User-friendly error messaging

### Code Quality Improvements

#### Constants Extraction

Removed magic numbers and inline styles with meaningful constants:

```typescript
// Document display constants
const TITLE_MAX_LENGTH = 20;
const RESPONSIVE_GRID_STYLES = {
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
} as const;
```

#### Enhanced Error Handling

Consistent error handling patterns across all localStorage access:

```typescript
// Updated approach: Database-backed file size (July 15, 2025)
// OLD: localStorage fallback (removed)
// try {
//   const storedFileSize = localStorage.getItem(`fileSize_${doc.id}`);
//   fileSize = storedFileSize ? parseInt(storedFileSize) : doc.fileSize;
// } catch (error) {
//   console.warn('Failed to access localStorage for file size:', error);
// }

// NEW: Direct database value
const fileSize = document.fileSize; // Reliable from API response
```

### Implementation Scope

#### Files Enhanced

1. **User Documents Page** (`app/(loggedin)/home/documents/page.tsx`)
   - Global document management across all boards
   - Enhanced security and popup handling
   - Improved type safety

2. **Board Documents Page** (`app/(loggedin)/home/boards/[board_id]/documents/page.tsx`)
   - Board-specific document management
   - Dynamic route parameter validation
   - Consistent security improvements

3. **Job Documents Component** (`components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/Documents.tsx`)
   - Job-specific document handling
   - Enhanced deletion logic and error handling

#### Consistency Benefits

- Unified error handling patterns
- Consistent user feedback across all document contexts
- Standardized security practices
- Improved maintainability and debugging

### UI/UX Improvements

#### Document Card Layout Consistency (July 15, 2025)

**Problem**: Document cards in different pages had inconsistent sizing behavior:

- **User Documents Page**: Cards expanded to fill available space using `repeat(auto-fit, minmax(200px, 1fr))`
- **Board Documents Page**: Cards maintained fixed 200px width using `repeat(auto-fill, 200px)`
- **Issue**: Wide screens caused cards to become excessively wide and difficult to scan

**Solution**: Standardized all document pages to use fixed-width grid layout:

```typescript
// BEFORE: User Documents (Responsive - problematic)
const RESPONSIVE_GRID_STYLES = {
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
} as const;

// AFTER: All Document Pages (Fixed - consistent)
const FIXED_GRID_STYLES = {
  gap: '16px',
  display: 'grid',
  justifyContent: 'start',
  gridTemplateColumns: 'repeat(auto-fill, 200px)',
} as const;
```

**Benefits**:

- ✅ Consistent visual appearance across all document pages
- ✅ Optimal card width for readability (200px)
- ✅ Better user experience on wide screens
- ✅ Uniform behavior between User and Board document management

#### Components Updated

- `app/(loggedin)/home/documents/page.tsx` - User Documents Page
- Grid layout now matches Board Documents behavior
- Maintains responsive scrolling with fixed card dimensions

### Document Security Considerations
