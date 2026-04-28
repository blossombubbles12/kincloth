'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export function ReelsToggle() {
  return (
    <motion.div
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}
    >
      <Link href="/reels" style={{ textDecoration: 'none' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 24px',
          borderRadius: '100px',
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          boxShadow: '0 12px 32px rgba(124, 58, 237, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
          color: '#fff',
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: '-0.02em',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Play size={12} fill="white" style={{ marginLeft: 2 }} />
          </div>
          REELS MODE
          <div style={{
            padding: '2px 6px', borderRadius: 4, background: '#fff', color: '#7c3aed',
            fontSize: 9, fontWeight: 900
          }}>
            NEW
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
