import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";

const Reports = () => {
  const annualReports = [
    {
      year: "2024",
      title: "Annual Report 2024",
      description: "A comprehensive overview of our programs, impact, and financial performance in 2024.",
      pages: 48,
      size: "3.2 MB",
      highlights: [
        "52 projects completed across 15 countries",
        "100,000+ lives directly impacted",
        "$2.4M raised from generous donors",
        "85% program efficiency ratio"
      ]
    },
    {
      year: "2023",
      title: "Annual Report 2023",
      description: "Our journey through 2023, featuring major milestones and community transformation stories.",
      pages: 42,
      size: "2.8 MB",
      highlights: [
        "45 projects completed",
        "75,000+ beneficiaries reached",
        "$2.1M in donations received",
        "Expanded to 3 new countries"
      ]
    },
    {
      year: "2022",
      title: "Annual Report 2022",
      description: "Building momentum and expanding our reach in communities around the world.",
      pages: 38,
      size: "2.5 MB",
      highlights: [
        "38 projects implemented",
        "60,000+ lives changed",
        "$1.8M fundraising success",
        "Launched education initiative"
      ]
    },
  ];

  const financialStatements = [
    {
      year: "2024",
      title: "Audited Financial Statement 2024",
      type: "Financial Statement",
      size: "1.8 MB"
    },
    {
      year: "2023",
      title: "Audited Financial Statement 2023",
      type: "Financial Statement",
      size: "1.6 MB"
    },
    {
      year: "2022",
      title: "Audited Financial Statement 2022",
      type: "Financial Statement",
      size: "1.5 MB"
    },
  ];

  const impactReports = [
    {
      quarter: "Q3 2024",
      title: "Impact Report Q3 2024",
      description: "Latest updates on ongoing projects and community impact metrics.",
      size: "1.2 MB"
    },
    {
      quarter: "Q2 2024",
      title: "Impact Report Q2 2024",
      description: "Mid-year progress report featuring water and education projects.",
      size: "1.1 MB"
    },
    {
      quarter: "Q1 2024",
      title: "Impact Report Q1 2024",
      description: "First quarter highlights and new project launches.",
      size: "1.0 MB"
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Annual Reports & Publications</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Access our comprehensive reports detailing our programs, finances, and impact across the globe.
          </p>

          <div className="space-y-12">
            {/* Annual Reports Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Annual Reports</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {annualReports.map((report) => (
                  <Card key={report.year} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <FileText className="h-10 w-10 text-primary" />
                        <span className="text-sm text-muted-foreground">{report.year}</span>
                      </div>
                      <CardTitle className="mt-4">{report.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Key Highlights:</h4>
                        <ul className="text-sm space-y-1">
                          {report.highlights.map((highlight, index) => (
                            <li key={index} className="text-muted-foreground">• {highlight}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                        <span>{report.pages} pages</span>
                        <span>{report.size}</span>
                      </div>

                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Financial Statements Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Financial Statements</h2>
              <div className="space-y-4">
                {financialStatements.map((statement) => (
                  <Card key={statement.year}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <h3 className="font-semibold">{statement.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {statement.type} • {statement.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quarterly Impact Reports Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Quarterly Impact Reports</h2>
              <div className="space-y-4">
                {impactReports.map((report) => (
                  <Card key={report.quarter}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Calendar className="h-8 w-8 text-primary" />
                          <div>
                            <h3 className="font-semibold">{report.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {report.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {report.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Additional Documents Section */}
            <Card>
              <CardHeader>
                <CardTitle>Other Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">IRS Form 990 (2024)</h4>
                      <p className="text-sm text-muted-foreground">Tax return document</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Strategic Plan 2024-2027</h4>
                      <p className="text-sm text-muted-foreground">Organizational strategy</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Board Member Roster</h4>
                      <p className="text-sm text-muted-foreground">Governance information</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Program Evaluation Report</h4>
                      <p className="text-sm text-muted-foreground">Impact assessment</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Information Section */}
            <Card className="bg-gradient-warm">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Need Additional Information?</h3>
                <p className="text-muted-foreground mb-6">
                  If you&apos;re looking for specific reports or documents not listed here, please contact us.
                </p>
                <Button size="lg">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
