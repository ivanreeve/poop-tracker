import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { PoopLog } from '../types/models';

type UseLogsResult = {
  logs: PoopLog[];
  logsLoading: boolean;
  isSavingLog: boolean;
  logsError: string | null;
  addLog: (type: number) => Promise<boolean>;
  refreshLogs: () => Promise<void>;
};

export const useLogs = (user: User | null): UseLogsResult => {
  const [logs, setLogs] = useState<PoopLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [isSavingLog, setIsSavingLog] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    if (!user) return;
    setLogsLoading(true);
    setLogsError(null);
    const { data, error } = await supabase
      .from('poop_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('occurred_at', { ascending: false });

    if (error) {
      setLogsError(error.message);
      setLogsLoading(false);
      return;
    }

    setLogs(data ?? []);
    setLogsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLogs([]);
      setLogsLoading(false);
      setIsSavingLog(false);
      setLogsError(null);
      return;
    }

    void loadLogs();
  }, [user, loadLogs]);

  const addLog = useCallback(
    async (type: number) => {
      if (!user) return false;
      setIsSavingLog(true);
      setLogsError(null);
      const { data, error } = await supabase
        .from('poop_logs')
        .insert({
          user_id: user.id,
          type,
          notes: '',
          occurred_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        setLogsError(error.message);
        setIsSavingLog(false);
        return false;
      }

      setLogs((prev) => [data, ...prev]);
      setIsSavingLog(false);
      return true;
    },
    [user]
  );

  return {
    logs,
    logsLoading,
    isSavingLog,
    logsError,
    addLog,
    refreshLogs: loadLogs,
  };
};
