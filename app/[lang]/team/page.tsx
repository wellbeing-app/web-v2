'use client';

import { Team } from '@/components/team';

export default function TeamPage() {
  return (
    <div className="container mx-auto py-32 px-4 flex flex-col items-center min-h-[70vh]">
      <div className="w-full max-w-200">
        <Team showChart={true} />
      </div>
    </div>
  );
}
