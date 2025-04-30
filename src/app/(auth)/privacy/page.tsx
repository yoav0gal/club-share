import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { PrivacyPolicyContent } from '@/components/privacy-policy-content';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <PrivacyPolicyContent />
          <div className="mt-8 text-center">
            <Link href="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
