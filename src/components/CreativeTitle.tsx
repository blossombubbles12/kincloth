'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export function CreativeTitle() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.log("Creative title video play failed", e));
    }
  };

  useEffect(() => {
    handlePlay();
  }, []);

  return (
    <section className="relative h-[60vh] sm:h-[80vh] w-full overflow-hidden border-y-[3px] border-[var(--border)] bg-black">
      {/* Video Background */}
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/dtw0ajpwa/video/upload/v1778146885/kincloth2_gn9g1w.mp4"
        className="absolute inset-0 w-full h-full object-contain"
        autoPlay={true}
        loop={true}
        muted={true}
        playsInline={true}
        // @ts-ignore
        webkit-playsinline="true"
        preload="auto"
        onLoadedData={handlePlay}
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-black/40 via-transparent to-black/40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <div className="bg-[var(--accent)] text-black px-4 py-1 mb-6 border-[3px] border-black font-black text-xs uppercase tracking-[0.3em] neo-shadow transform -rotate-2">
            The New Core
          </div>
          
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-8">
            <span className="block">RAW</span>
            <span className="block text-outline-white text-transparent">AUTHENTIC</span>
            <span className="block text-[var(--accent)]">KINCLOTH</span>
          </h2>

          <div className="max-w-xl text-white/70 text-xs sm:text-sm font-bold uppercase tracking-widest leading-relaxed">
            Breaking the cycle of generic streetwear. Built for the culture, by the culture.
          </div>
        </motion.div>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] translate-x-16 -translate-y-16 rotate-45 border-[3px] border-black neo-shadow" />
      
      <style jsx>{`
        .text-outline-white {
          -webkit-text-stroke: 2px white;
        }
        @media (max-width: 640px) {
          .text-outline-white {
            -webkit-text-stroke: 1px white;
          }
        }
      `}</style>
    </section>
  );
}
