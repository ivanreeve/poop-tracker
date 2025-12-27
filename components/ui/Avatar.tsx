/* eslint-disable @next/next/no-img-element */
import React from 'react';

type AvatarProps = {
  src?: string | null;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
  imgClassName?: string;
};

export const Avatar = ({ src, alt, fallback, className = '', imgClassName = '' }: AvatarProps) => (
  <div className={className}>
    {src ? (
      <img src={src} alt={alt} className={imgClassName || 'w-full h-full object-cover'} />
    ) : (
      fallback
    )}
  </div>
);
