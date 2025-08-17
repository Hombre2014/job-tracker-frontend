# Technical Documentation

## Email Notifications System Architecture (17/08/2025)

### System Overview

The email notifications system provides users with automated job board status updates via daily and weekly digest emails. The system is built with a Redux-based state management architecture, integrated with a unified backend API endpoint, and seamlessly embedded into the existing settings modal interface.

### Architecture Components

#### Redux State Management

**Notifications Slice Structure**:

```typescript
// redux/notifications/notificationsSlice.ts
interface NotificationsState {
  daily: NotificationSettings | null;
  weekly: NotificationSettings | null;
  loading: boolean;
  error: string | null;
}

interface NotificationSettings {
  id?: string;
  time: string; // "HH:MM" format (e.g., "09:00")
  timezoneOffset: number; // -840 to 720 minutes
  type: 'DAILY' | 'WEEKLY';
  dayOfWeek?:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';
  scheduledTime?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
```

**Key Design Decisions**:

- **Null State Handling**: `null` values represent disabled notifications ("OFF" state)
- **Timezone Awareness**: `timezoneOffset` ensures notifications are sent at correct local time
- **Type Safety**: Strongly typed interfaces prevent runtime errors
- **Extensible Structure**: Architecture supports future notification types and scheduling options

#### API Integration Pattern

**Unified Endpoint Design**:

```typescript
// Single endpoint for both GET and POST operations
const ENDPOINT = '/notifications/report';

// GET: Fetch current notification settings
export const getBothNotifications = createAsyncThunk(
  'notifications/getBothNotifications',
  async (accessToken: string) => {
    const response = await client.get(ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data as NotificationsResponse;
  }
);

// POST: Update notification preferences
export const createUpdateDeleteNotifications = createAsyncThunk(
  'notifications/createUpdateDeleteNotifications',
  async ({
    accessToken,
    notifications,
  }: {
    accessToken: string;
    notifications: CreateUpdateNotificationRequest;
  }) => {
    const response = await client.post(ENDPOINT, notifications, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data as NotificationsResponse;
  }
);
```

**Request/Response Structure**:

```typescript
// Request format for updating notifications
interface CreateUpdateNotificationRequest {
  daily: {
    time: string;
    timezoneOffset: number;
  } | null;
  weekly: {
    time: string;
    timezoneOffset: number;
    dayOfWeek:
      | 'MONDAY'
      | 'TUESDAY'
      | 'WEDNESDAY'
      | 'THURSDAY'
      | 'FRIDAY'
      | 'SATURDAY'
      | 'SUNDAY';
  } | null;
}

// Response format from backend
interface NotificationsResponse {
  daily: NotificationSettings | null;
  weekly: NotificationSettings | null;
}
```

#### UI Integration Architecture

**Settings Modal Enhancement**:

```typescript
// app/(loggedin)/home/settings/page.tsx
const Settings = () => {
  const { daily, weekly, loading } = useAppSelector(
    (state) => state.notifications
  );
  const [weeklyDigest, setWeeklyDigest] = useState(!!weekly);
  const [dailyDigest, setDailyDigest] = useState(!!daily);

  // Load notifications on component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(getBothNotifications(token));
    }
  }, [dispatch]);

  // Sync UI state with Redux state
  useEffect(() => {
    setWeeklyDigest(!!weekly);
    setDailyDigest(!!daily);
  }, [weekly, daily]);

  const handleSaveNotifications = async () => {
    const timezoneOffset = new Date().getTimezoneOffset();
    const notifications = {
      daily: dailyDigest
        ? {
            time: '09:00',
            timezoneOffset: -timezoneOffset, // Convert to server format
          }
        : null,
      weekly: weeklyDigest
        ? {
            time: '09:00',
            timezoneOffset: -timezoneOffset,
            dayOfWeek: 'MONDAY' as const,
          }
        : null,
    };

    await dispatch(
      createUpdateDeleteNotifications({
        accessToken,
        notifications,
      })
    );
  };
};
```

### Technical Implementation Details

#### Timezone Handling Strategy

**Client-Side Calculation**:

```typescript
// JavaScript getTimezoneOffset() returns minutes behind UTC
// Server expects minutes ahead of UTC, so we negate the value
const timezoneOffset = new Date().getTimezoneOffset();
const serverTimezoneOffset = -timezoneOffset;

// Example: User in EST (UTC-5)
// getTimezoneOffset() returns 300 (5 hours * 60 minutes)
// Server receives -300 (indicating UTC-5)
```

