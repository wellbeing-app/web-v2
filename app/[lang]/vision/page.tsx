'use client';

import { Mission } from '@/components/mission';

export default function VisionPage() {
  return (
    <div className="container mx-auto py-32 px-4 flex flex-col items-center min-h-[70vh]">
      <div className="w-full max-w-200">
        <Mission isFullPage={true} />
      </div>
    </div>
  );
}
