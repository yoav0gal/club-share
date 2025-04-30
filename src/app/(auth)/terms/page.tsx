import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { TermsOfServiceContent } from '@/components/terms-of-service-content';

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TermsOfServiceContent />
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