**Benefits**:

- Automatic timezone detection without user input
- Accurate notification delivery regardless of user location
- Handles daylight saving time transitions automatically
- Server can schedule notifications in user's local time

#### State Persistence Strategy

**Redux Persist Integration**:

```typescript
// redux/store.ts
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'user',
    'boards',
    'companies',
    'contacts',
    'jobs',
    'notes',
    'documents',
    'notifications', // Added to persist whitelist
  ],
};
```

**Benefits**:

- Notification preferences persist across browser sessions
- Reduces API calls by caching settings locally
- Provides immediate UI feedback while API calls are in progress
- Maintains user preferences during offline periods

#### Error Handling Architecture

**Comprehensive Error Management**:

```typescript
// Thunk-level error handling
export const createUpdateDeleteNotifications = createAsyncThunk(
  'notifications/createUpdateDeleteNotifications',
  async (values, thunkAPI) => {
    try {
      const response = await client.post(
        '/notifications/report',
        values.notifications,
        {
          headers: { Authorization: `Bearer ${values.accessToken}` },
        }
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating notifications'
      );
    }
  }
);

// UI-level error handling
const handleSaveNotifications = async () => {
  try {
    await dispatch(
      createUpdateDeleteNotifications({ accessToken, notifications })
    ).unwrap();
    toast.success('Notification preferences updated successfully!');
    router.back();
  } catch (error) {
    console.error('Error updating notifications:', error);
    toast.error('Failed to update notification preferences. Please try again.');
  }
};
```

### Default Configuration Strategy

#### User-Friendly Defaults

**Notification Schedule**:

- **Daily Notifications**: 9:00 AM in user's local timezone
- **Weekly Notifications**: Monday at 9:00 AM in user's local timezone
- **Rationale**: Morning delivery ensures users see updates at start of workday

**Implementation**:

```typescript
const notifications = {
  daily: dailyDigest
    ? {
        time: '09:00', // Fixed time for simplicity
        timezoneOffset: -timezoneOffset,
      }
    : null,
  weekly: weeklyDigest
    ? {
        time: '09:00', // Consistent with daily
        timezoneOffset: -timezoneOffset,
        dayOfWeek: 'MONDAY' as const, // Start of work week
      }
    : null,
};
```

### Performance Considerations

#### Optimized State Updates

**Minimal Re-renders**:

- UI state only updates when Redux state changes
- Loading states prevent multiple simultaneous API calls
- Debounced user interactions prevent excessive state updates

**Efficient API Usage**:

- Single API call loads both daily and weekly preferences
- Batch updates send both preferences in single request
- Cached state reduces redundant API calls

### Security Considerations

#### Authentication Integration

**Token-Based Security**:

- All API calls require valid JWT access token
- Token validation handled by existing authentication system
- Automatic token refresh maintains session continuity

**Data Privacy**:

- Notification preferences stored per-user with proper isolation
- No sensitive data exposed in client-side state
- Timezone information calculated client-side (no server tracking)

### Future Enhancement Opportunities

#### Extensible Architecture

**Potential Enhancements**:

1. **Custom Time Selection**: Allow users to choose notification times
2. **Multiple Weekly Days**: Support notifications on multiple days
3. **Notification Types**: Add different digest formats (summary, detailed, etc.)
4. **Frequency Options**: Support bi-weekly, monthly notifications
5. **Content Customization**: Allow users to choose what information to include

**Implementation Readiness**:

- Current architecture supports these enhancements without breaking changes
- TypeScript interfaces can be extended for new notification types
- Redux state structure accommodates additional notification settings
- API endpoint design supports additional parameters

## Board Rename Flow Experiment and Rollback (10/08/2025)

### Context

An experimental refinement of the inline board rename interaction was attempted to: (1) eliminate duplicate network calls, (2) harden against double submissions (Enter + blur), (3) provide Escape cancel restoration, and (4) introduce toast-based user feedback. After manual evaluation the changes were rolled back due to unreliable feedback and inconsistent Escape handling. Stability over micro-optimization was prioritized.

### Experimental Architecture (Rolled Back)

