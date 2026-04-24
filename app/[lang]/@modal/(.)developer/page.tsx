'use client';

import { DeveloperFriendly } from '@/components/developer-friendly';
import { ExpandedCard } from '@/components/expanded-card';

export default function InterceptedDeveloperPage() {
  return (
    <ExpandedCard layoutId="card-developer">
      <div className="pt-8">
        <DeveloperFriendly isFullPage={true} />
      </div>
    </ExpandedCard>
  );
}
