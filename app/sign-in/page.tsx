"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, ShieldCheck, Sparkles, Users } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-flo font-sans text-slate-800">
      <div className="min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-2xl mx-auto flex flex-col flex-1">
          <header className="flex items-center gap-3">
            <div className="bg-[#FF8096] p-3 rounded-2xl shadow-sm">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-700 tracking-tight">
                PoopPal
              </h1>
              <p className="text-xs sm:text-sm font-bold text-gray-400">
                Keep tabs on your gut and your glow.
              </p>
            </div>
          </header>

          <section className="mt-10 bg-white/90 border-2 border-[#FFE8EC] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#A6D8D4] p-3 rounded-2xl">
                <ShieldCheck size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-700">
                  Sign in to keep your streaks safe
                </h2>
                <p className="text-sm sm:text-base font-bold text-gray-400">
                  Log entries, compare stats, and share updates with friends without losing your progress.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Daily snapshots',
                  description: 'Quick logs with playful Bristol tracking.',
                  icon: Flame,
                },
                {
                  title: 'Friend circles',
                  description: 'See how your crew is doing at a glance.',
                  icon: Users,
                },
                {
                  title: 'Health patterns',
                  description: 'Spot trends and celebrate your wins.',
                  icon: Sparkles,
                },
                {
                  title: 'Secure sign-in',
                  description: 'Google keeps everything synced and safe.',
                  icon: ShieldCheck,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-start gap-3"
                >
                  <div className="bg-[#FFF0F3] p-2 rounded-xl">
                    <item.icon size={18} className="text-[#FF8096]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-700">{item.title}</h3>
                    <p className="text-xs font-bold text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {authError && (
            <div className="mt-4 bg-white/80 border-2 border-[#FFE8EC] rounded-2xl p-3 text-xs sm:text-sm font-bold text-[#D65D73]">
              {authError}
            </div>
          )}

          <div className="mt-auto pt-10 pb-6">
            <JuicyButton
              variant="outline"
              size="lg"
              fullWidth
              onClick={signInWithGoogle}
              disabled={authLoading}
              className="bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
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
              {authLoading ? 'CHECKING SESSION...' : 'CONTINUE WITH GOOGLE'}
            </JuicyButton>
            <p className="mt-3 text-center text-[11px] sm:text-xs font-semibold text-gray-400">
              We only use Google to secure your logbook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
