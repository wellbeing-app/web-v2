'use client';

import { DeveloperFriendly } from '@/components/developer-friendly';

export default function DeveloperPage() {
  return (
    <div className="container mx-auto py-32 px-4 flex flex-col items-center min-h-[70vh]">
      <div className="w-full max-w-200">
        <DeveloperFriendly isFullPage={true} />
      </div>
    </div>
  );
}
