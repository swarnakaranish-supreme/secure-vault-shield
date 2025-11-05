import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityLog {
  id: string;
  action_type: 'encrypt' | 'decrypt';
  file_name: string;
  file_size: number | null;
  created_at: string;
}

export function useActivityLog(userId: string | undefined) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    fetchActivities();

    // Set up realtime subscription
    const channel = supabase
      .channel('activity_log_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_log',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchActivities = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setActivities(data as ActivityLog[]);
    }
    setLoading(false);
  };

  const logActivity = async (actionType: 'encrypt' | 'decrypt', fileName: string, fileSize?: number) => {
    if (!userId) return;

    await supabase.from('activity_log').insert({
      user_id: userId,
      action_type: actionType,
      file_name: fileName,
      file_size: fileSize,
    });
  };

  return { activities, loading, logActivity };
}
