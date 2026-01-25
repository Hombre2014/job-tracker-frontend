# Weak Password Flow - Visual Flowchart

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER LOGS IN                             │
│              /login (page.tsx)                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Backend validates   │
              │    credentials       │
              └──────────┬───────────┘
                         │
                ┌────────┴─────────┐
                │                  │
                ▼                  ▼
         ❌ FAIL              ✅ SUCCESS
                │                  │
                ▼                  ▼
         Show error      ┌──────────────────┐
                         │ Check password   │
                         │    strength      │
                         │ (frontend only)  │
                         └─────────┬────────┘
                                   │
                        ┌──────────┴──────────┐
                        │                     │
                        ▼                     ▼
                 💪 STRONG              😰 WEAK
                        │                     │
                        ▼                     ▼
            ┌────────────────────┐   ┌────────────────────┐
            │  Normal Flow       │   │  Show Modal        │
            │  Load Boards       │   │  WeakPasswordModal │
            │  Continue to App   │   └─────────┬──────────┘
            └────────────────────┘             │
                                               ▼
                                    ┌──────────────────────┐
                                    │ User clicks          │
                                    │ "Reset My Password"  │
                                    └──────────┬───────────┘
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │ Logout (clear        │
                                    │ localStorage)        │
                                    └──────────┬───────────┘
                                               │
                                               ▼
                        ┌──────────────────────────────────────┐
                        │ Redirect to:                         │
                        │ /forgot-password?email=...&reason=weak│
                        └──────────┬───────────────────────────┘
                                   │
                                   ▼
        ┌──────────────────────────────────────────────────────┐
        │      FORGOT PASSWORD PAGE (Enhanced)                 │
        │      /forgot-password/page.tsx                       │
        ├──────────────────────────────────────────────────────┤
        │                                                      │
        │  🔒 Strengthen Your Password                        │
        │                                                      │
        │  ⚠️ Security Update Required                        │
        │  Your current password doesn't meet our updated     │
        │  security standards. Please reset it to a stronger  │
        │  one to continue.                                   │
        │                                                      │
        │  Email: [john@example.com] ← Pre-filled            │
        │                                                      │
        │  [Send Password Reset Code]                         │
        └──────────────────┬───────────────────────────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Backend sends        │
                │ 6-digit code         │
                │ to email             │
                └──────────┬───────────┘
                           │
                           ▼
        ┌──────────────────────────────────────────────────────┐
        │  Enter code: [______]                               │
        │  New password: [________]                           │
        │                                                      │
        │  *At least: 8 characters, 1 number, 1 upper, 1 lower│
        │                                                      │
        │  [Reset Password] ← Enforced by ResetPasswordSchema │
        └──────────────────┬───────────────────────────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Backend validates    │
                │ code & new password  │
                └──────────┬───────────┘
                           │
                  ┌────────┴─────────┐
                  │                  │
                  ▼                  ▼
               ❌ FAIL          ✅ SUCCESS
                  │                  │
                  ▼                  ▼
            Show error     Password updated!
                           Redirect to /login
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ User logs in with    │
                        │ NEW STRONG password  │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Password check: PASS │
                        │ Normal flow resumes  │
                        └──────────────────────┘
