import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xyghxlddqfvcgxatbuxk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Z2h4bGRkcWZ2Y2d4YXRidXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjMyODUsImV4cCI6MjA3MzU5OTI4NX0.eEsvEImMrom63FNtoMfXOWKbv8jjTi6gG_ttyCx8Ue0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Donation {
  id: string
  donor_name: string
  donor_email: string
  donor_phone?: string
  amount: number
  currency: string
  donation_type: 'one-time' | 'monthly' | 'quarterly' | 'annual'
  designation: string
  anonymous: boolean
  payment_reference: string
  payment_status: 'pending' | 'successful' | 'failed'
  created_at: string
  updated_at: string
}

export interface Donor {
  id: string
  name: string
  email: string
  phone?: string
  total_donated: number
  donation_count: number
  created_at: string
  updated_at: string
}

export interface DonationReceipt {
  id: string
  donation_id: string
  receipt_number: string
  generated_at: string
  pdf_url?: string
}