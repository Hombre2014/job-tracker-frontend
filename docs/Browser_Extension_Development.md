## Browser Extension Integration (v1.2.0+, Started 29/01/2026)

### Overview

This section documents the development workflow and architecture for integrating a browser extension with the Job Tracker application. The extension will scrape job details from sites like LinkedIn and Indeed, then pre-fill the Job Tracker's "Add Job" form via URL parameters.

### Git Workflow Strategy

**Long-Lived Integration Branch**: `feat/browser-extension-integration`

This branch serves as the integration point for all extension-related work and will NOT be merged to `dev` until the entire feature is complete and tested.

#### Branching Pattern

```
dev (production)
  └── feat/browser-extension-integration (integration branch)
        ├── feat/extension-scaffold (Phase 2)
        ├── feat/frontend-url-params (Phase 3)
        └── feat/extension-scraping (Phase 4)
```

#### Workflow for Each Feature

1. **Create feature branch** from integration branch:
   ```bash
   git checkout feat/browser-extension-integration
   git checkout -b feat/[feature-name]
   ```

2. **Develop and commit** changes:
   ```bash
   git add .
   git commit -m "feat: description"
   ```

3. **Merge back to integration** when complete:
   ```bash
   git checkout feat/browser-extension-integration
   git merge feat/[feature-name]
   git push origin feat/browser-extension-integration
   ```

4. **Delete feature branch** (optional):
   ```bash
   git branch -d feat/[feature-name]
   ```

5. **Final merge to dev** (only when ALL phases complete):
   ```bash
   git checkout dev
   git pull origin dev
   git merge feat/browser-extension-integration
   git push origin dev  # Triggers Vercel deployment
   ```

### Development Phases

#### ✅ Phase 1: Frontend Testing Infrastructure (COMPLETE)
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

#### 🔄 Phase 2: Extension Scaffold (NEXT)
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

#### 📋 Phase 3: Frontend Integration (URL Parameters)
**Status**: Planned  
**Branch**: Create `feat/frontend-url-params` from `feat/browser-extension-integration`  
**Repository**: `job-tracker-frontend` (this repo)

**Goals**:
1. Modify `AddJobShortForm` to accept URL search parameters
2. Pre-fill form fields when `?company=X&title=Y` params are present
3. Ensure manual entry still works when no params provided
4. Add tests for URL parameter handling

**Key Changes**:
- `components/Forms/AddJobShort/AddJobShortForm.tsx`
- `components/Forms/AddJobShort/__tests__/AddJobShortForm.test.tsx`

**Example URL**: `https://job-tracker.app/home/boards/123?company=Google&title=Software+Engineer`

**Verification**: 
- Manual test: Open URL with params, verify form pre-fills
- Automated test: Mock `useSearchParams`, assert form state

#### 🔍 Phase 4: Extension Logic (Scraping)
**Status**: Planned  
**Branch**: Create `feat/extension-scraping` from `feat/browser-extension-integration`  
**Repository**: `job-tracker-extension`

**Goals**:
1. Implement content scripts for LinkedIn/Indeed job pages
2. Extract company name, job title, location, salary, etc.
3. Build popup UI to display scraped data
4. Implement "Open in Job Tracker" button with URL construction

**Key Files**:
- `content-scripts/linkedin.ts`
- `content-scripts/indeed.ts`
- `popup/Popup.tsx`
- `utils/urlBuilder.ts`

**Verification**: 
- Visit LinkedIn job posting
- Click extension icon
- See scraped data in popup
- Click "Open in Job Tracker"
- Verify Job Tracker opens with pre-filled form

### Repository Structure

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

### Next Steps (Immediate)

**Answer to User Questions**:

1. **Should we start with new repo for extension?**  
   ✅ **YES** - Phase 2 requires creating `job-tracker-extension` repository

2. **Or create something in frontend first?**  
   ❌ **NO** - Frontend changes come in Phase 3 (URL params)

3. **Should we use a new branch?**  
   ✅ **YES** - Create `feat/extension-scaffold` from current integration branch

4. **What's the next step?**  
   👉 **Create the extension repository and scaffold** (Phase 2)

### Execution Order

```
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

### Testing Strategy

- **Frontend**: All changes must have corresponding Vitest tests
- **Extension**: Manual testing in browser (automated testing optional)
- **Integration**: End-to-end test of extension → frontend flow
- **Deployment**: Only merge to `dev` when all phases complete

### References

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Vite Plugin for Extensions](https://github.com/crxjs/chrome-extension-tools)
- [Next.js URL Parameters](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
