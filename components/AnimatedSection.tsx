
import React from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '' }) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-1000 ease-in-out motion-safe:transform motion-safe:translate-y-5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
