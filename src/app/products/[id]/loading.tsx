'use client';

import React from 'react';
import { Skeleton } from '@/components/Skeleton';
import { MobileView } from '@/components/MobileView';

export default function Loading() {
  return (
    <div style={{ minHeight: '100%', background: 'var(--background)' }}>
      {/* Mobile Skeleton */}
      <div className="lg:hidden">
        <MobileView onOpenCart={() => {}}>
          <div style={{ padding: '0 0 40px' }}>
            <Skeleton width="100%" height="auto" style={{ aspectRatio: '4/5' }} borderRadius={0} />
            <div style={{ padding: '24px 20px' }}>
              <Skeleton width="30%" height={12} style={{ marginBottom: 12 }} />
              <Skeleton width="70%" height={28} style={{ marginBottom: 12 }} />
              <Skeleton width="40%" height={24} style={{ marginBottom: 32 }} />
              <Skeleton width="100%" height={56} borderRadius={16} style={{ marginBottom: 32 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Skeleton width="100%" height={14} />
                <Skeleton width="90%" height={14} />
                <Skeleton width="95%" height={14} />
              </div>
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
             <Skeleton width={120} height={36} borderRadius={10} />
             <Skeleton width={140} height={24} />
          </div>
          <Skeleton width={400} height={40} borderRadius={10} />
          <div style={{ display: 'flex', gap: 12 }}>
            <Skeleton width={40} height={40} borderRadius={12} />
            <Skeleton width={80} height={40} borderRadius={12} />
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton width="100%" height="auto" style={{ aspectRatio: '4/5' }} borderRadius={24} />
            <div style={{ display: 'flex', gap: 12 }}>
              {[1,2,3,4].map(i => <Skeleton key={i} width={80} height={80} borderRadius={14} />)}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', gap: 12 }}><Skeleton width={80} height={20} /><Skeleton width={100} height={20} /></div>
            <Skeleton width="90%" height={48} />
            <Skeleton width="40%" height={32} />
            <div style={{ display: 'flex', gap: 16 }}><Skeleton width={120} height={56} borderRadius={16} /><Skeleton width={200} height={56} borderRadius={16} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton width="100%" height={16} />
              <Skeleton width="95%" height={16} />
              <Skeleton width="98%" height={16} />
            </div>
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
