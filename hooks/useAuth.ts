import { useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../types/models';

type UseAuthResult = {
  user: User | null;
  profile: Profile | null;
  authLoading: boolean;
  authError: string | null;
  profileError: string | null;
  setAuthError: (message: string | null) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  greetingName: string;
};

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
      if (error) {
        setAuthError(error.message);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setUser(nextSession?.user ?? null);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileError(null);
      return;
    }

    setAuthError(null);

    const upsertProfile = async () => {
      setProfileError(null);
      const metadata = user.user_metadata ?? {};
      const fullName =
        metadata.full_name ||
        metadata.name ||
        metadata.preferred_username ||
        user.email?.split('@')[0] ||
        'Friend';
      const avatarUrl = metadata.avatar_url || metadata.picture || null;

      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            email: user.email,
            full_name: fullName,
            avatar_url: avatarUrl,
          },
          { onConflict: 'id' }
        )
        .select()
        .single();

      if (error) {
        setProfileError(error.message);
        return;
      }

      setProfile(data);
    };

    void upsertProfile();
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setAuthError(error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthError(null);
    await supabase.auth.signOut();
  }, []);

  const greetingName = useMemo(() => {
    return (
      profile?.full_name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split('@')[0] ||
      'Friend'
    );
  }, [profile, user]);

  return {
    user,
    profile,
    authLoading,
    authError,
    profileError,
    setAuthError,
    signInWithGoogle,
    signOut,
    greetingName,
  };
};