| Concern                        | Experimental Mechanism                                      | Outcome                                                |
| ------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------ |
| Double dispatch (Enter + blur) | `hasConfirmedRef` guard set on first trigger                | Guard worked but added complexity                      |
| Concurrent rename protection   | `isRenamingRef` in-flight flag                              | Effective, but not essential with low latency          |
| Escape restore                 | `originalNameRef` captured initial value                    | Inconsistent restoration observed in manual tests      |
| Network reduction              | Removed trailing `getBoards` after successful `renameBoard` | Reduced requests but surfaced perceived staleness risk |
| User feedback                  | Toast success/error notifications                           | Not reliably visible; removed                          |

### Rollback Implementation

Restored simpler previous logic in `app/(loggedin)/home/boards/page.tsx`:

1. Input blur or Enter → `renameBoard` thunk dispatch
2. On success → explicit `getBoards` fetch (ensures fresh boards state)
3. Escape → revert UI value using current boards slice (existing stable behavior)
4. Removed toast notifications (both success and error) for now

### Current Behavior (Post-Rollback)

- Always performs a follow-up `getBoards` after rename (sacrifices one extra request for deterministic state sync).
- No user-facing toast; failures log to console; name reverts to last confirmed board name.
- Escape key cancels editing and restores original name using slice state.

### Lessons Learned

1. Introduce UX hardening incrementally behind internal flags rather than replacing working flow wholesale.
2. Add lightweight automated tests (JSDOM / RTL) for: Enter rename, blur rename, Escape cancel, unchanged name no-op, failed rename rollback.
3. Optimize network only after test coverage + deterministic UI feedback (e.g., inline status indicator instead of toast).
4. Reintroduce guards only if empirical evidence of double-dispatch issues (analytics / logging) justifies added complexity.

### Forward Plan (Deferred)

- Implement inline status indicator (saving / saved / failed) rather than global toast.
- Add optional optimistic-only mode that skips `getBoards` when payload shape from `renameBoard` is fully trusted.
- Refactor common rename patterns (board title, column title) into a reusable hook with pluggable persistence + rollback logic.

---

## Modal Form State Preservation and Landing Page Enhancement (08/08/2025)

### Critical Modal Form Reset Bug Fix (08/08/2025)

#### Problem Analysis

A critical bug was discovered where the Add Job modal form fields (Company and Job Title) would reset while users were typing. This issue emerged after implementing the dnd-kit drag-and-drop functionality and was caused by a React re-rendering cascade that destroyed form state during user input.

#### Root Cause Investigation

The issue was traced to a shared validation state pattern between parent and child components:

```typescript
// PROBLEMATIC PATTERN: Shared validation state causing re-render cascade
// BoardColumns.tsx (Parent)
const [isFormValid, setIsFormValid] = useState(false);

// AddJobShortForm.tsx (Child)
useEffect(() => {
  const isValid = company.trim() !== '' && jobTitle.trim() !== '';
  onValidationChange(isValid); // Triggers parent re-render
}, [company, jobTitle]);
```

**The Destructive Sequence**:

1. User types in form field
2. Form validation triggers `onValidationChange` callback
3. Parent component (`BoardColumns`) updates `isFormValid` state
4. Parent re-renders due to state change
5. Modal component gets destroyed and recreated
6. Form loses all input values and user sees typing disappear

#### Technical Solution Implementation

##### 1. Self-Validating Modal Pattern

**Before**: Shared validation state

```typescript
// BoardColumns.tsx - REMOVED
const [isFormValid, setIsFormValid] = useState(false);

const handleValidationChange = (isValid: boolean) => {
  setIsFormValid(isValid); // Caused re-render cascade
};
```

**After**: Self-contained validation

```typescript
// AlertDialogModal.tsx - NEW APPROACH
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = () => {
  // Self-validate using localStorage instead of shared state
  const company = localStorage.getItem('company') || '';
  const jobTitle = localStorage.getItem('jobTitle') || '';
  const isValid = company.trim() !== '' && jobTitle.trim() !== '';

  if (!isValid) {
    console.log('❌ Form validation failed - missing required fields');
    return;
  }

  setIsSubmitting(true);
  onSubmit();
  setIsSubmitting(false);
};
```

##### 2. Optional Validation Callback

**Modified Child Component**:

