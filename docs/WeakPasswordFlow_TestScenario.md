# Weak Password Flow - Test Scenario

## Test Scenario: Complete Weak Password Reset Flow

### Prerequisites

- Backend server running
- Frontend running: `npm run dev`
- Test user with weak password in database:
  - Email: `weak@test.com`
  - Password: `password` (weak - no uppercase, no numbers)

---

## Test Steps

### Step 1: Login with Weak Password

**Action:**

1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `weak@test.com`
   - Password: `password`
3. Click "Log in"

**Expected Result:**

- ✅ Login succeeds (backend authenticates)
- ✅ Success message briefly appears: "Logged in successfully"
- ✅ Modal pops up with title: "🔒 Password Security Update Required"
- ✅ Modal contains:
  - Yellow box with security requirements (8 chars, 1 uppercase, 1 lowercase, 1 number)
  - Blue box with step-by-step instructions
  - Email shown in instructions
  - Button: "Reset My Password"
- ✅ Modal cannot be closed (no X button, no backdrop click)

**Screenshot Checkpoint 1:** Modal appearance

---

### Step 2: Click "Reset My Password"

**Action:**

1. Click the "Reset My Password" button in the modal

**Expected Result:**

- ✅ Modal closes
- ✅ Redirected to: `/forgot-password?email=weak@test.com&reason=weak`
- ✅ Local storage cleared (check DevTools → Application → Local Storage):
  - `accessToken` removed
  - `refreshToken` removed
  - `user` removed

---

### Step 3: Verify Forgot Password Page (Step 1 - Email)

**Action:**

1. Verify the page content after redirect

**Expected Result:**

- ✅ URL: `/forgot-password?email=weak@test.com&reason=weak`
- ✅ Title: "🔒 Strengthen Your Password" (NOT "Forgot Password")
- ✅ Yellow banner visible with:
  - **"Security Update Required"** (no weird unicode characters like `\u26a0\ufe0f`)
  - Clear message about password security standards
- ✅ Subtitle: "We'll send a verification code to your email"
- ✅ Email field pre-filled with: `weak@test.com`
- ✅ Button: "Send Password Reset Code"
- ✅ **NO success message visible** (green badge should not appear yet)
- ✅ **NO weird unicode text** anywhere on the page

**Screenshot Checkpoint 2:** Page with conditional title and banner

---

### Step 4: Send Verification Code

**Action:**

1. Verify email is pre-filled: `weak@test.com`
2. Click "Send Password Reset Code"

**Expected Result:**

- ✅ Request sent to: `POST /users/reset-password/create-verification-code`
- ✅ Page switches to show the reset password form
- ✅ Check email inbox for 6-digit verification code
- ✅ **Still NO success message** (password not reset yet)

---

### Step 5: Verify Reset Password Form (Step 2)

**Action:**

1. Verify the form fields

**Expected Result:**

- ✅ Form has 3 fields:
  1. **Reset Password Code**
     - Empty input field
     - Placeholder: "Enter the reset code here"
     - **NOT pre-filled with email**
     - Has question mark tooltip
     - Max length: 6 characters
  2. **New Password**
     - Empty password input
     - Placeholder: "Enter your new password"
  3. **Repeat New Password**
     - Empty password input
     - Placeholder: "Re-enter your new password"
