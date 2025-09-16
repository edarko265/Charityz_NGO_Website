# CharityZ Donation System Setup Guide

## Overview
I've implemented a complete donation system for CharityZ using **Paystack** (perfect for Ghana-based NGOs) with international payment support. The system includes:

✅ **Secure donation processing** with Paystack  
✅ **Donor management system** with statistics tracking  
✅ **Receipt generation** for all donations  
✅ **Payment tracking** with status updates  
✅ **Multiple donation amounts and recurring options**  
✅ **International payment support** (accepts donations worldwide)  

## What's Been Implemented

### 1. Frontend Components
- **DonationForm**: Complete donation form with Paystack integration
- **DonorDashboard**: Personal dashboard for donors to track their donations
- **Updated GetInvolved page** with the new donation system

### 2. Database Schema
- `donations` table: Stores all donation records
- `donors` table: Aggregated donor statistics
- `donation_receipts` table: Receipt tracking
- `volunteers` table: Volunteer applications
- `members` table: Membership applications

### 3. Payment Integration
- Paystack payment processing (supports Ghana & international payments)
- Secure payment flow with success/failure handling
- Automatic receipt generation

## Setup Instructions

### Step 1: Set up Supabase Database
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `src/database-schema.sql`
4. Execute the SQL to create all tables and policies

### Step 2: Configure Environment Variables
In your Supabase project settings, add these environment variables:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Set up Paystack Account
1. Sign up at [https://paystack.com](https://paystack.com)
2. Complete your business verification (required for Ghana-based businesses)
3. Get your **Public Key** and **Secret Key** from the Paystack dashboard

### Step 4: Update Paystack Configuration
In `src/components/DonationForm.tsx`, line 52:
```typescript
key: 'pk_test_YOUR_PAYSTACK_PUBLIC_KEY', // Replace with your actual public key
```
Replace with your actual Paystack public key.

### Step 5: Configure Webhooks (Optional but Recommended)
Set up Paystack webhooks to handle payment confirmations:
1. In Paystack Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-supabase-project.supabase.co/functions/v1/paystack-webhook`
3. Select events: `charge.success`, `charge.failed`

## Features Available

### For Donors:
- **Multiple payment options**: Credit/debit cards, mobile money, bank transfers
- **International support**: Accept donations from anywhere in the world
- **Recurring donations**: One-time, monthly, quarterly, annual options
- **Fund designation**: Choose specific programs to support
- **Anonymous donations**: Option to donate anonymously
- **Instant receipts**: Automatic receipt generation
- **Donor dashboard**: Track donation history and impact

### For Administrators:
- **Real-time tracking**: Monitor donations as they come in
- **Donor management**: View donor statistics and history
- **Payment status tracking**: Track pending, successful, and failed payments
- **Receipt management**: Generate and manage donation receipts

## Payment Gateway Details

**Paystack Benefits for CharityZ:**
- ✅ **Available in Ghana** (unlike Stripe)
- ✅ **International payments** - accepts cards from 150+ countries
- ✅ **Local payment methods** - Mobile money, bank transfers
- ✅ **Competitive rates** - 1.5% + ₵0.50 for local cards
- ✅ **Multi-currency support** - USD, GHS, NGN, and more
- ✅ **PCI DSS compliance** - Bank-level security
- ✅ **Fast settlements** - Next-day settlements available

## Currency Options
The system currently processes in USD but can be configured for:
- **USD** (default for international donations)
- **GHS** (Ghana Cedis for local donations)
- **NGN** (Nigerian Naira)
- Other African currencies

To change the default currency, update the `currency` field in `DonationForm.tsx`.

## Testing
Use Paystack's test cards:
- **Successful payment**: 4084084084084081
- **Declined payment**: 4084084084084085

## Next Steps
1. Set up the Supabase database using the provided SQL schema
2. Get your Paystack account verified and keys
3. Update the public key in the donation form
4. Test donations using Paystack test cards
5. Go live once everything is working properly

## Support
- **Paystack Documentation**: [https://paystack.com/docs](https://paystack.com/docs)
- **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)

Your donation system is ready to accept donations from supporters worldwide! 🌍💚