import React from 'react';
import { Link } from 'react-router-dom';

export const ProvincialPortalFloatingButton: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-40 md:hidden">
      <div className="relative inline-flex">
        <div
          className="pointer-events-none absolute inset-0 rounded-xl bg-primary/25 shadow-[0_0_12px_4px_hsl(var(--primary)/0.35)] animate-pulse [animation-duration:2.8s]"
          aria-hidden
        />
        <Link
          to="/province"
          className="relative flex h-12 min-w-12 max-w-[5.25rem] items-center justify-center rounded-xl bg-primary px-2 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
          aria-label="Provincial Portal"
        >
          <span className="text-[10px] font-semibold leading-tight text-center">
            Provincial
            <br />
            Portal
          </span>
        </Link>
      </div>
    </div>
  );
};
