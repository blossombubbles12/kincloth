'use client';

import React, { useRef, useEffect, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VideoPlayerProps {
  src: string;
  className?: string;
  isActive: boolean;
  fallbackImage?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className, isActive, fallbackImage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current && src) {
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            if (err.name !== 'AbortError') {
              console.warn('Autoplay failed:', err);
            }
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, src]);


  return (
    <div className={cn("relative w-full h-full bg-black overflow-hidden", className)}>
      {src ? (
        <video
          ref={videoRef}
          src={src}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-700",
            isLoaded && !hasError ? "opacity-100" : "opacity-0"
          )}
          loop
          muted
          playsInline
          onLoadedData={() => {
            setIsLoaded(true);
            setHasError(false);
          }}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
        />
      ) : null}

      {(!isLoaded || hasError || !src) && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          {(hasError || !src) ? (
            fallbackImage ? (
              <img 
                src={fallbackImage} 
                alt="Fallback" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-zinc-500 text-sm">No media available</div>
            )
          ) : (
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          )}
        </div>
      )}
    </div>
  );
};
