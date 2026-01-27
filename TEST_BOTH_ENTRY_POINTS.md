# Test Both Job Creation Entry Points

## Important: There are TWO ways to create jobs!

### Entry Point 1: "+ Create" Menu (Navbar)
**Location:** Top navbar → "+ Create" button → "Job"
**File:** `CreateMenu.tsx`
**Status:** ✅ Fixed

### Entry Point 2: "+" Button in Columns
**Location:** Inside each board column → "+" button
**File:** `BoardColumns.tsx`
**Status:** ✅ Fixed

---

## Test Entry Point 1: "+ Create" Menu

### Steps:
1. Start app: `npm run dev`
2. Click **"+ Create"** in top navbar
3. Click **"Job"**
4. Type "TestCompany1" (don't select from dropdown)
5. Type job title "Test Engineer 1"
6. Click "Save Job"

### Expected:
- ✅ Job created successfully
- ✅ Company "TestCompany1" created
- ✅ Redirects to job details
- ✅ No 400 error

---

## Test Entry Point 2: Column "+" Button

### Steps:
1. Go to any board
2. Find the **"+" button** inside a column (e.g., "Wishlist" column)
3. Click the **"+"** button
4. Type "TestCompany2" (don't select from dropdown)
5. Type job title "Test Engineer 2"
6. Click "Save Job"

### Expected:
- ✅ Job created successfully
- ✅ Company "TestCompany2" created
- ✅ Redirects to job details
- ✅ No 400 error

---

## Quick Verification

Run both tests above. If both work:
- ✅ Fix is complete
- ✅ Both entry points handle typed company names

If either fails:
- ❌ Check console for errors
- ❌ Check which entry point failed
- ❌ Report the specific location

---

## Why Two Entry Points?

The app has two different UI locations for creating jobs:
1. **Global menu** - accessible from anywhere (CreateMenu.tsx)
2. **Column buttons** - quick add within specific columns (BoardColumns.tsx)

Both needed the same fix!