```typescript
// AddJobShortForm.tsx - Made callback optional
interface AddJobShortFormProps {
  onValidationChange?: (isValid: boolean) => void; // Made optional
}

// Conditional validation callback
useEffect(() => {
  const isValid = company.trim() !== '' && jobTitle.trim() !== '';
  onValidationChange?.(isValid); // Only call if provided
}, [company, jobTitle, onValidationChange]);
```

##### 3. Eliminated Shared State

**Simplified Parent Component**:

```typescript
// BoardColumns.tsx - CLEANED UP
// Removed all validation state management
// No more isFormValid state
// No more handleValidationChange function
// Modal now self-manages validation
```

#### Architecture Benefits

1. **Stable Component Tree**: Modal component never gets destroyed during typing
2. **Form State Preservation**: React Hook Form maintains values throughout interaction
3. **No Parent Re-renders**: Validation changes don't trigger parent updates
4. **localStorage Backup**: Form data persists even if component unmounts
5. **Better Performance**: Reduced unnecessary re-render cycles
6. **Cleaner Code**: Separation of concerns between validation and UI state

#### React Architecture Lesson

This fix demonstrates the fundamental React principle: **avoid unnecessary shared state that causes re-render cascades**.

**Anti-Pattern**: Parent manages child validation state

- Child validation → Parent state change → Parent re-render → Child destruction

**Best Practice**: Components self-manage their own state

- Child validation → Local handling → Stable component tree

### Landing Page Enhancement Implementation (08/08/2025)

#### Component Architecture Overview

The landing page was completely redesigned with a modern, professional approach using a component-based architecture:

```text
LandingPage/
├── HeroSection.tsx     - Main banner with CTA
├── ContentSection.tsx  - Features, benefits, how-it-works
├── Footer.tsx         - Navigation and legal links
└── Navbar.tsx         - Header navigation
```

#### Technical Implementation Details (08/08/2025)

##### 1. Hero Section Enhancement

**Modern Design Pattern**:

```typescript
// HeroSection.tsx
export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Transform Your Job Search
          </h1>
          {/* Interactive CTA with smooth navigation */}
        </div>
      </div>
    </section>
  );
}
```

**Key Features**:

- Gradient background with overlay for visual appeal
- Responsive typography (text-5xl to text-7xl)
- Prominent call-to-action buttons
- Mobile-first responsive design

##### 2. Content Sections Architecture

**Modular Section Pattern**:

```typescript
// ContentSection.tsx
const sections = [
  {
    id: 'features',
    title: 'Powerful Features',
    items: [
      {
        icon: '📋',
        title: 'Smart Organization',
        description: 'Kanban-style boards for visual job tracking',
      },
      // ... more features
    ],
  },
  // ... more sections
];
```

**Benefits**:

- Reusable component structure
- Easy content management
- Consistent visual patterns
- SEO-friendly semantic HTML

##### 3. Responsive Design Implementation

**Breakpoint Strategy**:

```css
/* Mobile First Approach */
.hero-title {
  @apply text-4xl; /* Mobile */
  @apply md:text-6xl; /* Tablet */
  @apply lg:text-7xl; /* Desktop */
}

.content-grid {
  @apply grid-cols-1; /* Mobile: Single column */
  @apply md:grid-cols-2; /* Tablet: Two columns */
  @apply lg:grid-cols-3; /* Desktop: Three columns */
}
```

#### Performance Optimizations

1. **Component Splitting**: Logical separation of concerns
2. **CSS Optimization**: Tailwind utility classes for minimal bundle
3. **Image Optimization**: Proper Next.js image handling
4. **SEO Structure**: Semantic HTML with proper heading hierarchy

#### Integration Patterns

**Authentication Flow**:

```typescript
// Navbar.tsx
const authLinks = user ? (
  <Link href="/home" className="btn-primary">
    Dashboard
  </Link>
) : (
  <>
    <Link href="/login" className="btn-secondary">
      Sign In
    </Link>
    <Link href="/signup" className="btn-primary">
      Get Started
    </Link>
  </>
);
```

**Route Management**:

- Seamless integration with Next.js App Router
- Proper TypeScript definitions
- Authentication state awareness

### Files Modified and Architecture Impact

#### Modal Fix Files

1. `components/Forms/AddJobShort/AddJobShortForm.tsx` - Optional validation callback
2. `components/HomePage/Boards/AlertDialogModal.tsx` - Self-validation logic
3. `components/HomePage/Kanban/Column/BoardColumns.tsx` - Removed shared state
4. `utils/helpers.ts` - Form cleanup utilities

