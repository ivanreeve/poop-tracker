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
  deleteLog: (id: string) => Promise<boolean>;
  restoreLog: (log: PoopLog) => Promise<boolean>;
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

  const deleteLog = useCallback(
    async (id: string) => {
      if (!user) return false;
      // Optimistic update
      const previousLogs = [...logs];
      setLogs((prev) => prev.filter((log) => log.id !== id));

      const { error } = await supabase.from('poop_logs').delete().eq('id', id);

      if (error) {
        setLogsError(error.message);
        setLogs(previousLogs); // Revert on error
        return false;
      }

      return true;
    },
    [user, logs]
  );

  const restoreLog = useCallback(
    async (log: PoopLog) => {
      if (!user) return false;
      // Optimistic update
      setLogs((prev) => {
        const newLogs = [log, ...prev].sort((a, b) => 
          new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
        );
        return newLogs;
      });

      const { error } = await supabase
        .from('poop_logs')
        .insert({
          id: log.id, // Try to preserve ID if possible, or let DB generate new one if policy allows. 
                      // Usually better to let DB handle ID and just re-insert data. 
                      // But for undo, strict ID restoration might be needed if other things link to it. 
                      // For now, let's just re-insert data.
          user_id: user.id,
          type: log.type,
          notes: log.notes,
          occurred_at: log.occurred_at,
        });

      if (error) {
        // If restoring with same ID fails (e.g. key conflict though unlikely after delete), 
        // try without ID to let Postgres generate a new one.
        const { data: newData, error: retryError } = await supabase
          .from('poop_logs')
          .insert({
            user_id: user.id,
            type: log.type,
            notes: log.notes,
            occurred_at: log.occurred_at,
          })
          .select()
          .single();

        if (retryError) {
          setLogsError(retryError.message);
          setLogs((prev) => prev.filter((l) => l.id !== log.id)); // Revert optimistic add
          return false;
        }
        
        // Update the optimistic log with the real one from DB
        setLogs((prev) => prev.map(l => l.id === log.id ? newData : l));
        return true;
      }
      
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
    deleteLog,
    restoreLog,
    refreshLogs: loadLogs,
  };
};
