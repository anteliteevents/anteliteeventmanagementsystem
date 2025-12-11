/**
 * Skeleton Loader Component
 * 
 * Provides elegant loading placeholders for better UX.
 * 
 * @component
 */

import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  count?: number;
  variant?: 'text' | 'circular' | 'rectangular';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '0.5rem',
  className = '',
  count = 1,
  variant = 'rectangular',
}) => {
  const baseClass = `skeleton-loader skeleton-${variant} ${className}`;
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: variant === 'circular' ? '50%' : borderRadius,
  };

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={baseClass} style={style} />
        ))}
      </>
    );
  }

  return <div className={baseClass} style={style} />;
};

export default SkeletonLoader;