#### Landing Page Files

1. `components/LandingPage/HeroSection.tsx` - Modern hero design
2. `components/LandingPage/ContentSection.tsx` - Feature sections
3. `components/LandingPage/Footer.tsx` - Professional footer
4. `components/LandingPage/Navbar.tsx` - Enhanced navigation

#### Impact on System Architecture

- **Improved State Management**: Better separation of concerns
- **Enhanced User Experience**: Stable forms and professional landing
- **Better Maintainability**: Cleaner component relationships
- **Performance Gains**: Reduced unnecessary re-renders

## CodeRabbit Implementation and Critical Bug Fixes (09/08/2025)

### AlertDialogModal Enhancement Architecture (09/08/2025)

#### Toast Notification Integration

**Technical Implementation**:

```typescript
// Enhanced AlertDialogModal.tsx
const AlertDialogModal = ({
  cleanupType = 'none', // New prop for cleanup context
  // ... other props
}) => {
  const handleSubmit = useCallback(async () => {
    try {
      await actionFunction?.();

      // Context-aware toast notifications
      if (cleanupType === 'contact') {
        toast.success('Contact created successfully!');
      } else if (cleanupType === 'jobPost') {
        toast.success('Job archived successfully!');
      }
      // ... more cleanup types
    } catch (error) {
      toast.error('Operation failed. Please try again.');
    }
  }, [actionFunction, cleanupType]);
};
```

**Key Features**:

- Context-aware cleanup with `cleanupType` prop
- Automatic validation reset on modal state changes
- Comprehensive toast feedback system
- Backward compatibility with existing implementations

#### Validation State Management

**Problem**: Form validation state persisting between modal instances

**Solution**: Automatic reset pattern

```typescript
// Reset validation on modal open/close
useEffect(() => {
  if (open) {
    // Reset validation when modal opens
    setValidationError('');
    setFormData(initialState);
  }
}, [open]);
```

### Critical Focus Management Bug Fix (09/08/2025)

#### React 18 Double Rendering Issue

**Problem Analysis**: Users losing focus when editing column names due to React 18's double rendering behavior combined with component lifecycle conflicts.

**Technical Root Cause**:

```typescript
// PROBLEMATIC: Component unmounting before useEffect completes
useEffect(() => {
  if (isEditing) {
    const input = document.getElementById(currentColumnId);
    input?.focus(); // Fails if component unmounts
  }
}, [isEditing, currentColumnId]);
```

**Solution**: Aggressive focus restoration with timeout-based recovery

```typescript
// FIXED: Timeout-based focus restoration
const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (isEditing) {
    // Clear any existing timeout
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }

    // Aggressive focus restoration with 50ms delay
    focusTimeoutRef.current = setTimeout(() => {
      const input = document.getElementById(currentColumnId);
      if (input && currentColumnId === input.id) {
        input.focus();
        input.select();
      }
    }, 50);
  }

  return () => {
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
  };
}, [isEditing, currentColumnId]);
```

**Technical Benefits**:

- Survives React 18 double rendering
- Handles component lifecycle timing issues
- Provides cleanup to prevent memory leaks
- Ensures focus persistence across re-renders

### Email Validation Enhancement (09/08/2025)

#### Visual Feedback System Architecture

**Component Enhancement**:

```typescript
// EmailAndPhone.tsx - Simplified example aligned with production component
interface EmailAndPhoneProps {
  id: string;
  value: string;
  initialType: string;
  contact: 'email' | 'phone';
  hasError?: boolean;
  errorMessage?: string;
  returnData: (contact: 'email' | 'phone', id: string) => void;
  handleChange: (
    id: string,
    value: string,
    type: string,
    options?: { blur?: boolean }
  ) => void;
}

const EmailAndPhone = ({
  id,
  value,
  contact,
  initialType,
  handleChange,
  hasError,
  errorMessage,
}: EmailAndPhoneProps) => {
  const [type, setType] = useState(initialType);
  const [inputValue, setInputValue] = useState(value);

  return (
    <input
      value={inputValue}
      className={cn(
        'w-full',
        hasError && 'border-red-500 focus:border-red-600'
      )}
      onChange={(e) => {
        const next = e.target.value;
        setInputValue(next);
        handleChange(id, next, type);
      }}
      placeholder={contact === 'email' ? 'Email' : 'Phone'}
    />
  );
};
```

