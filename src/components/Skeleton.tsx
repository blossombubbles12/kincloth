'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '100%', 
  borderRadius = 8,
  className,
  style 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: 'var(--border)',
        ...style
      }}
    />
  );
};

export const ProductCardSkeleton = ({ mobile = false }) => {
  if (mobile) {
    return (
      <div style={{
        display: 'flex',
        gap: 16,
        padding: 12,
        background: 'var(--card)',
        borderRadius: 16,
        border: '1px solid var(--border)',
        marginBottom: 12
      }}>
        <Skeleton width={100} height={130} borderRadius={12} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0' }}>
          <Skeleton width="40%" height={12} />
          <Skeleton width="90%" height={18} />
          {/* Removed description skeleton */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width={60} height={30} borderRadius={8} />
            <Skeleton width={30} height={30} borderRadius={8} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 20,
      border: '1px solid var(--border)',
      overflow: 'hidden',
      height: '100%'
    }}>
      <Skeleton width="100%" height="auto" style={{ aspectRatio: '4/5' }} borderRadius={0} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton width="30%" height={10} />
        <Skeleton width="80%" height={16} />
        {/* Removed description skeleton */}
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <Skeleton width="70%" height={36} borderRadius={10} />
          <Skeleton width="20%" height={36} borderRadius={10} />
        </div>
      </div>
    </div>
  );
};
