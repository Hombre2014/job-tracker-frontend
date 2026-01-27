# Company Autocomplete & Logo Integration

This document describes the integration of Clearbit Autocomplete API and Brandfetch Logo API into the Job Tracker application.

## Overview

The application now features:

- **Company autocomplete** powered by Clearbit (millions of companies)
- **Company logos** powered by Brandfetch (60+ million companies)
- **No database storage** for logos - dynamically fetched as needed
- **Automatic updates** - logos stay current with company rebranding

## APIs Used

### Clearbit Autocomplete API

- **Purpose**: Company name search and autocomplete
- **Endpoint**: `https://autocomplete.clearbit.com/v1/companies/suggest`
- **Authentication**: None required
- **Data Returned**: Company name, domain/website
- **Cost**: Free

### Brandfetch Logo API

- **Purpose**: Company logo display
- **Endpoint**: `https://cdn.brandfetch.io/{domain}?c={CLIENT_ID}`
- **Authentication**: Client ID required (free account)
- **Data Returned**: High-quality company logos
- **Cost**: Free
- **Limitations**: Must hotlink logos (no downloading/caching)

## Configuration

### Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_BRANDFETCH_CLIENT_ID=your_client_id_here
```

### Next.js Image Configuration

Updated `next.config.mjs` to allow external images from:

- `cdn.brandfetch.io` (Brandfetch logos)
- `logo.clearbit.com` (Clearbit logos - fallback)

## Components Created

### 1. CompanyLogo Component

**Location**: `components/CompanyLogo/CompanyLogo.tsx`

Reusable component for displaying company logos:

- **Props**:
  - `domain` - Company website domain
  - `companyName` - Company name (for alt text)
  - `size` - 'sm' (24px), 'md' (40px), or 'lg' (64px)
  - `className` - Optional styling
- **Features**:
  - Auto-extracts domain from full URLs
  - Fallback icon (Building2) if logo fails to load
  - Responsive sizing
  - Error handling

### 2. CompanyAutocomplete Component

**Location**: `components/CompanyAutocomplete/CompanyAutocomplete.tsx`

Dropdown autocomplete with company suggestions:

- **Features**:
  - Debounced search (300ms)
  - Keyboard navigation (arrow keys, enter, escape)
  - Company logos in dropdown
  - Loading states
  - "No results" message

### 3. useCompanyAutocomplete Hook

**Location**: `hooks/useCompanyAutocomplete.ts`

Custom hook for fetching company suggestions:

- **Returns**: `{ suggestions, isLoading, error }`
- **Features**:
  - Debounced API calls
  - Error handling
  - Loading states

### 4. Company Autocomplete Service

**Location**: `services/companyAutocompleteService.ts`

API client for Clearbit:

- Fetches company suggestions
- Returns array of `CompanySuggestion` objects

## Implementation Locations

### Logo Display

#### 1. Job Application Cards (Kanban Board)

- **File**: `components/HomePage/Kanban/Column/JobPosts/JobPostCard.tsx`
- **Size**: Small (24px)
- **Location**: Next to company name on each job card

#### 2. Job Modal Header

- **File**: `app/(loggedin)/home/boards/[board_id]/job/layout.tsx`
- **Size**: Small (24px)
- **Location**: Next to company name in modal header

#### 3. Company Tab

- **File**: `components/HomePage/Kanban/Column/JobPosts/JobModal/JobCompany/Company.tsx`
- **Size**: Large (64px)
- **Location**: Before company name in detailed view

### Autocomplete Integration

#### EditCompanyForm

- **File**: `components/Forms/EditCompanyForm.tsx`
- **Feature**: Company name field replaced with autocomplete
- **Behavior**:
  - User types company name
  - Suggestions appear with logos
  - User selects → name and URL auto-filled
  - User manually adds industry and description

## Data Flow

### Creating/Editing a Company

1. User starts typing company name in autocomplete
2. Clearbit API returns suggestions (after 300ms debounce)
3. Dropdown shows suggestions with Brandfetch logos
4. User selects a company
5. Form auto-fills:
   - Company name (from Clearbit)
   - Website URL (from Clearbit domain)
6. User manually enters:
   - Industry
   - Description
7. Data saved to backend database

### Displaying Company Logos

1. Component receives `company.url` from backend
2. `CompanyLogo` component extracts domain
3. Constructs Brandfetch URL with client ID
4. Image loads from Brandfetch CDN
5. If error, shows fallback Building icon

## Type Updates

### JobPostCardProps

Added optional `companyUrl` field:

```typescript
interface JobPostCardProps {
  // ... existing fields
  companyUrl?: string;
}
```

## Backend Considerations

### No Changes Required ✅

The backend **does not need modifications** because:

- Company model already has `url` field
- Autocomplete happens client-side (Clearbit)
- Logos fetched client-side (Brandfetch)
- Backend only stores: name, url, industry, description

### Optional Cleanup

You may optionally **remove** the `/companies/starts-with` endpoint since it's no longer used. The frontend now queries Clearbit instead of your database for autocomplete.

## Testing

### Manual Testing Checklist

- [ ] Type in company name field → suggestions appear
- [ ] Logos display in autocomplete dropdown
- [ ] Select company → name and URL auto-fill
- [ ] Logos display on job cards (small)
- [ ] Logos display in job modal header (small)
- [ ] Logos display in company tab (large)
- [ ] Fallback icon shows for missing logos
- [ ] Existing companies show logos using their stored URLs

### Edge Cases Handled

- Missing company URL → fallback icon
- Logo fails to load → fallback icon
- No search results → "No companies found" message
- Internet connectivity → standard image loading behavior

## Troubleshooting

### Logos Not Showing

1. **Check Brandfetch Client ID**
   - Verify `.env.local` has correct client ID
   - Restart dev server after changing `.env.local`

2. **Check Network Tab**
   - Open browser DevTools → Network
   - Filter by "brandfetch"
   - Check for 401/403 errors (wrong client ID)

3. **Check Image Domains**
   - Verify `next.config.mjs` includes `cdn.brandfetch.io`
   - Restart Next.js after config changes

### Autocomplete Not Working

1. **Check Clearbit API**
   - Test in browser: `https://autocomplete.clearbit.com/v1/companies/suggest?query=google`
   - Should return JSON array

