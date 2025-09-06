# OTP Email Verification Implementation

## Overview
I've successfully added a comprehensive OTP (One-Time Password) email verification system to your Roamio project. This system ensures that users verify their email addresses before completing registration.

## Features Implemented

### 1. Database Models
- **OTP Model** (`src/model/otp.ts`): Stores OTP codes with expiration and usage tracking
- **Updated User Model** (`src/model/user.ts`): Added `isEmailVerified` field

### 2. Email Service
- **Email Utility** (`src/libs/email.ts`): Handles OTP email sending with beautiful HTML templates
- **Welcome Email**: Sent after successful verification

### 3. API Routes
- **Send OTP** (`/api/auth/send-otp`): Generates and sends OTP to user's email
- **Verify OTP** (`/api/auth/verify-otp`): Validates OTP and marks email as verified
- **Updated Signup** (`/api/signup`): Now checks for email verification

### 4. Frontend Components
- **OTP Verification Component** (`src/components/auth/OTPVerification.tsx`): Beautiful UI for OTP input
- **Updated Signup Page** (`src/app/(auth)/signup/page.tsx`): Integrated OTP flow

## Setup Required

### 1. Install Dependencies
```bash
npm install nodemailer @types/nodemailer
```

### 2. Environment Variables
Add these to your `.env.local` file:
```env
# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NEXTAUTH_URL=http://localhost:3000
```

### 3. Gmail Setup (if using Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password as `EMAIL_PASS`

## User Flow

1. **User fills signup form** → Clicks "Send Verification Code"
2. **System sends OTP email** → User receives 6-digit code
3. **User enters OTP** → System verifies and marks email as verified
4. **User completes signup** → Account created with verified email

## Security Features

- **OTP Expiration**: Codes expire after 10 minutes
- **Rate Limiting**: Prevents spam (1 minute cooldown between requests)
- **One-time Use**: OTPs can only be used once
- **Automatic Cleanup**: Expired OTPs are automatically removed from database

## Email Templates

The system includes beautiful, responsive email templates with:
- Branded design with Roamio colors
- Clear OTP display
- Security tips
- Professional styling

## Files Created/Modified

### New Files:
- `src/model/otp.ts` - OTP database model
- `src/libs/email.ts` - Email service utilities
- `src/app/api/auth/send-otp/route.ts` - Send OTP API
- `src/app/api/auth/verify-otp/route.ts` - Verify OTP API
- `src/components/auth/OTPVerification.tsx` - OTP verification UI

### Modified Files:
- `src/model/user.ts` - Added email verification field
- `src/app/api/signup/route.ts` - Updated to check email verification
- `src/app/(auth)/signup/page.tsx` - Integrated OTP flow

## Testing

1. Start your development server: `npm run dev`
2. Go to `/signup`
3. Fill in the form and click "Send Verification Code"
4. Check your email for the OTP
5. Enter the OTP to verify your email
6. Complete the signup process

## Customization

You can customize:
- Email templates in `src/libs/email.ts`
- OTP expiration time (currently 10 minutes)
- Rate limiting duration (currently 1 minute)
- UI styling in the OTP verification component

The system is now ready to use once you install the nodemailer dependency and configure your email settings!
