"use client"

import { useEffect, useState } from 'react';
import type { AppView } from '../types/models';
import { STOOL_TYPES } from '../lib/constants';
import { useAuth } from '../hooks/useAuth';
import { useFriends } from '../hooks/useFriends';
import { useLogs } from '../hooks/useLogs';
import { useStats } from '../hooks/useStats';
import { BottomNav } from '../components/layout/BottomNav';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { LogModal } from '../components/features/logging/LogModal';
import { AppContent } from '../components/features/app/AppContent';

export default function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    user,
    profile,
    authLoading,
    authError,
    profileError,
    setAuthError,
    signInWithGoogle,
    signOut,
    greetingName,
  } = useAuth();

  const { logs: userLogs, logsLoading, isSavingLog, logsError, addLog } = useLogs(user);

  const {
    friendEmail,
    setFriendEmail,
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
  } = useFriends(user);

  const stats = useStats(userLogs);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLogging) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLogging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogging]);

  useEffect(() => {
    if (!user) {
      setIsLogging(false);
      setSelectedType(null);
    }
  }, [user]);

  const openLogging = () => {
    if (!user) {
      setAuthError('Sign in to log your entries.');
      setView('profile');
      return;
    }
    setIsLogging(true);
  };

  const handleLog = async () => {
    if (!selectedType) return;
    const success = await addLog(selectedType);
    if (!success) return;
    setIsLogging(false);
    setSelectedType(null);
  };

  const visibleLogs = showAllLogs ? userLogs : userLogs.slice(0, 4);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-flo font-sans text-slate-800">
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        <Sidebar
          user={user}
          view={view}
          onChangeView={setView}
          onOpenLogging={openLogging}
        />

        <main className="flex-1 lg:ml-72 xl:ml-80">
          <Header
            streak={stats.streak}
            user={user}
            profile={profile}
            greetingName={greetingName}
            onSignIn={signInWithGoogle}
            onSignOut={signOut}
            onChangeView={setView}
          />

          <AppContent
            user={user}
            authLoading={authLoading}
            authError={authError}
            profileError={profileError}
            logsError={logsError}
            friendsError={friendsError}
            view={view}
            greetingName={greetingName}
            profile={profile}
            stats={stats}
            userLogs={userLogs}
            visibleLogs={visibleLogs}
            showAllLogs={showAllLogs}
            onToggleShowAll={() => setShowAllLogs((prev) => !prev)}
            logsLoading={logsLoading}
            friendLogs={friendLogs}
            acceptedFriendsCount={acceptedFriendships.length}
            friendsLoading={friendsLoading}
            profilesById={profilesById}
            friendEmail={friendEmail}
            onFriendEmailChange={setFriendEmail}
            onAddFriend={handleAddFriend}
            friendActionLoading={friendActionLoading}
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            acceptedFriendships={acceptedFriendships}
            onAcceptRequest={acceptRequest}
            onDeclineRequest={declineRequest}
            onSignOut={signOut}
            onSignIn={signInWithGoogle}
          />
        </main>

        <BottomNav view={view} onChangeView={setView} onOpenLogging={openLogging} />

        <LogModal
          open={isLogging}
          onClose={() => setIsLogging(false)}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          onConfirm={handleLog}
          isSaving={isSavingLog}
          stoolTypes={STOOL_TYPES}
        />
      </div>
    </div>
  );
}
