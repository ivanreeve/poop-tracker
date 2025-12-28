"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JuicyButton } from '../../components/ui/JuicyButton';
import { useAuth } from '../../hooks/useAuth';

export default function SignInPage() {
  const { user, authLoading, authError, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/');
    }
  }, [authLoading, router, user]);

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    setAppHeight();
    window.addEventListener('resize', setAppHeight);

    return () => {
      window.removeEventListener('resize', setAppHeight);
    };
  }, []);

  return (
    <div className="min-h-[var(--app-height,100svh)] bg-[#5c1916] font-sans text-slate-800 flex flex-col">
      <div className="flex-1" />

      <div className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="w-full max-w-2xl mx-auto">
          {authError && (
            <div className="mb-4 bg-white/80 border-2 border-[#ead2cb] rounded-2xl p-3 text-xs sm:text-sm font-bold text-[#3f0f0d]">
              {authError}
            </div>
          )}
          <JuicyButton
            variant="outline"
            size="lg"
            fullWidth
            onClick={signInWithGoogle}
            disabled={authLoading}
            className="bg-white text-[#352315] border-gray-200 hover:bg-gray-50"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              width="20"
              height="20"
              viewBox="0 0 48 48"
              className="shrink-0"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083h-1.861V20H24v8h11.303c-1.651 4.657-6.306 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.155 7.958 3.042l5.657-5.657C34.048 6.053 29.208 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20c11.045 0 20-8.955 20-20 0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.465 16.108 18.927 12.5 24 12.5c3.059 0 5.842 1.155 7.958 3.042l5.657-5.657C34.048 6.053 29.208 4 24 4 16.318 4 9.656 8.307 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.191-5.238C29.137 35.091 26.695 36.5 24 36.5c-4.961 0-9.19-3.163-10.76-7.579l-6.491 5.005C9.922 39.597 16.45 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083h-1.861V20H24v8h11.303c-.75 2.119-2.215 3.927-4.085 5.265l6.191 5.238C39.631 35.238 44 30.002 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            {authLoading ? 'CHECKING SESSION...' : 'SIGN IN WITH GOOGLE'}
          </JuicyButton>
          <p className="mt-3 text-center text-[11px] sm:text-xs font-semibold text-white">
            We only use Google to secure your logbook.
          </p>
        </div>
      </div>
    </div>
  );
}