- ✅ Help text visible: "\*At least: 8 characters, 1 number, 1 upper, 1 lower."
- ✅ Button: "Reset Password"
- ✅ **NO success message visible** (still hasn't reset)
- ✅ Yellow security banner still visible at top

**Screenshot Checkpoint 3:** Reset form with 3 fields

---

### Step 6: Test Password Mismatch Validation

**Action:**

1. Get the 6-digit code from email (e.g., `123456`)
2. Enter in form:
   - Reset Password Code: `123456`
   - New Password: `Password123`
   - Repeat New Password: `Password456` (different!)
3. Click "Reset Password"

**Expected Result:**

- ✅ Form validation error appears under "Repeat New Password" field
- ✅ Error message: "Passwords do not match"
- ✅ Form does NOT submit
- ✅ **NO success message appears**
- ✅ User stays on the same page

**Screenshot Checkpoint 4:** Password mismatch error

---

### Step 7: Test Weak Password Validation

**Action:**

1. Clear the form and enter:
   - Reset Password Code: `123456`
   - New Password: `password` (weak!)
   - Repeat New Password: `password`
2. Click "Reset Password"

**Expected Result:**

- ✅ Form validation error appears under "New Password" field
- ✅ Error message: "Password must contain at least 1 uppercase, 1 lowercase, and 1 number"
- ✅ Form does NOT submit
- ✅ **NO success message appears**
- ✅ User stays on the same page

**Screenshot Checkpoint 5:** Weak password validation error

---

### Step 8: Test Invalid Code

**Action:**

1. Enter in form:
   - Reset Password Code: `999999` (wrong code)
   - New Password: `Password123`
   - Repeat New Password: `Password123`
2. Click "Reset Password"

**Expected Result:**

- ✅ Request sent to backend: `POST /users/reset-password`
- ✅ Backend returns error
- ✅ Red error badge appears with backend error message
- ✅ Error message clears after 3 seconds
- ✅ **NO success message appears**
- ✅ User stays on the same page

---

### Step 9: Successfully Reset Password

**Action:**

1. Get the correct 6-digit code from email
2. Enter in form:
   - Reset Password Code: `123456` (correct code)
   - New Password: `Password123` (strong!)
   - Repeat New Password: `Password123` (matching!)
3. Click "Reset Password"

**Expected Result:**

- ✅ Request sent to backend: `POST /users/reset-password`
- ✅ Backend returns: `201 Created`
- ✅ **NOW the success message appears**: "Password reset successful" (green badge)
- ✅ Form inputs are cleared
- ✅ After 1.5 seconds, automatically redirected to `/login`
- ✅ **This is the ONLY time the success message should appear**

**Screenshot Checkpoint 6:** Success message after successful reset

---

### Step 10: Login with New Password

**Action:**

1. On login page, enter credentials:
   - Email: `weak@test.com`
   - Password: `Password123` (new strong password)
2. Click "Log in"

**Expected Result:**

- ✅ Login succeeds
- ✅ Success message: "Logged in successfully"
- ✅ Password strength check: **PASSES**
- ✅ **NO modal appears** (password is now strong)
- ✅ Loader appears: "Loading user's data..."
- ✅ Redirected to boards page
- ✅ Normal application flow continues

**Screenshot Checkpoint 7:** Successful login without modal

---

## Test Scenario 2: Normal Forgot Password Flow (Not from Weak Password)

### Step 1: Access Forgot Password Normally

**Action:**

1. Navigate to `http://localhost:3000/login`
2. Click "Forgot your password?" link

**Expected Result:**

- ✅ Redirected to: `/forgot-password` (no query params)
- ✅ Title: "Forgot Password" (NOT "Strengthen Your Password")
- ✅ **NO yellow security banner**
- ✅ **NO emoji in title**
- ✅ Subtitle: "Enter your email"
- ✅ Email field is **empty** (not pre-filled)
- ✅ Button: "Send Password Reset Code"

---

### Step 2: Complete Normal Reset

**Action:**

1. Enter any email: `normal@test.com`
2. Click "Send Password Reset Code"
3. Enter code and passwords
4. Submit

**Expected Result:**

- ✅ Same reset flow as weak password scenario
- ✅ But without the yellow security banner
- ✅ Success message only appears after successful password reset

---

## Test Scenario 3: Edge Cases

### Test 3a: Code Too Short

**Action:**

1. Complete weak password flow to Step 5
2. Enter:
   - Reset Password Code: `12` (only 2 digits)
   - New Password: `Password123`
   - Repeat New Password: `Password123`
3. Click "Reset Password"

**Expected Result:**

- ✅ Validation error: "The code must be exactly 6 digits"
- ✅ Form does not submit

---

### Test 3b: Code Too Long

**Action:**

1. Try to type more than 6 digits in code field

**Expected Result:**

- ✅ Input field has `maxLength={6}` attribute
- ✅ Cannot type more than 6 characters

---

### Test 3c: Password Too Short

**Action:**

1. Enter:
   - Reset Password Code: `123456`
   - New Password: `Pass1` (only 5 chars)
   - Repeat New Password: `Pass1`
2. Click "Reset Password"

**Expected Result:**

- ✅ Validation error: "Minimum 8 characters required"
- ✅ Form does not submit

---

### Test 3d: Empty Fields

**Action:**

1. Leave all fields empty
2. Click "Reset Password"

**Expected Result:**

- ✅ Multiple validation errors appear
- ✅ Each empty required field shows its error message
- ✅ Form does not submit

---

## Checklist: What to Verify

### ✅ Visual Issues Fixed

- [ ] No weird unicode characters (`\u26a0\ufe0f`) visible on page
- [ ] Emoji (🔒) renders correctly in title
- [ ] Yellow banner has clean text: "Security Update Required"
- [ ] All text is readable and properly formatted

### ✅ Success Message Timing

- [ ] **Step 1 (Email form):** NO success message
- [ ] **Step 2 (Reset form initially):** NO success message
- [ ] **After password mismatch error:** NO success message
- [ ] **After weak password error:** NO success message
- [ ] **After invalid code error:** NO success message
- [ ] **ONLY after successful password reset:** Success message appears

### ✅ Form Fields

- [ ] Reset Password Code field:
  - Empty by default
  - Placeholder: "Enter the reset code here"
  - NOT pre-filled with email
  - Max length: 6 characters
- [ ] New Password field:
  - Empty by default
  - Placeholder: "Enter your new password"
  - Type: password
- [ ] Repeat New Password field:
  - Empty by default
  - Placeholder: "Re-enter your new password"
  - Type: password

### ✅ Validation

- [ ] Passwords must match
- [ ] Password must meet strength requirements
- [ ] Code must be exactly 6 digits
- [ ] All validations work correctly
- [ ] Error messages are clear and helpful

### ✅ Flow

- [ ] Weak password detected → Modal shows
- [ ] Modal redirects to forgot-password with params
- [ ] Conditional content based on URL params
- [ ] Email pre-filled when coming from weak password
- [ ] Success message only after actual success
- [ ] Auto-redirect to login after success (1.5s delay)
- [ ] New strong password allows normal login

---

## Browser Console Check

Throughout all tests, verify:

- ✅ No console errors (red text)
- ✅ No React warnings
- ✅ No TypeScript errors
- ✅ API calls return expected status codes (200, 201)

---

## Mobile Responsive Check

Test on mobile viewport (or DevTools mobile emulation):

- [ ] Modal displays correctly
- [ ] Forgot password form is readable
- [ ] All buttons are tappable
- [ ] Form inputs work on mobile keyboards
- [ ] No horizontal scroll
- [ ] Text is not truncated

---

## Summary

### Issues Fixed ✅

1. ✅ Removed weird unicode characters (`\u26a0\ufe0f`)
2. ✅ Fixed emoji rendering (🔒)
3. ✅ Success message only appears AFTER successful password reset
4. ✅ Code field has correct placeholder (not pre-filled with email)
5. ✅ Added "Repeat New Password" field
6. ✅ Added password matching validation
7. ✅ Improved error handling and timing

### Expected Behavior

- Success message appears **ONLY ONCE** - after successful password reset
- All form fields start empty (except email when coming from weak password detection)
- Clear validation messages for all error cases
- Smooth flow from weak password detection to successful password reset
