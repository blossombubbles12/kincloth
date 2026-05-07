'use client';

import React from 'react';
import { Skeleton, ProductCardSkeleton } from '@/components/Skeleton';
import { MobileView } from '@/components/MobileView';

export default function Loading() {
  return (
    <div className="flex flex-col h-dvh bg-[var(--background)] overflow-hidden">
      {/* Mobile Skeleton */}
      <div className="lg:hidden flex flex-col h-full overflow-hidden">
        <header className="h-[60px] border-b-[2px] border-[var(--border)] bg-[var(--header-bg)] flex items-center px-4">
          <Skeleton width={100} height={24} />
        </header>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
           {[1,2,3,4].map(n => <ProductCardSkeleton key={n} mobile />)}
        </div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden lg:flex flex-col h-full">
        <header style={{
          height: 64, borderBottom: '1px solid var(--border)', background: 'var(--header-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <Skeleton width={120} height={36} borderRadius={10} />
             <Skeleton width={100} height={24} />
          </div>
          <Skeleton width={400} height={40} borderRadius={10} />
          <div style={{ display: 'flex', gap: 12 }}>
            <Skeleton width={40} height={40} borderRadius={12} /><Skeleton width={80} height={40} borderRadius={12} />
          </div>
        </header>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr 320px' }}>
          <div style={{ padding: 24, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Skeleton width="40%" height={20} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3,4].map(i => <Skeleton key={i} width="100%" height={24} />)}
            </div>
            <Skeleton width="40%" height={20} style={{ marginTop: 20 }} />
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3,4].map(i => <Skeleton key={i} width="100%" height={24} />)}
            </div>
          </div>
          <div style={{ padding: 32, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
               <Skeleton width={200} height={20} />
               <Skeleton width={150} height={40} borderRadius={10} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
              {[1,2,3,4,5,6].map(n => <ProductCardSkeleton key={n} />)}
            </div>
          </div>
          <div style={{ padding: 20, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Skeleton width="100%" height={200} borderRadius={20} />
            <Skeleton width="100%" height={150} borderRadius={20} />
            <Skeleton width="100%" height={250} borderRadius={20} />
          </div>
        </div>
      </div>

    </div>
  );
}
