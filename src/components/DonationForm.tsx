import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CreditCard, Heart, Shield, Mail, Phone, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface DonationFormData {
  amount: number
  customAmount: string
  donationType: string
  designation: string
  donorName: string
  donorEmail: string
  donorPhone: string
  anonymous: boolean
}

const DonationForm = () => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 0,
    customAmount: '',
    donationType: 'one-time',
    designation: 'general',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    anonymous: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [paystackKey, setPaystackKey] = useState<string>('')

  useEffect(() => {
    // Fetch Paystack public key securely from edge function
    const fetchPaystackKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-paystack-key')
        if (error) throw error
        setPaystackKey(data.publicKey)
      } catch (error) {
        console.error('Error fetching Paystack key:', error)
        toast({
          title: "Configuration Error",
          description: "Payment system is not properly configured. Please contact support.",
          variant: "destructive"
        })
      }
    }
    fetchPaystackKey()
  }, [])

  const donationAmounts = [25, 50, 100, 250, 500, 1000]
  const designations = [
    { value: 'general', label: 'General Fund' },
    { value: 'education', label: 'Education Programs' },
    { value: 'healthcare', label: 'Healthcare Initiatives' },
    { value: 'water', label: 'Clean Water Projects' },
    { value: 'food', label: 'Food Security' },
    { value: 'emergency', label: 'Emergency Relief' }
  ]

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      amount,
      customAmount: ''
    }))
  }

  const handleCustomAmountChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      customAmount: value,
      amount: parseFloat(value) || 0
    }))
  }

  const initializePaystack = (amount: number, email: string, donationId: string) => {
    if (!paystackKey) {
      toast({
        title: "Payment Error",
        description: "Payment system is not available. Please contact support.",
        variant: "destructive"
      })
      return
    }

    // @ts-ignore - PaystackPop will be loaded from script
    const handler = PaystackPop.setup({
      key: paystackKey,
      email: email,
      amount: amount * 100, // Paystack expects amount in kobo (cents)
      currency: 'GHS', // Ghana Cedis
      ref: donationId,
      metadata: {
        donation_id: donationId,
        donor_name: formData.donorName,
        designation: formData.designation,
        donation_type: formData.donationType
      },
      callback: async function(response: any) {
        await handlePaymentSuccess(donationId, response.reference)
      },
      onClose: function() {
        toast({
          title: "Payment Cancelled",
          description: "You can continue your donation anytime.",
        })
      }
    })
    handler.openIframe()
  }

  const handlePaymentSuccess = async (donationId: string, paymentReference: string) => {
    try {
      // Update donation status to successful
      const { error } = await supabase
        .from('donations')
        .update({ 
          payment_status: 'successful',
          payment_reference: paymentReference,
          updated_at: new Date().toISOString()
        })
        .eq('id', donationId)

      if (error) throw error

      // Generate receipt
      await generateReceipt(donationId)

      toast({
        title: "Donation Successful! 🎉",
        description: "Thank you for your generous donation. A receipt will be sent to your email.",
      })

      // Reset form
      setFormData({
        amount: 0,
        customAmount: '',
        donationType: 'one-time',
        designation: 'general',
        donorName: '',
        donorEmail: '',
        donorPhone: '',
        anonymous: false
      })

    } catch (error) {
      console.error('Error updating donation:', error)
      toast({
        title: "Error",
        description: "There was an issue processing your donation. Please contact support.",
        variant: "destructive"
      })
    }
  }

  const generateReceipt = async (donationId: string) => {
    try {
      const receiptNumber = `CZ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      
      const { error } = await supabase
        .from('donation_receipts')
        .insert({
          donation_id: donationId,
          receipt_number: receiptNumber,
          generated_at: new Date().toISOString()
        })

      if (error) throw error

      // Here you could also trigger an email with the receipt
      // This would typically be done via an edge function
      
    } catch (error) {
      console.error('Error generating receipt:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || formData.amount < 5) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a donation amount of at least GH₵5.",
        variant: "destructive"
      })
      return
    }

    if (!formData.donorName || !formData.donorEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Create donation record
      const donationData = {
        donor_name: formData.anonymous ? 'Anonymous' : formData.donorName,
        donor_email: formData.donorEmail,
        donor_phone: formData.donorPhone || null,
        amount: formData.amount,
        currency: 'GHS',
        donation_type: formData.donationType,
        designation: formData.designation,
        anonymous: formData.anonymous,
        payment_status: 'pending',
        payment_reference: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('donations')
        .insert(donationData)
        .select()
        .single()

      if (error) throw error

      // Initialize Paystack payment
      initializePaystack(formData.amount, formData.donorEmail, data.id)

    } catch (error) {
      console.error('Error creating donation:', error)
      toast({
        title: "Error",
        description: "There was an issue processing your donation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const finalAmount = formData.customAmount ? parseFloat(formData.customAmount) : formData.amount

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <Shield className="h-4 w-4" />
        <span>Secure donation powered by Paystack - Trusted by thousands</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary" />
            <span>Make a Donation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Donation Amount (GHS)</Label>
              <div className="grid grid-cols-3 gap-3">
                {donationAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={formData.amount === amount ? "default" : "outline"}
                    onClick={() => handleAmountSelect(amount)}
                    className="h-12"
                  >
                    GH₵{amount}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Custom Amount</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter custom amount"
                  value={formData.customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  min="5"
                  step="0.01"
                />
              </div>
            </div>

            {/* Donation Type */}
            <div className="space-y-2">
              <Label htmlFor="donation-type">Donation Frequency</Label>
              <Select value={formData.donationType} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, donationType: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time Donation</SelectItem>
                  <SelectItem value="monthly">Monthly Recurring</SelectItem>
                  <SelectItem value="quarterly">Quarterly Recurring</SelectItem>
                  <SelectItem value="annual">Annual Recurring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="designation">Fund Designation</Label>
              <Select value={formData.designation} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, designation: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((designation) => (
                    <SelectItem key={designation.value} value={designation.value}>
                      {designation.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Donor Information */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Donor Information</Label>
              
              <div className="space-y-2">
                <Label htmlFor="donor-name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="donor-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.donorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="donor-email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="donor-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.donorEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, donorEmail: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="donor-phone">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="donor-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.donorPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, donorPhone: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={formData.anonymous}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, anonymous: checked as boolean }))
                  }
                />
                <Label htmlFor="anonymous">Make this donation anonymous</Label>
              </div>
            </div>

            {/* Donation Summary */}
            {finalAmount > 0 && (
              <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">Donation Summary</h3>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">GH₵{finalAmount.toFixed(2)} GHS</span>
                </div>
                <div className="flex justify-between">
                  <span>Frequency:</span>
                  <span className="capitalize">{formData.donationType.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fund:</span>
                  <span>{designations.find(d => d.value === formData.designation)?.label}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading || !finalAmount || finalAmount < 5 || !paystackKey}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isLoading ? 'Processing...' : `Donate GH₵${finalAmount.toFixed(2)}`}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment Methods Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold">Secure Payment Methods</h3>
            <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
              <span>💳 Credit/Debit Cards</span>
              <span>📱 Mobile Money</span>
              <span>🏦 Bank Transfer</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All donations are processed securely through Paystack. We accept international payments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DonationForm