**Parent Integration**:

```typescript
// CreateContactForm.tsx - Consuming validation state
const [emailValidationError, setEmailValidationError] = useState(false);

<EmailAndPhone
  hasValidationError={emailValidationError}
  onValidationChange={setEmailValidationError}
/>;
```

### Column Movement Optimization (09/08/2025)

#### Async State Management Pattern

**Problem**: Column movements not showing immediate UI updates

**Solution**: Async/await pattern with optimistic updates

```typescript
// BEFORE: Fire-and-forget pattern
const handleMoveColumn = (direction) => {
  dispatch(moveColumn({ direction, accessToken }));
  // UI doesn't update immediately
};

// AFTER: Async/await with immediate feedback
const handleMoveColumn = async (direction) => {
  try {
    // Show loading state
    setIsMoving(true);

    // Wait for operation to complete
    await dispatch(moveColumn({ direction, accessToken }));

    // Refresh board data
    dispatch(getBoards(accessToken));
  } catch (error) {
    toast.error('Failed to move column');
  } finally {
    setIsMoving(false);
  }
};
```

### Dark Mode Accessibility Fix (09/08/2025)

#### Dropdown Styling Architecture

**Problem**: Hardcoded light colors in dropdown menus causing readability issues in dark mode

```typescript
// BEFORE: Light mode only
className={cn(
  'hover:!bg-slate-200 cursor-pointer',
  selected ? '!bg-slate-200' : '!bg-white'
)}
```

**Solution**: Comprehensive dark mode variants

```typescript
// AFTER: Full dark mode support
className={cn(
  'hover:!bg-slate-200 dark:hover:!bg-slate-600 cursor-pointer',
  selected
    ? '!bg-slate-200 dark:!bg-slate-600'
    : '!bg-white dark:!bg-slate-800'
)}
```

**Technical Benefits**:

- WCAG AA compliance for contrast ratios
- Consistent theming across all interactive elements
- Proper accessibility for users with visual preferences
- Semantic color usage that adapts to system themes

### Utility Function Organization (09/08/2025)

#### Code Architecture Improvement

**Moved `getTimeAgo` utility to proper location**:

```typescript
// utils/helpers.ts - Centralized utility functions
/**
 * Calculate time ago from timestamp
 * @param item - Object with updatedAt or createdAt timestamp
 * @returns Formatted time string like "2 hours ago"
 */
export const getTimeAgo = (item: {
  updatedAt?: string;
  createdAt?: string;
}) => {
  const timestamp = item.updatedAt || item.createdAt;
  if (!timestamp) return 'Recently';

  try {
    const now = Date.now();
    const updatedAt = new Date(timestamp);

    if (isNaN(updatedAt.getTime())) return 'Recently';

    const diffInSeconds = Math.floor((now - updatedAt.getTime()) / 1000);
    // ... time calculation logic
  } catch (error) {
    console.warn('Error parsing timestamp:', error);
    return 'Recently';
  }
};
```

**Benefits**:

- Centralized utility functions for reusability
- Proper TypeScript typing and JSDoc documentation
- Robust error handling with fallbacks
- Consistent code organization patterns

### Performance and Technical Debt Resolution (09/08/2025)

#### Component Lifecycle Management

**Fixed multiple useEffect timing issues**:

- Resolved React 18 double rendering conflicts
- Enhanced component mounting/unmounting lifecycle handling
- Improved state management timing and synchronization
- Eliminated infinite loop patterns in API calls

**Event Handling Optimization**:

- Resolved event bubbling conflicts in editing interfaces
- Enhanced click event handling for better UX
- Fixed pointer-events CSS conflicts during editing states
- Improved overall interaction responsiveness

## Authentication System Improvements and Modal Navigation (02/08/2025)

### Enhanced Token Refresh Flow (02/08/2025)

#### Problem Analysis (02/08/2025)

The authentication system had an overly aggressive token validation approach that interfered with the sophisticated token refresh mechanism, causing unnecessary user logouts when tokens could have been successfully refreshed.

#### Technical Implementation

##### 1. Request Interceptor Optimization

**Before**: Aggressive pre-flight token validation

