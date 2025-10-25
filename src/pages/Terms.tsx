import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: October 25, 2024
          </p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Agreement to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  By accessing or using the CharityZ website and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use of Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold">Eligibility</h3>
                <p>
                  You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you meet this age requirement.
                </p>

                <h3 className="font-semibold mt-4">Acceptable Use</h3>
                <p>You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit any harmful or malicious code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use our Services for any fraudulent purpose</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Impersonate any person or entity</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold">Processing</h3>
                <p>
                  All donations are processed securely through our third-party payment processors. CharityZ does not store your complete payment card information.
                </p>

                <h3 className="font-semibold mt-4">Tax Deductibility</h3>
                <p>
                  CharityZ is a registered 501(c)(3) organization. Donations may be tax-deductible to the extent allowed by law. You will receive a receipt for tax purposes after making a donation.
                </p>

                <h3 className="font-semibold mt-4">Refund Policy</h3>
                <p>
                  All donations are final and non-refundable unless required by law. If you believe there has been an error in processing your donation, please contact us at donations@charityz.org within 30 days.
                </p>

                <h3 className="font-semibold mt-4">Use of Funds</h3>
                <p>
                  While we will make every effort to honor donor-designated contributions, CharityZ retains discretion to direct funds where they are most needed if the designated program is fully funded or discontinued.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volunteer Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you register as a volunteer, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information in your volunteer application</li>
                  <li>Undergo any required background checks or training</li>
                  <li>Follow all policies and guidelines provided by CharityZ</li>
                  <li>Maintain confidentiality of sensitive information</li>
                  <li>Represent CharityZ professionally and ethically</li>
                </ul>
                <p className="mt-4">
                  CharityZ reserves the right to refuse or terminate volunteer participation at any time for any reason.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you create an account on our platform, you are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintaining the security of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                  <li>Providing accurate and up-to-date information</li>
                </ul>
                <p className="mt-4">
                  We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our discretion.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  All content on our website, including text, graphics, logos, images, and software, is the property of CharityZ or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="mt-4">
                  You may not reproduce, distribute, modify, or create derivative works from our content without express written permission from CharityZ.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disclaimer of Warranties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our Services are provided "as is" and "as available" without any warranties of any kind, either express or implied. CharityZ does not warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The Services will be uninterrupted or error-free</li>
                  <li>Defects will be corrected</li>
                  <li>The Services are free of viruses or other harmful components</li>
                  <li>Results obtained from using the Services will be accurate or reliable</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To the fullest extent permitted by law, CharityZ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your access to or use of or inability to access or use the Services</li>
                  <li>Any conduct or content of any third party on the Services</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indemnification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  You agree to indemnify, defend, and hold harmless CharityZ, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the Services or your violation of these Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Services after such changes constitutes acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mt-4">
                  <p><strong>CharityZ</strong></p>
                  <p>Email: legal@charityz.org</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Address: 123 Hope Street, City, State 12345</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
