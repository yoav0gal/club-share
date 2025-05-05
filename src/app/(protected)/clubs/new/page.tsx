'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ClubForm } from '@/components/club-form';
import { Button } from '@/components/ui/button';

export default function AddClubPage() {
  const router = useRouter();
  const [defaultValues] = useState({});

  const handleSubmit = () => {
    router.push('/clubs/new/share');
  };

  return (
    <div className="flex flex-col items-center justify-start pt-4 md:pt-6 px-4 w-full">
      <div className="w-full max-w-lg">
        <ClubForm
          action={handleSubmit}
          defaultValues={defaultValues}
          // fieldErrors={state.fieldErrors} // Uncomment when state management is active
          title="Club Details"
        >
          <Button type="submit" className="w-full">
            Next
          </Button>
        </ClubForm>
      </div>
    </div>
  );
}