```

## Component Interactions

```
┌─────────────────────────────────────────────────────────────────┐
│                         LOGIN PAGE                              │
│                    (app/(auth)/login/page.tsx)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Uses:                                                          │
│  • isStrongPassword() ← utils/passwordStrength.ts              │
│  • WeakPasswordModal ← components/auth/ForcePasswordChangeModal │
│  • LoginSchema ← schemas/index.ts                              │
│                                                                 │
│  On successful login:                                           │
│  if (!isStrongPassword(userPassword)) {                        │
│    setShowPasswordModal(true)                                  │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WEAK PASSWORD MODAL                          │
│       (components/auth/ForcePasswordChangeModal.tsx)            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Props:                                                         │
│  • isOpen: boolean                                             │
│  • email: string                                               │
│                                                                 │
│  On "Reset My Password" click:                                 │
│  1. Clear localStorage                                         │
│  2. router.push(                                               │
│       /forgot-password?email=...&reason=weak                   │
│     )                                                           │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FORGOT PASSWORD PAGE                           │
│             (app/(auth)/forgot-password/page.tsx)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Uses:                                                          │
│  • useSearchParams() ← next/navigation                         │
│  • ForgotPasswordSchema ← schemas/index.ts                     │
│  • ResetPasswordSchema ← schemas/index.ts (strong password!)   │
│                                                                 │
│  Reads URL params:                                              │
│  const reason = searchParams.get('reason')                     │
│  const email = searchParams.get('email')                       │
│                                                                 │
│  Conditional display:                                           │
│  if (reason === 'weak') {                                      │
│    Show: "🔒 Strengthen Your Password"                        │
│    Show: Security update banner                                │
│  } else {                                                       │
│    Show: "Forgot Password"                                     │
│  }                                                              │
│                                                                 │
│  Pre-fills email field from URL                                │
└─────────────────────────────────────────────────────────────────┘
```

## State Management

```
┌────────────────────────┐
│     LOGIN PAGE         │
├────────────────────────┤
│ State:                 │
│ • userEmail           │
│ • userPassword        │
│ • showPasswordModal   │
│                        │
│ Redux:                 │
│ • status              │
│ • accessToken         │
└────────────────────────┘
           │
           ▼
┌────────────────────────┐
│  WEAK PASSWORD MODAL   │
├────────────────────────┤
│ Props:                 │
│ • isOpen              │
│ • email               │
│                        │
│ Actions:               │
│ • Clear localStorage  │
│ • Router push         │
└────────────────────────┘
           │
           ▼
┌────────────────────────┐
│ FORGOT PASSWORD PAGE   │
├────────────────────────┤
│ State:                 │
│ • userEmail           │
│ • buttonClicked       │
│ • error               │
│ • success             │
│                        │
│ URL Params:            │
│ • reason=weak         │
│ • email=...           │
└────────────────────────┘
```

## Data Flow: Complete Example

**User:** john@example.com  
**Current Password:** password123 (weak - no uppercase)

```
Step 1: Login
─────────────
Input: { email: "john@example.com", password: "password123" }
  ↓
POST /auth/login
  ↓
Response: { accessToken: "...", refreshToken: "...", user: {...} }
  ↓
Store in localStorage
  ↓
Check: isStrongPassword("password123")
  ↓
Result: false (missing uppercase)
  ↓
Show WeakPasswordModal


Step 2: Modal Action
────────────────────
User clicks "Reset My Password"
  ↓
Clear localStorage
  ↓
Navigate to: /forgot-password?email=john@example.com&reason=weak


Step 3: Forgot Password (Step 1)
─────────────────────────────────
Page loads with:
  • Title: "🔒 Strengthen Your Password"
  • Banner: Security update message
  • Email pre-filled: "john@example.com"
  ↓
User clicks "Send Password Reset Code"
  ↓
POST /users/reset-password/create-verification-code
  ↓
Body: { email: "john@example.com" }
  ↓
Response: 200 OK
  ↓
Email sent with code: "123456"


Step 4: Forgot Password (Step 2)
─────────────────────────────────
Form shows:
  • Code input: [______]
  • New password input: [________]
  ↓
User enters:
  • Code: "123456"
  • New password: "Password123" (strong!)
  ↓
Validation: ResetPasswordSchema.parse({ code, newPassword })
  ↓
Passes ✓ (8+ chars, uppercase, lowercase, number)
  ↓
POST /users/reset-password
  ↓
Body: { email: "john@example.com", code: "123456", newPassword: "Password123" }
  ↓
Response: 201 Created
  ↓
Success message: "Password reset successful"
  ↓
Navigate to: /login


Step 5: New Login
─────────────────
User logs in with:
  • Email: "john@example.com"
  • Password: "Password123"
  ↓
POST /auth/login
  ↓
Response: { accessToken: "...", refreshToken: "...", user: {...} }
  ↓
Store in localStorage
  ↓
Check: isStrongPassword("Password123")
  ↓
Result: true ✓
  ↓
Dispatch: getBoards(accessToken)
  ↓
Normal flow continues
```

## Schema Validation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     PASSWORD SCHEMAS                            │
└─────────────────────────────────────────────────────────────────┘

RegisterSchema (schemas/index.ts)
─────────────────────────────────
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

password: z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(strongPasswordRegex, {
    message: 'Password must contain at least 1 uppercase, 1 lowercase, and 1 number'
  })

Applied to: NEW USER REGISTRATION
Effect: Blocks weak passwords at registration


ResetPasswordSchema (schemas/index.ts)
──────────────────────────────────────
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

newPassword: z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(strongPasswordRegex, {
    message: 'Password must contain at least 1 uppercase, 1 lowercase, and 1 number'
  })

Applied to: PASSWORD RESETS (including weak password flow)
Effect: Enforces strong passwords when resetting


isStrongPassword() (utils/passwordStrength.ts)
───────────────────────────────────────────────
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
return strongPasswordRegex.test(password);

Applied to: LOGIN PASSWORD CHECK (client-side only)
Effect: Detects weak passwords and triggers modal
```