```typescript
// REMOVED: Overly aggressive validation
client.interceptors.request.use((config) => {
  // Check if we have valid tokens before making any request
  if (!TokenManager.hasValidTokens() && typeof window !== 'undefined') {
    console.log(
      'API Client: No valid tokens found in request interceptor, redirecting to login'
    );
    TokenManager.clearTokens();
    window.location.href = '/login';
    return Promise.reject(new Error('No valid tokens'));
  }
  // ... rest of interceptor
});
```

**After**: Simplified request interceptor focused on header management

```typescript
// CURRENT: Streamlined approach
client.interceptors.request.use((config) => {
  // Add Authorization header if token exists
  const authHeader = TokenManager.getAuthHeader();
  if (authHeader) {
    config.headers.Authorization = authHeader;
  }
  return config;
});
```

##### 2. Response Interceptor Enhancement

**Improved Flow Control**: Enhanced the order of operations in error handling

```typescript
// BEFORE: Token check after retry flag
originalRequest._retry = true;

// Check if we have valid tokens before attempting refresh
if (!TokenManager.hasValidTokens()) {
  // Handle redirect
}

// AFTER: Token check before retry flag
// Check if we have valid tokens before attempting refresh
if (!TokenManager.hasValidTokens()) {
  console.log('API Client: No valid tokens found, redirecting to login');
  TokenManager.clearTokens();
  window.location.href = '/login';
  return Promise.reject(error);
}

originalRequest._retry = true; // Only set if we plan to retry
```

#### Benefits of Enhanced Flow

1. **Sophisticated Refresh Logic**: Allows response interceptor to handle token refresh properly
2. **Reduced Interruptions**: Users experience fewer unnecessary logouts
3. **Better Error Handling**: Proper flow control prevents retry mechanism issues
4. **Maintained Security**: Still redirects to login when refresh fails

### Modal Navigation System Enhancement (02/08/2025)

#### Problem Analysis - (02/08/2025)

The job details modal had inconsistent navigation behavior depending on how the page was accessed:

- **Normal navigation**: Modal close worked correctly using `router.back()`
- **Direct URL access**: Modal close redirected to empty browser tab instead of board view

#### Technical Solution

##### 1. Enhanced Modal Component

**Added Optional onDismiss Prop**:

```typescript
// Enhanced Modal interface
const Modal = ({
  children,
  stylings,
  onDismiss, // New optional prop
}: {
  children: React.ReactNode;
  stylings: string;
  onDismiss?: () => void; // Custom close behavior
}) => {
  const router = useRouter();

  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss(); // Use custom behavior
    } else {
      router.back(); // Fallback to default
    }
  }, [onDismiss, router]);
};
```

##### 2. JobDetailsLayout Integration

**Custom Close Behavior**:

```typescript
// JobDetailsLayout provides proper redirect
const closeModal = () => {
  push(`/home/boards/${board_id}/board`);
};

// Pass to Modal component
<Modal
  stylings="sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-[960px]"
  onDismiss={closeModal}
>
```

#### Navigation Flow Comparison

**Before Enhancement**:

```text
Direct URL Access:
User opens /home/boards/123/job/456/job-details in new tab
→ Click overlay → router.back() → Empty browser tab ❌

Normal Navigation:
User navigates through app → Modal opens
→ Click overlay → router.back() → Previous page ✅
```

**After Enhancement**:

```text
Direct URL Access:
User opens /home/boards/123/job/456/job-details in new tab
→ Click overlay → closeModal() → /home/boards/123/board ✅

Normal Navigation:
User navigates through app → Modal opens
→ Click overlay → closeModal() → /home/boards/123/board ✅
```

#### Code Quality Improvements

##### Removed Redundant Null Check

**Issue**: Unnecessary validation of `useCallback` result

```typescript
// BEFORE: Redundant check
if (handleDismiss) handleDismiss();

// AFTER: Direct call (handleDismiss is always defined)
handleDismiss();
```

**Rationale**: `useCallback` always returns a function, making null checks unnecessary.

### Architecture Benefits (02/08/2025)

#### Authentication System

1. **Layered Security**: Request interceptor handles headers, response interceptor handles authentication errors
2. **Smart Recovery**: Attempts token refresh before giving up
3. **User Experience**: Minimizes authentication interruptions
4. **Maintainable**: Clear separation of concerns between interceptors

