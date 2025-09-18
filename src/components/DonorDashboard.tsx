import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Download, Heart, TrendingUp, Gift, Award } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  currency: string;
  donation_type: 'one-time' | 'monthly' | 'quarterly' | 'annual';
  designation: string;
  anonymous: boolean;
  payment_reference: string;
  payment_status: 'pending' | 'successful' | 'failed';
  created_at: string;
  updated_at: string;
}

interface DonorStats {
  totalDonated: number
  donationCount: number
  averageDonation: number
  lastDonation: string
}

interface DonorDashboardProps {
  donorEmail: string
}

const DonorDashboard: React.FC<DonorDashboardProps> = ({ donorEmail }) => {
  const { toast } = useToast()
  const [donations, setDonations] = useState<Donation[]>([])
  const [stats, setStats] = useState<DonorStats>({
    totalDonated: 0,
    donationCount: 0,
    averageDonation: 0,
    lastDonation: ''
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDonations()
  }, [donorEmail])

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_email', donorEmail)
        .eq('payment_status', 'successful')
        .order('created_at', { ascending: false })

      if (error) throw error

      setDonations(data?.map(d => ({ 
        ...d, 
        donation_type: d.donation_type as any,
        payment_status: d.payment_status as any 
      })) || [])
      calculateStats(data?.map(d => ({ 
        ...d, 
        donation_type: d.donation_type as any,
        payment_status: d.payment_status as any 
      })) || [])
    } catch (error) {
      console.error('Error fetching donations:', error)
      toast({
        title: "Error",
        description: "Failed to load donation history.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (donations: Donation[]) => {
    const total = donations.reduce((sum, donation) => sum + donation.amount, 0)
    const count = donations.length
    const average = count > 0 ? total / count : 0
    const lastDonation = donations.length > 0 ? donations[0].created_at : ''

    setStats({
      totalDonated: total,
      donationCount: count,
      averageDonation: average,
      lastDonation
    })
  }

  const downloadReceipt = async (donationId: string, receiptNumber?: string) => {
    try {
      // In a real implementation, this would generate and download a PDF receipt
      toast({
        title: "Receipt Download",
        description: `Receipt ${receiptNumber || 'N/A'} will be available soon.`,
      })
    } catch (error) {
      console.error('Error downloading receipt:', error)
      toast({
        title: "Error",
        description: "Failed to download receipt.",
        variant: "destructive"
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getImpactLevel = (totalDonated: number) => {
    if (totalDonated >= 1000) return { level: 'Champion', color: 'bg-yellow-500', icon: '🏆' }
    if (totalDonated >= 500) return { level: 'Advocate', color: 'bg-blue-500', icon: '⭐' }
    if (totalDonated >= 100) return { level: 'Supporter', color: 'bg-green-500', icon: '💚' }
    return { level: 'Friend', color: 'bg-gray-500', icon: '🤝' }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const impactLevel = getImpactLevel(stats.totalDonated)

  return (
    <div className="space-y-6">
      {/* Impact Level Badge */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full ${impactLevel.color} flex items-center justify-center text-white text-xl`}>
                {impactLevel.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold">Impact Level: {impactLevel.level}</h3>
                <p className="text-muted-foreground">Thank you for your continued support!</p>
              </div>
            </div>
            <Award className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm text-muted-foreground">Total Donated</h3>
            </div>
            <p className="text-2xl font-bold mt-2">GH₵{stats.totalDonated.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm text-muted-foreground">Donations Made</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.donationCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm text-muted-foreground">Average Donation</h3>
            </div>
            <p className="text-2xl font-bold mt-2">GH₵{stats.averageDonation.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm text-muted-foreground">Last Donation</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {stats.lastDonation ? formatDate(stats.lastDonation) : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Donation History */}
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No donations found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={donation.donation_type === 'one-time' ? 'secondary' : 'default'}>
                        {donation.donation_type.replace('-', ' ')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(donation.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">GH₵{donation.amount.toFixed(2)} {donation.currency}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {donation.designation.replace('_', ' ')} fund
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(donation.id, `CZ-${donation.id.slice(-6)}`)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DonorDashboard