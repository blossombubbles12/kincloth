'use client';

import React from 'react';
import { Skeleton, ProductCardSkeleton } from '@/components/Skeleton';
import { MobileView } from '@/components/MobileView';

export default function Loading() {
  return (
    <div style={{ minHeight: '100svh', background: 'var(--background)' }}>
      {/* Mobile Skeleton */}
      <div className="lg:hidden">
        <MobileView onOpenCart={() => {}}>
          <div style={{ padding: '16px' }}>
            <Skeleton width="100%" height={200} borderRadius={24} style={{ marginBottom: 24 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
               <Skeleton width={100} height={20} />
               <Skeleton width={60} height={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[1,2,3].map(n => <ProductCardSkeleton key={n} mobile />)}
            </div>
          </div>
        </MobileView>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden lg:block">
        <header style={{
          height: 64, borderBottom: '1px solid var(--border)', background: 'var(--header-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <Skeleton width={140} height={32} borderRadius={10} />
          </div>
          <Skeleton width={400} height={40} borderRadius={10} />
          <div style={{ display: 'flex', gap: 12 }}>
            <Skeleton width={40} height={40} borderRadius={12} /><Skeleton width={80} height={40} borderRadius={12} />
          </div>
        </header>

        <div style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
             <Skeleton width={200} height={24} />
             <Skeleton width={100} height={24} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {[1,2,3,4,5,6,7,8].map(n => <ProductCardSkeleton key={n} />)}
          </div>
        </div>
      </div>

      <style>{`
        .lg\\:hidden { display: block; }
        .hidden { display: none; }
        @media (min-width: 1024px) {
          .lg\\:hidden { display: none !important; }
          .hidden { display: block !important; }
          .lg\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}
