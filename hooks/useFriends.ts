import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { Friendship, PoopLog, Profile } from '../types/models';

type UseFriendsResult = {
  friendEmail: string;
  setFriendEmail: (value: string) => void;
  friendships: Friendship[];
  acceptedFriendships: Friendship[];
  incomingRequests: Friendship[];
  outgoingRequests: Friendship[];
  friendLogs: PoopLog[];
  profilesById: Record<string, Profile>;
  friendsLoading: boolean;
  friendActionLoading: boolean;
  friendsError: string | null;
  handleAddFriend: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
};

export const useFriends = (user: User | null): UseFriendsResult => {
  const [friendEmail, setFriendEmail] = useState('');
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [friendLogs, setFriendLogs] = useState<PoopLog[]>([]);
  const [profilesById, setProfilesById] = useState<Record<string, Profile>>({});
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendActionLoading, setFriendActionLoading] = useState(false);
  const [friendsError, setFriendsError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    if (!user) return;
    setFriendsLoading(true);
    setFriendsError(null);

    const { data: friendshipsData, error: friendshipsError } = await supabase
      .from('friendships')
      .select('*')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (friendshipsError) {
      setFriendsError(friendshipsError.message);
      setFriendsLoading(false);
      return;
    }

    const updatedFriendships = friendshipsData ?? [];
    setFriendships(updatedFriendships);

    const accepted = updatedFriendships.filter((friendship) => friendship.status === 'accepted');
    const allFriendIds = Array.from(
      new Set(
        updatedFriendships.map((friendship) =>
          friendship.user_id === user.id ? friendship.friend_id : friendship.user_id
        )
      )
    );
    const acceptedFriendIds = accepted.map((friendship) =>
      friendship.user_id === user.id ? friendship.friend_id : friendship.user_id
    );

    if (allFriendIds.length === 0) {
      setFriendLogs([]);
      setProfilesById({});
      setFriendsLoading(false);
      return;
    }

    const { data: friendProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .in('id', allFriendIds);

    if (profileError) {
      setFriendsError(profileError.message);
    }

    if (friendProfiles) {
      const profileMap = friendProfiles.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, Profile>);
      setProfilesById(profileMap);
    }

    if (acceptedFriendIds.length > 0) {
      const { data: logsData, error: logsError } = await supabase
        .from('poop_logs')
        .select('*')
        .in('user_id', acceptedFriendIds)
        .order('occurred_at', { ascending: false });

      if (logsError) {
        setFriendsError(logsError.message);
      }

      setFriendLogs(logsData ?? []);
    } else {
      setFriendLogs([]);
    }

    setFriendsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setFriendEmail('');
      setFriendships([]);
      setFriendLogs([]);
      setProfilesById({});
      setFriendsLoading(false);
      setFriendActionLoading(false);
      setFriendsError(null);
      return;
    }

    void loadFriends();
  }, [user, loadFriends]);

  const handleAddFriend = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!user) return;
      const email = friendEmail.trim().toLowerCase();
      if (!email) return;
      if (email === user.email?.toLowerCase()) {
        setFriendsError('You cannot add yourself.');
        return;
      }

      setFriendActionLoading(true);
      setFriendsError(null);

      const { data: friendProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url')
        .ilike('email', email)
        .maybeSingle();

      if (profileError) {
        setFriendsError(profileError.message);
        setFriendActionLoading(false);
        return;
      }

      if (!friendProfile) {
        setFriendsError('No user found with that email.');
        setFriendActionLoading(false);
        return;
      }

      const existingFriendship = friendships.some((friendship) => {
        const isDirect = friendship.user_id === user.id && friendship.friend_id === friendProfile.id;
        const isReverse = friendship.user_id === friendProfile.id && friendship.friend_id === user.id;
        return isDirect || isReverse;
      });

      if (existingFriendship) {
        setFriendsError('You already have a pending or accepted request with this user.');
        setFriendActionLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('friendships').insert({
        user_id: user.id,
        friend_id: friendProfile.id,
        status: 'pending',
      });

      if (insertError) {
        setFriendsError(insertError.message);
        setFriendActionLoading(false);
        return;
      }

      setFriendEmail('');
      await loadFriends();
      setFriendActionLoading(false);
    },
    [user, friendEmail, friendships, loadFriends]
  );

  const acceptRequest = useCallback(
    async (requestId: string) => {
      if (!user) return;
      setFriendActionLoading(true);
      setFriendsError(null);
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) {
        setFriendsError(error.message);
        setFriendActionLoading(false);
        return;
      }

      await loadFriends();
      setFriendActionLoading(false);
    },
    [user, loadFriends]
  );

  const declineRequest = useCallback(
    async (requestId: string) => {
      if (!user) return;
      setFriendActionLoading(true);
      setFriendsError(null);
      const { error } = await supabase.from('friendships').delete().eq('id', requestId);

      if (error) {
        setFriendsError(error.message);
        setFriendActionLoading(false);
        return;
      }

      await loadFriends();
      setFriendActionLoading(false);
    },
    [user, loadFriends]
  );

  const acceptedFriendships = useMemo(
    () => friendships.filter((friendship) => friendship.status === 'accepted'),
    [friendships]
  );
  const incomingRequests = useMemo(
    () => friendships.filter((friendship) => friendship.status === 'pending' && friendship.friend_id === user?.id),
    [friendships, user?.id]
  );
  const outgoingRequests = useMemo(
    () => friendships.filter((friendship) => friendship.status === 'pending' && friendship.user_id === user?.id),
    [friendships, user?.id]
  );

  return {
    friendEmail,
    setFriendEmail,
    friendships,
    acceptedFriendships,
    incomingRequests,
    outgoingRequests,
    friendLogs,
    profilesById,
    friendsLoading,
    friendActionLoading,
    friendsError,
    handleAddFriend,
    acceptRequest,
    declineRequest,
  };
};
