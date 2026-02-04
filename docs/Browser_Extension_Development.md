# Browser Extension Integration (v1.2.0+, Started 29/01/2026)

## Legal & Compliance Status

✅ **Legal Documents Updated**: Privacy Policy and Terms of Service have been updated (February 2, 2026) to include comprehensive browser extension disclaimers.

### Approach: Client-Side Scraping (User-Initiated)

**This extension follows the proven model of Huntr.co and Careerflow.ai:**

- ✅ **Client-side scraping** - Data extraction happens in the user's browser
- ✅ **User-initiated** - Extension only activates when user clicks it
- ✅ **Personal use** - For individual job tracking, not commercial data collection
- ✅ **No server storage** - Data passed via URL parameters only (ephemeral)
- ✅ **User responsibility** - Clear disclaimers transfer liability to users
- ✅ **Legal protection** - Updated Privacy Policy and Terms of Service

### Key Legal Protections in Place

**Privacy Policy** (`app/(legal)/privacy/page.tsx`):

- Browser Extension section added
- Data collection disclosure
- No persistent storage clause
- Third-party website disclaimer
- User responsibility statement

**Terms of Service** (`app/(legal)/terms/page.tsx`):

- Browser Extension section added
- User responsibility for third-party ToS compliance
- Limitation of liability
- No warranty clause
- Indemnification protection

### Important Notes

**For Users**:

- Extension is for personal job tracking only
- Users must comply with third-party site Terms of Service
- JobsTracker is not liable for any consequences on third-party platforms

**For Developers**:

- Always user-initiated (no background/automatic scraping)
- Implement graceful degradation (fallback to manual input)
- Allow users to review/edit scraped data before sending
- Follow URL parameter validation and sanitization requirements (see Phase 3)

## Overview

This section documents the development workflow and architecture for integrating a browser extension with the Job Tracker application. The extension will either:

- **Option A (Recommended)**: Accept manual input from users and pre-fill the Job Tracker's "Add Job" form via URL parameters
- **Option B (High Risk)**: Scrape job details from sites like LinkedIn and Indeed (requires legal review)

## Repository Coordination Strategy

### Version Compatibility

**Maintaining compatibility between two repositories:**

- **Extension Repository**: `job-tracker-extension`
- **Frontend Repository**: `job-tracker-frontend`

### URL Parameter Contract

**This contract MUST be documented in BOTH repositories:**

```text
Required Parameters:
- company: string (company name)
- title: string (job title)

Optional Parameters:
- location: string (job location)
- salary: string (salary range)
- url: string (original job posting URL)
- source: string (linkedin|indeed|manual)

Format: /home/boards/{board_id}?company=X&title=Y&location=Z...
```

### Compatibility Matrix

**Track which extension versions work with which frontend versions:**

| Extension Version | Frontend Version | URL Contract Version | Status  |
| ----------------- | ---------------- | -------------------- | ------- |
| 1.0.0             | 1.2.0+           | v1                   | Planned |

### Development Testing Strategy

**Testing integration between repositories during development:**