2. **Check Console Errors**
   - Open browser DevTools → Console
   - Look for CORS or network errors

3. **Check Debounce**
   - Wait 300ms after typing
   - Type at least 2 characters

## Performance Considerations

### Image Loading

- Logos load asynchronously
- Browser caches logos after first load
- Next.js Image component optimizes delivery

### API Rate Limits

- Clearbit: Reasonable free tier limits
- Brandfetch: Unlimited logo requests (free tier)
- Debouncing reduces unnecessary API calls

## Future Enhancements

### Potential Improvements

1. **Add Loading Skeleton**: Show placeholder while logo loads
2. **Cache Suggestions**: Store recent searches in memory
3. **Allow Manual Entry**: Let users add companies not in Clearbit
4. **Logo Fallback Chain**: Try Clearbit logo if Brandfetch fails
5. **Company Details API**: Integrate Brandfetch Brand API for industry/description (paid tier)

## Security

### Client-Side API Keys

- Brandfetch Client ID is safe to expose (frontend use only)
- No sensitive operations possible with client ID
- Logo API designed for browser embedding

### CORS

- Clearbit API allows all origins
- Brandfetch requires `Referer` header (automatically sent by browsers)

## References

- [Clearbit Autocomplete Docs](https://clearbit.com/docs)
- [Brandfetch Logo API Docs](https://docs.brandfetch.com/logo-api/guidelines)
- [Brandfetch Developer Portal](https://developers.brandfetch.com/)
