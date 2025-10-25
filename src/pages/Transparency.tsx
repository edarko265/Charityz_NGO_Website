import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Users, FileText, CheckCircle } from "lucide-react";

const Transparency = () => {
  const financialBreakdown = [
    { category: "Programs & Services", percentage: 85, color: "bg-primary" },
    { category: "Administration", percentage: 10, color: "bg-blue-500" },
    { category: "Fundraising", percentage: 5, color: "bg-green-500" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Transparency & Accountability</h1>
          <p className="text-xl text-muted-foreground mb-12">
            We believe in complete transparency. Here&apos;s how we manage and allocate your generous donations.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Raised (2024)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.4M</div>
                <p className="text-xs text-muted-foreground">
                  +15% from previous year
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,847</div>
                <p className="text-xs text-muted-foreground">
                  Across 45 countries
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">52</div>
                <p className="text-xs text-muted-foreground">
                  In 15 countries
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lives Impacted</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100K+</div>
                <p className="text-xs text-muted-foreground">
                  Direct beneficiaries
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Financial Allocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  We are committed to maximizing the impact of every dollar donated. Here&apos;s how we allocate funds:
                </p>
                {financialBreakdown.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
                <p className="text-sm text-muted-foreground mt-4">
                  This exceeds industry standards and demonstrates our commitment to directing the maximum amount of resources directly to those we serve.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accountability Standards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  CharityZ adheres to the highest standards of accountability and transparency:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Annual Financial Audits:</strong> Our finances are audited annually by an independent certified public accounting firm
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Board Oversight:</strong> Our independent board of directors provides governance and strategic direction
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Regular Reporting:</strong> We publish quarterly impact reports and annual financial statements
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Donor Privacy:</strong> We maintain strict policies to protect donor information
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Impact Measurement:</strong> We track and report on specific outcomes and impact metrics for all programs
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certifications & Recognition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>501(c)(3) Status:</strong> Registered non-profit organization with the IRS
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>GuideStar Platinum Seal:</strong> Highest level of transparency recognition
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>BBB Accredited Charity:</strong> Meets all 20 standards for charity accountability
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Charity Navigator 4-Star Rating:</strong> Highest rating for financial health and accountability
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leadership & Governance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold">Board of Directors</h3>
                <p className="text-muted-foreground">
                  Our board consists of experienced professionals from diverse backgrounds who provide strategic guidance and ensure organizational accountability. All board members serve voluntarily without compensation.
                </p>

                <h3 className="font-semibold mt-4">Executive Team</h3>
                <p className="text-muted-foreground">
                  Our executive team brings decades of combined experience in international development, humanitarian work, and non-profit management. Executive compensation is reviewed annually and is comparable to similar organizations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How You Can Stay Informed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Annual Reports:</strong> Comprehensive overview of our programs, finances, and impact
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Quarterly Updates:</strong> Regular newsletters with project updates and impact stories
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Financial Statements:</strong> Audited financial statements available upon request
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>IRS Form 990:</strong> Public tax documents available on our website and GuideStar
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Questions or Concerns?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We welcome your questions about our finances, governance, or programs. Please contact us at:
                </p>
                <div className="mt-4">
                  <p>Email: transparency@charityz.org</p>
                  <p>Phone: +1 (555) 123-4567</p>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  We are committed to responding to all inquiries within 48 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Transparency;
