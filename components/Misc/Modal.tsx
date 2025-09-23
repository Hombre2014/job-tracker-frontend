'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useRef, useEffect, useCallback, MouseEventHandler } from 'react';

const Modal = ({
  children,
  stylings,
  onDismiss,
}: {
  children: React.ReactNode;
  stylings: string;
  onDismiss?: () => void;
}) => {
  const router = useRouter();
  const mouseDownInside = useRef(false);
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  // Track if mousedown started inside modal

  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss();
    } else {
      router.back();
    }
  }, [onDismiss, router]);

  // On mousedown, track if it started inside the modal content
  const onMouseDown: MouseEventHandler = useCallback((e) => {
    if (wrapper.current && wrapper.current.contains(e.target as Node)) {
      mouseDownInside.current = true;
    } else {
      mouseDownInside.current = false;
    }
  }, []);

  // On click (mouseup), only close if mousedown did NOT start inside
  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (
        (e.target === overlay.current || e.target === wrapper.current) &&
        !mouseDownInside.current
      ) {
        handleDismiss();
      }
      // Always reset after click
      mouseDownInside.current = false;
    },
    [handleDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    },
    [handleDismiss]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      onClick={onClick}
      onMouseDown={onMouseDown}
      className="fixed z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/60 p-10"
    >
      <div
        ref={wrapper}
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6',
          stylings
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