#### Modal System

1. **Flexible Design**: Supports both navigation patterns without breaking changes
2. **Backward Compatibility**: Existing modals continue to work unchanged
3. **Consistent UX**: Predictable behavior regardless of access method
4. **Extensible**: Easy to add custom close behaviors to other modals

### Testing Strategy (02/08/2025)

#### Authentication Flow Testing

```typescript
// Test scenarios for token refresh
const authTestScenarios = [
  {
    name: 'Expired access token with valid refresh',
    setup: () => localStorage.setItem('accessToken', 'expired_token'),
    expected: 'Auto refresh and continue',
  },
  {
    name: 'Missing refresh token',
    setup: () => localStorage.removeItem('refreshToken'),
    expected: 'Immediate redirect to login',
  },
  {
    name: 'Both tokens invalid',
    setup: () => localStorage.clear(),
    expected: 'Immediate redirect to login',
  },
];
```

#### Modal Navigation Testing

```typescript
// Test scenarios for modal behavior
const modalTestScenarios = [
  {
    name: 'Direct URL access',
    setup: 'Open job details URL in new tab',
    action: 'Click modal overlay',
    expected: 'Redirect to board view',
  },
  {
    name: 'Normal app navigation',
    setup: 'Navigate to modal through app',
    action: 'Click modal overlay',
    expected: 'Redirect to board view (consistent behavior)',
  },
  {
    name: 'Keyboard navigation',
    setup: 'Any modal access method',
    action: 'Press Escape key',
    expected: 'Same behavior as overlay click',
  },
];
```

## Incremental Job Creation Refactor & UX Hardening (10/08/2025)

### Objectives

1. Introduce in-memory job draft layer (phase-out of localStorage as primary source).
2. Prevent duplicate submissions (double-click / rapid Enter).
3. Fix truncated company name on suggestion select (e.g. `Motoro` vs `Motorola`).
4. Add keyboard navigation to company autocomplete (ArrowUp/Down, Enter, Escape).
5. Maintain backward compatibility (legacy localStorage keys kept temporarily).
6. Keep cross-board redirect consistent (navbar + column modal flows).

### Key Changes

- `AddJobShortForm`: Added `onDraftChange` emitting `{ company, jobTitle, companyId }`; keyboard navigation (`highlightedIndex`); selection race guard (`selectingRef` + `onMouseDown`).
- `CreateMenu` & `BoardColumns`: Added `jobDraftRef` + `isSubmittingJob` guard; prefer draft over localStorage when creating job; dynamic button label ("Saving...").
- Documentation updated (this section).

### Submission Logic (Simplified)

```ts
if (isSubmittingJob) return;
setIsSubmittingJob(true);
const draft = jobDraftRef.current || {};
const jobPost = {
  status: 'Job Created',
  accessToken,
  title: draft.jobTitle || localStorage.getItem('jobTitle'),
  columnId: localStorage.getItem('columnId'),
  companyId: draft.companyId || localStorage.getItem('companyId'),
};
```

### Company Selection Flow

```text
Type -> debounced search -> suggestions
Arrow / Mouse highlight -> Enter / onMouseDown select
Blur suppressed if selectingRef true
```

### Risks Mitigated

- Duplicate submissions
- Partial company name persistence
- Lack of keyboard accessibility
- Blur selection race creating wrong/new company

### Deferred Follow-Ups

| Item                              | Reason                          | Planned Action                        |
| --------------------------------- | ------------------------------- | ------------------------------------- |
| Remove legacy localStorage writes | Reduce persistence surface      | After contact form migration          |
| Consolidate redirect logic        | DRY & maintainability           | Extract util helper                   |
| Atomic company creation gating    | Guarantee companyId before post | Await company promise if missing      |
| Clear transient keys after submit | Privacy / clarity               | Extend `cleanupAfterJobPost`          |
| Add automated tests               | Regression safety               | Unit + integration around create flow |

### Validation Snapshot

| Scenario                         | Result                        |
| -------------------------------- | ----------------------------- |
| Mouse select existing company    | Full name + ID persisted      |
| Keyboard select existing company | Full name + ID persisted      |
| New company immediate submit     | Works (atomic guard optional) |
| Rapid double submit              | Single job created            |
| Board switched pre-submit        | Redirect to chosen board      |

---
