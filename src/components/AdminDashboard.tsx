import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  BarChart3,
  PieChart,
  UserCheck,
  Mail
} from "lucide-react"
import { supabase, type Donation } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface AdminStats {
  totalDonations: number
  totalDonors: number
  totalAmount: number
  pendingDonations: number
  successfulDonations: number
  failedDonations: number
  avgDonation: number
  thisMonthAmount: number
}

interface Volunteer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  areas_of_interest: string[]
  status: string
  created_at: string
}

interface Member {
  id: string
  first_name: string
  last_name: string
  email: string
  membership_type: string
  status: string
  created_at: string
}

const AdminDashboard = () => {
  const { toast } = useToast()
  const [stats, setStats] = useState<AdminStats>({
    totalDonations: 0,
    totalDonors: 0,
    totalAmount: 0,
    pendingDonations: 0,
    successfulDonations: 0,
    failedDonations: 0,
    avgDonation: 0,
    thisMonthAmount: 0
  })
  const [donations, setDonations] = useState<Donation[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        fetchDonations(),
        fetchVolunteers(),
        fetchMembers(),
        fetchStats()
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    setDonations(data || [])
  }

  const fetchVolunteers = async () => {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    setVolunteers(data || [])
  }

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    setMembers(data || [])
  }

  const fetchStats = async () => {
    try {
      // Get donation stats
      const { data: donationStats, error: donationError } = await supabase
        .from('donations')
        .select('amount, payment_status, created_at')

      if (donationError) throw donationError

      // Get donor count
      const { count: donorCount, error: donorError } = await supabase
        .from('donors')
        .select('*', { count: 'exact', head: true })

      if (donorError) throw donorError

      // Calculate stats
      const donations = donationStats || []
      const successful = donations.filter(d => d.payment_status === 'successful')
      const pending = donations.filter(d => d.payment_status === 'pending')
      const failed = donations.filter(d => d.payment_status === 'failed')
      
      const totalAmount = successful.reduce((sum, d) => sum + d.amount, 0)
      const avgDonation = successful.length > 0 ? totalAmount / successful.length : 0

      // This month's donations
      const thisMonth = new Date()
      thisMonth.setDate(1)
      const thisMonthDonations = successful.filter(d => 
        new Date(d.created_at) >= thisMonth
      )
      const thisMonthAmount = thisMonthDonations.reduce((sum, d) => sum + d.amount, 0)

      setStats({
        totalDonations: donations.length,
        totalDonors: donorCount || 0,
        totalAmount,
        pendingDonations: pending.length,
        successfulDonations: successful.length,
        failedDonations: failed.length,
        avgDonation,
        thisMonthAmount
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const updateVolunteerStatus = async (volunteerId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', volunteerId)

      if (error) throw error

      await fetchVolunteers()
      toast({
        title: "Status Updated",
        description: `Volunteer status changed to ${status}.`,
      })
    } catch (error) {
      console.error('Error updating volunteer status:', error)
      toast({
        title: "Error",
        description: "Failed to update volunteer status.",
        variant: "destructive"
      })
    }
  }

  const updateMemberStatus = async (memberId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', memberId)

      if (error) throw error

      await fetchMembers()
      toast({
        title: "Status Updated",
        description: `Member status changed to ${status}.`,
      })
    } catch (error) {
      console.error('Error updating member status:', error)
      toast({
        title: "Error",
        description: "Failed to update member status.",
        variant: "destructive"
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'failed': return 'bg-red-500'
      case 'approved': return 'bg-green-500'
      case 'active': return 'bg-green-500'
      case 'declined': return 'bg-red-500'
      case 'inactive': return 'bg-gray-500'
      default: return 'bg-blue-500'
    }
  }

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donor_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || donation.payment_status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">CharityZ Admin Dashboard</h1>
        <Button onClick={fetchData} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-sm text-muted-foreground">Total Raised</h3>
            </div>
            <p className="text-2xl font-bold mt-2">${stats.totalAmount.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              This month: ${stats.thisMonthAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-sm text-muted-foreground">Total Donors</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.totalDonors}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: ${stats.avgDonation.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-sm text-muted-foreground">Successful</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.successfulDonations}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Pending: {stats.pendingDonations}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-sm text-muted-foreground">Total Donations</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.totalDonations}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Failed: {stats.failedDonations}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="donations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* Donations Tab */}
        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Donations</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search donations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="successful">Successful</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(donation.payment_status)} text-white`}
                        >
                          {donation.payment_status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(donation.created_at)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="font-semibold">{donation.donor_name}</p>
                          <p className="text-sm text-muted-foreground">{donation.donor_email}</p>
                        </div>
                        <div>
                          <p className="font-semibold">${donation.amount} {donation.currency}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {donation.donation_type}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm capitalize">{donation.designation}</p>
                          <p className="text-sm text-muted-foreground">
                            {donation.anonymous ? 'Anonymous' : 'Public'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Ref: {donation.payment_reference || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volunteers Tab */}
        <TabsContent value="volunteers">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {volunteers.map((volunteer) => (
                  <div key={volunteer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`${getStatusColor(volunteer.status)} text-white`}>
                          {volunteer.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(volunteer.created_at)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="font-semibold">
                            {volunteer.first_name} {volunteer.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                        </div>
                        <div>
                          <p className="text-sm">
                            Interests: {volunteer.areas_of_interest?.join(', ') || 'Not specified'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {volunteer.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateVolunteerStatus(volunteer.id, 'approved')}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateVolunteerStatus(volunteer.id, 'declined')}
                              >
                                Decline
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Membership Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`${getStatusColor(member.status)} text-white`}>
                          {member.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(member.created_at)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="font-semibold">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <div>
                          <p className="text-sm capitalize">
                            Type: {member.membership_type}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {member.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateMemberStatus(member.id, 'active')}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Activate
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateMemberStatus(member.id, 'inactive')}
                              >
                                Decline
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard