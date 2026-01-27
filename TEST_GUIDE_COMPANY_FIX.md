# Test Guide: Company Creation Fix

## What Was Fixed
When creating a job application, if the user types a company name without selecting from the autocomplete dropdown, the system now automatically creates that company before creating the job application.

## Changes Made

### 1. CreateMenu.tsx
- Made `createJobApplication()` async
- Added logic to check if `companyId` is missing but company name exists
- Automatically creates company with the typed name before creating job application
- Uses default/generic logo (backend handles this)

### 2. AddJobShortForm.tsx
- Clears `companyId` when user manually types (not selects from dropdown)
- Ensures localStorage is cleaned up properly
- Properly tracks company name in draft state

## Test Scenarios

### ✅ Test 1: Type Company Name WITHOUT Selecting (NEW FIX)
**Steps:**
1. Start app: `npm run dev`
2. Click "+ Create" → "Job"
3. Type a company name (e.g., "NewTech Corp") in Company field
4. **DO NOT select from dropdown** - just type and move on
5. Enter Job Title (e.g., "Software Engineer")
6. Select Board and List
7. Click "Save Job"

**Expected Result:**
- ✅ Job application is created successfully
- ✅ Company "NewTech Corp" is created in database
- ✅ Company has default/generic logo
- ✅ Redirects to job details page
- ✅ No errors in console

**Previous Behavior (Bug):**
- ❌ Job creation failed
- ❌ Error: missing companyId

---

### ✅ Test 2: Select Company FROM Dropdown (Existing Flow)
**Steps:**
1. Click "+ Create" → "Job"
2. Type a company name (e.g., "Google")
3. **SELECT from the dropdown** when suggestions appear
4. Enter Job Title
5. Click "Save Job"

**Expected Result:**
- ✅ Job application is created successfully
- ✅ Company is created with logo from API
- ✅ Redirects to job details page
- ✅ No duplicate companies created

---

### ✅ Test 3: Type, Then Select Different Company
**Steps:**
1. Click "+ Create" → "Job"
2. Type "Micro" in Company field
3. See "Microsoft" in dropdown
4. Select "Microsoft" from dropdown
5. Enter Job Title
6. Click "Save Job"

**Expected Result:**
- ✅ Job uses "Microsoft" (the selected company)
- ✅ NOT "Micro" (the typed text)
- ✅ Company has proper logo from API

---

### ✅ Test 4: Type, Select, Then Edit Again
**Steps:**
1. Click "+ Create" → "Job"
2. Type and select "Google" from dropdown
3. Clear the field and type "Amazon" (don't select)
4. Enter Job Title
5. Click "Save Job"

**Expected Result:**
- ✅ Job uses "Amazon" (the final typed text)
- ✅ New company "Amazon" is created
- ✅ Previous "Google" selection is ignored

---

### ✅ Test 5: Empty Company Name
**Steps:**
1. Click "+ Create" → "Job"
2. Leave Company field empty
3. Enter Job Title
4. Try to click "Save Job"

**Expected Result:**
- ✅ "Save Job" button should be disabled (form validation)
- ✅ OR shows validation error
- ✅ Job is NOT created

---

### ✅ Test 6: Special Characters in Company Name
**Steps:**
1. Click "+ Create" → "Job"
2. Type "Tech & Co." in Company field (don't select)
3. Enter Job Title
4. Click "Save Job"

**Expected Result:**
- ✅ Job is created successfully
- ✅ Company name "Tech & Co." is preserved correctly
- ✅ No encoding issues

---

## Verification Checklist

After running tests, verify:

### Database Check
- [ ] New companies appear in companies table
- [ ] Companies have proper names
- [ ] Companies have default logo URL (or null)
- [ ] No duplicate companies created

### UI Check
- [ ] Job details page shows correct company name
- [ ] Company logo displays (default if typed, API logo if selected)
- [ ] No console errors
- [ ] Redux state is clean (check Redux DevTools)

### Edge Cases
- [ ] Multiple jobs with same typed company name reuse the company
- [ ] Typing same name as existing company doesn't create duplicate
- [ ] Fast typing doesn't cause race conditions
- [ ] Modal close/reopen doesn't cause stale state

---

## How to Debug Issues

### Check Console
```javascript
// Look for these logs:
"Error creating company:" // Should NOT appear
"Error creating/assigning contact:" // Should NOT appear
```

### Check Redux DevTools
1. Open Redux DevTools
2. Watch for actions:
   - `companies/createNewCompany/pending`
   - `companies/createNewCompany/fulfilled`
   - `jobs/createJobPost/pending`
   - `jobs/createJobPost/fulfilled`

### Check Network Tab
1. Open Browser DevTools → Network
2. Look for:
   - `POST /companies` (should succeed with 201)
   - `POST /jobs` or similar (should succeed)

### Check localStorage
```javascript
// In browser console:
localStorage.getItem('company')
localStorage.getItem('companyId')
localStorage.getItem('jobTitle')
```

---

## Rollback Plan

If issues occur, revert these files:
1. `components/HomePage/HomeNavbar/CreateMenu.tsx`
2. `components/Forms/AddJobShort/AddJobShortForm.tsx`

```bash
git checkout HEAD -- components/HomePage/HomeNavbar/CreateMenu.tsx
git checkout HEAD -- components/Forms/AddJobShort/AddJobShortForm.tsx
```

---

## Success Criteria

✅ All 6 test scenarios pass
✅ No console errors
✅ No duplicate companies created
✅ Job applications always have valid companyId
✅ User can create jobs by typing OR selecting company names