1. **Local Frontend**: Run `npm run dev` (http://localhost:3000)
2. **Local Extension**: Load unpacked extension from `job-tracker-extension/dist`
3. **Test Flow**:
   - Visit job posting
   - Click extension
   - Verify data capture/input
   - Click "Open in Job Tracker"
   - Verify localhost opens with correct params
   - Verify form pre-fills correctly

### Breaking Changes Protocol

**If URL parameter format changes:**

1. Document change in CHANGELOG of both repos
2. Bump major version of extension (e.g., 1.0.0 → 2.0.0)
3. Update compatibility matrix
4. Provide migration guide for users
5. Consider backwards compatibility period

## Git Workflow Strategy

**Long-Lived Integration Branch**: `feat/browser-extension-integration`

This branch serves as the integration point for all extension-related work and will NOT be merged to `dev` until the entire feature is complete and tested.

### Branching Pattern

```text
dev (production)
  └── feat/browser-extension-integration (integration branch)
        ├── feat/extension-scaffold (Phase 2)
        ├── feat/frontend-url-params (Phase 3)
        └── feat/extension-scraping (Phase 4)
```

### Workflow for Each Feature

```bash
git checkout feat/browser-extension-integration
git checkout -b feat/[feature-name]
```

1. **Develop and commit** changes:

   ```bash
   git add .
   git commit -m "feat: description"
   ```

2. **Merge back to integration** when complete:

   ```bash
   git checkout feat/browser-extension-integration
   git merge feat/[feature-name]
   git push origin feat/browser-extension-integration
   ```

3. **Delete feature branch** (optional):

   ```bash
   git branch -d feat/[feature-name]
   ```

4. **Final merge to dev** (only when ALL phases complete):

   ```bash
   git checkout dev
   git pull origin dev
   git merge feat/browser-extension-integration
   git push origin dev  # Triggers Vercel deployment
   ```

## Development Phases

### ✅ Phase 1: Frontend Testing Infrastructure (COMPLETE)

**Status**: Completed 29/01/2026  
**Branch**: `feat/browser-extension-integration` (formerly `feat/add-testing-libraries`)

**Achievements**:

- Implemented 24 unit and integration tests across 5 components
- Test coverage for job creation, editing, company autocomplete, and navigation
- All tests passing with Vitest and React Testing Library

**Components Tested**:

- `CompanyAutocomplete` (6 tests)
- `JobPostCard` (5 tests)
- `JobInfo` (8 tests)
- `AddJobShortForm` (3 tests)
- `CreateMenu` (2 tests)

### 🔄 Phase 2: Extension Scaffold (NEXT)

**Status**: Planned  
**Branch**: Create `feat/extension-scaffold` from `feat/browser-extension-integration`  
**Repository**: Create NEW repository `job-tracker-extension`

**Goals**:

1. Create separate repository for the browser extension
2. Initialize Manifest V3 structure
3. Set up React/Vite build process for extension popup
4. Verify extension loads in browser (Hello World)

**Key Files**:

- `manifest.json` (Manifest V3)
- `popup.html` / `popup.tsx` (Extension UI)
- `vite.config.ts` (Build configuration)
- `package.json` (Dependencies)

**Verification**: Load unpacked extension in Chrome/Edge and see popup

### 📋 Phase 3: Frontend Integration (URL Parameters)

**Status**: Planned  
**Branch**: Create `feat/frontend-url-params` from `feat/browser-extension-integration`  
**Repository**: `job-tracker-frontend` (this repo)

**Goals**:

1. Modify `AddJobShortForm` to accept URL search parameters
2. Pre-fill form fields when `?company=X&title=Y` params are present
3. Ensure manual entry still works when no params provided
4. Add tests for URL parameter handling
5. **Validate and sanitize all URL parameters before use** (XSS prevention)
6. **Handle URL length limits** (truncate or omit optional fields)
7. **Document character encoding requirements** for extension

**Key Changes**:

- `components/Forms/AddJobShort/AddJobShortForm.tsx`
- `components/Forms/AddJobShort/__tests__/AddJobShortForm.test.tsx`
- `utils/urlParameterValidation.ts` (new file for sanitization)

**Example URL**:

```text
https://job-tracker.app/home/boards/123?company=Google&title=Software+Engineer&location=Mountain+View
```

**URL Parameter Technical Constraints**:

#### **URL Length Limits**

- **Maximum Safe Length**: 2000 characters (IE/Edge legacy)
- **Modern Browsers**: Support up to 8000+ chars but 2000 is safest
- **Strategy**:
  - Required fields: `company`, `title` (always include)
  - Optional fields: `location`, `salary`, `url`, `source` (include if space permits)
  - If URL exceeds 2000 chars, truncate in this order:
    1. Remove `source` parameter
    2. Truncate `url` parameter (job posting URL)
    3. Truncate `location` if needed
    4. Truncate `salary` if needed
    5. Keep `company` and `title` (never truncate)

#### **Character Encoding Requirements**

**Extension MUST use `URLSearchParams` constructor (automatic encoding):**

```javascript
// ✅ CORRECT - Extension code (recommended)
const params = new URLSearchParams({
  company: companyName, // URLSearchParams handles encoding automatically
  title: jobTitle,
  location: location,
  salary: salaryRange,
  url: jobPostingUrl,
});
const fullUrl = `https://job-tracker.app/home/boards/${boardId}?${params.toString()}`;
```

**Alternative: Manual URL building with `encodeURIComponent()`:**

```javascript
// ✅ ALSO CORRECT - Manual URL building
const fullUrl = `https://job-tracker.app/home/boards/${boardId}?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}`;
```

**⚠️ CRITICAL: Do NOT double-encode:**

```javascript
// ❌ WRONG - Double encoding (space becomes %2520 instead of %20)
const params = new URLSearchParams({
  company: encodeURIComponent(companyName), // URLSearchParams will encode again!
});
```

**Special Characters Handled Automatically by `URLSearchParams`**:

- Spaces: `encodeURIComponent` converts to `%20` (not `+`)
- Ampersands `&`: Must be encoded (otherwise breaks parameters)
- Equals `=`: Must be encoded in values
- Hash `#`: Must be encoded (otherwise treated as URL fragment)
- Non-ASCII characters: Properly UTF-8 encoded
- Quotes `"` and `'`: Encoded to prevent injection

**Frontend reads already-decoded values:**

```javascript
// ✅ CORRECT - Frontend code
const searchParams = useSearchParams();
const company = searchParams.get('company') || ''; // Already decoded by URLSearchParams
const title = searchParams.get('title') || ''; // Already decoded by URLSearchParams
```

**Note**: `URLSearchParams.get()` automatically decodes values, so `decodeURIComponent()` is not needed and would be redundant.

#### **Input Validation & Sanitization (XSS Prevention)**

**Frontend MUST sanitize ALL URL parameters before using them:**

**Validation Rules**:

1. **Maximum Length Validation**:
   - `company`: 200 chars max
   - `title`: 300 chars max
   - `location`: 150 chars max
   - `salary`: 100 chars max
   - `url`: 2000 chars max

2. **HTML Tag Removal** (prevent XSS):

   ```javascript
   const sanitizeInput = (input: string): string => {
     // Remove HTML tags
     return input.replace(/<[^>]*>/g, '');
   };
   ```

3. **Script Tag Detection** (additional XSS protection):

   ```javascript
   const containsScript = (input: string): boolean => {
     return /<script|javascript:|onerror=|onclick=/i.test(input);
   };
   ```

4. **URL Validation** (for `url` parameter):

   ```javascript
   const isValidUrl = (urlString: string): boolean => {
     try {
       const url = new URL(urlString);
       return url.protocol === 'http:' || url.protocol === 'https:';
     } catch {
       return false;
     }
   };
   ```

**Implementation in `AddJobShortForm.tsx`**:

```typescript
// Example sanitization before setting form values
useEffect(() => {
  const company = searchParams.get('company'); // Already decoded
  const title = searchParams.get('title'); // Already decoded
  let hasInvalidInput = false;

  if (company) {
    // 1. Check for malicious content FIRST (before sanitization)
    if (containsScript(company)) {
      console.warn('Suspicious input detected in company parameter');
      hasInvalidInput = true;
      // Don't set company, but continue processing other params
    } else {
      // 2. Then sanitize and truncate
      const sanitized = sanitizeInput(company).slice(0, 200);
      setValue('company', sanitized);
    }
  }

  if (title) {
    // 1. Check for malicious content FIRST (before sanitization)
    if (containsScript(title)) {
      console.warn('Suspicious input detected in title parameter');
      hasInvalidInput = true;
      // Don't set title, but continue processing other params
    } else {
      // 2. Then sanitize and truncate
      const sanitized = sanitizeInput(title).slice(0, 300);
      setValue('title', sanitized);
    }
  }

  // Show error toast once if any parameter was rejected
  if (hasInvalidInput) {
    toast.error(
      'Some invalid input was detected and skipped. Please review the form.',
    );
  }
}, [searchParams]);
```

**Alternative: Use DOMPurify (Recommended for Production)**:

```typescript
import DOMPurify from 'dompurify';

useEffect(() => {
  const company = searchParams.get('company');

  if (company) {
    // DOMPurify provides battle-tested XSS protection
    const sanitized = DOMPurify.sanitize(company, {
      ALLOWED_TAGS: [], // Strip all HTML tags
      KEEP_CONTENT: true,
    }).slice(0, 200);

    setValue('company', sanitized);
  }
}, [searchParams]);
```

**Security Testing Requirements**:

Test with malicious inputs:

- `?company=<script>alert('XSS')</script>`
- `?title=Test"><img src=x onerror=alert(1)>`
- `?url=javascript:alert(1)`
- `?company=${'A'.repeat(10000)}` (excessive length)

**Verification**:

- Manual test: Open URL with params, verify form pre-fills
- Automated test: Mock `useSearchParams`, assert form state
- Security test: Verify XSS prevention with malicious inputs
- Length test: Verify truncation with long URLs
- Encoding test: Verify special characters display correctly

### 🔍 Phase 4: Extension Logic (Data Input/Scraping)

⚠️ READ LEGAL SECTION FIRST - DECISION REQUIRED

**Status**: Planned  
**Branch**: Create `feat/extension-data-input` from `feat/browser-extension-integration`  
**Repository**: `job-tracker-extension`

**⚠️ Choose Implementation Approach:**

#### **Option A: Manual Input (Recommended - No Legal Risk)**

**Goals**:

1. Build popup UI with input fields for job data
2. User manually copies/pastes from job posting
3. Implement "Open in Job Tracker" button with URL construction
4. No automated scraping = no legal issues

**Key Files**:

- `popup/ManualInputForm.tsx` (form with input fields)
- `popup/Popup.tsx` (main popup component)
- `utils/urlBuilder.ts` (URL parameter construction)

**User Flow**:

1. Visit LinkedIn/Indeed job posting
2. Click extension icon → popup opens
3. User manually pastes job details into form fields
4. Click "Open in Job Tracker"
5. Job Tracker opens with pre-filled form

#### **Option B: Automated Scraping (High Risk - Legal Review Required)**

**⛔ STOP: Complete ALL legal requirements before implementing:**

- ✅ Update Privacy Policy (see Legal Document Updates section)
- ✅ Update Terms of Service (see Legal Document Updates section)
- ✅ Implement consent dialog on extension install
- ✅ Add user warnings about ToS violations
- ✅ Consult with legal counsel

**Goals**:

1. Implement content scripts for LinkedIn/Indeed job pages
2. Extract company name, job title, location, salary, etc.
3. Build popup UI to display scraped data
4. Implement rate limiting and error handling
5. Implement "Open in Job Tracker" button with URL construction

**Key Files**:

- `content-scripts/linkedin.ts` (LinkedIn-specific selectors)
- `content-scripts/indeed.ts` (Indeed-specific selectors)
- `popup/Popup.tsx` (display scraped data)
- `utils/urlBuilder.ts` (URL parameter construction)
- `utils/rateLimiter.ts` (prevent aggressive scraping)

**Technical Safeguards Required**:

- Rate limiting (max 1 scrape per 5 seconds)
- Error handling for blocked/failed scrapes
- Graceful degradation to manual input
- User can edit scraped data before sending
- No batch/automated scraping

**Maintenance Burden**:

- Selectors break when sites update HTML
- Quarterly maintenance required to update selectors
- Document all CSS selectors used
- Provide fallback to manual input

**Verification**:

- Visit LinkedIn job posting
- Click extension icon
- See scraped data in popup (or manual input on failure)
- User can edit data
- Click "Open in Job Tracker"
- Verify Job Tracker opens with pre-filled form

## Repository Structure

**Two Repositories**:

1. **job-tracker-frontend** (existing)
   - Main Next.js application
   - URL parameter handling (Phase 3)
   - Branch: `feat/browser-extension-integration`

2. **job-tracker-extension** (new)
   - Browser extension project
   - Manifest V3, content scripts, popup
   - Phases 2 & 4
   - Separate Git repository

## Next Steps (Immediate)

**Answer to User Questions**:

1. **Should we start with new repo for extension?**  
   ✅ **YES** - Phase 2 requires creating `job-tracker-extension` repository

2. **Or create something in frontend first?**  
   ❌ **NO** - Frontend changes come in Phase 3 (URL params)

3. **Should we use a new branch?**  
   ✅ **YES** - Create `feat/extension-scaffold` from current integration branch

4. **What's the next step?**  
   👉 **Create the extension repository and scaffold** (Phase 2)

## Execution Order

```text
Phase 1 ✅ DONE: Testing (feat/browser-extension-integration)
  └── 24 tests passing

Phase 2 🔄 NEXT: Extension Scaffold (NEW REPO: job-tracker-extension)
  ├── Step 1: Create new repository
  ├── Step 2: Initialize Manifest V3
  ├── Step 3: Set up React/Vite
  └── Step 4: Load extension in browser

Phase 3 📋 LATER: Frontend URL Params (feat/frontend-url-params)
  ├── Step 1: Modify AddJobShortForm
  ├── Step 2: Add URL parameter parsing
  └── Step 3: Write tests

Phase 4 🔍 FINAL: Extension Scraping (job-tracker-extension)
  ├── Step 1: Content scripts
  ├── Step 2: Popup UI
  └── Step 3: URL construction

DEPLOY 🚀: Merge feat/browser-extension-integration → dev
```

## Testing Strategy

- **Frontend**: All changes must have corresponding Vitest tests
- **Extension**: Manual testing in browser (automated testing optional)
- **Integration**: End-to-end test of extension → frontend flow
- **Deployment**: Only merge to `dev` when all phases complete

## Legal Document Updates (Completed ✅)

### Privacy Policy Updates

**File**: `app/(legal)/privacy/page.tsx`  
**Status**: ✅ **COMPLETED**  
**Last Updated**: February 2, 2026

**Changes Made**:

Added comprehensive "Browser Extension" section including:

```text
Browser Extension (Optional Feature)

JobsTracker offers an optional browser extension that helps you quickly add job postings to your tracker. When you use the extension:

Data Collection: The extension may collect job-related information (company name, job title, location, salary) from web pages you visit when you explicitly activate the extension.

Data Transmission: Collected data is transmitted directly to the JobsTracker web application via URL parameters and is NOT stored on any server.

No Persistent Storage: We do not store any data scraped by the browser extension. All data transmission is ephemeral and only used to pre-fill forms in the JobsTracker application.

User Control: You have complete control over what data is sent and when. The extension only activates when you click it.

Third-Party Sites: The extension may operate on third-party websites (LinkedIn, Indeed, etc.). Use of the extension on these sites is at your own risk and subject to those sites' Terms of Service. JobsTracker is not responsible for any violations of third-party Terms of Service.

Your Responsibility: You are solely responsible for ensuring your use of the browser extension complies with the Terms of Service of any third-party websites you visit.
```

### Terms of Service Updates

**File**: `app/(legal)/terms/page.tsx`  
**Status**: ✅ **COMPLETED**  
**Last Updated**: February 2, 2026

**Changes Made**:

Added comprehensive "Browser Extension" section including:

```text
Browser Extension (Optional Feature)

Availability: JobsTracker may offer an optional browser extension to enhance your experience. Use of the extension is entirely optional.

User Responsibility: You are solely responsible for your use of the browser extension, including:
  - Compliance with third-party website Terms of Service (LinkedIn, Indeed, etc.)
  - Any consequences resulting from data collection from third-party sites
  - Account restrictions or bans imposed by third-party services

No Warranty: The browser extension is provided "AS IS" without warranty of any kind. We do not guarantee:
  - Compatibility with all websites
  - Continuous functionality
  - Freedom from errors or interruptions

Limitation of Liability: JobsTracker shall not be liable for:
  - Violations of third-party Terms of Service resulting from extension use
  - Account bans or restrictions on third-party platforms
  - Inaccurate or incomplete data collection
  - Any direct, indirect, or consequential damages from extension use

Third-Party Terms: Your use of the extension on third-party websites (LinkedIn, Indeed, etc.) is subject to those platforms' Terms of Service. We strongly advise you to review and comply with their terms.

Revocation: We reserve the right to discontinue the browser extension at any time without notice.
```

### Extension Install Consent Dialog

**Must be shown on first run:**

```text
⚠️ IMPORTANT: Use at Your Own Risk

This extension collects job posting information from websites you visit to help you quickly add jobs to your tracker.

Please be aware:
✓ You are responsible for complying with website Terms of Service
✓ Some sites (LinkedIn, Indeed) prohibit automated data collection
✓ Your account on those sites may be restricted if you violate their terms
✓ JobsTracker is not responsible for any consequences
✓ No data is stored on our servers - only passed via URL

By clicking "I Understand", you acknowledge these risks and agree to use the extension responsibly.

[Cancel] [I Understand and Accept]
```

### Implementation Status

✅ **Privacy Policy**: Updated February 2, 2026  
✅ **Terms of Service**: Updated February 2, 2026  
⏳ **Extension Consent Dialog**: To be implemented in Phase 2/4 extension code

**Next Steps for Production**:

- Notify existing users of Privacy Policy / Terms updates via email
- Consider requiring users to re-accept updated terms (optional but recommended)
- Implement consent dialog in browser extension on first run

## References

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Vite Plugin for Extensions](https://github.com/crxjs/chrome-extension-tools)
- [Next.js URL Parameters](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- [LinkedIn Terms of Service](https://www.linkedin.com/legal/user-agreement)
- [Indeed Terms of Service](https://www.indeed.com/legal)
- [GDPR Compliance Guide](https://gdpr.eu/what-is-gdpr/)
- [CCPA Compliance Guide](https://oag.ca.gov/privacy/ccpa)
