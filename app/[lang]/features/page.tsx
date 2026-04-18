'use client';

import { Features } from '@/components/features';

export default function FeaturesPage() {
  return (
    <div className="container mx-auto py-32 px-4 flex flex-col items-center min-h-[70vh]">
      <div className="w-full max-w-200">
        <Features />
      </div>
    </div>
  );
}
