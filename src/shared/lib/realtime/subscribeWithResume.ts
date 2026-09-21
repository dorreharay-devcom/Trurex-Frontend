import { AppState, type AppStateStatus } from 'react-native';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { Backend } from '~/shared/api/client';

type Options = {
  enabled: boolean;
  createChannel: () => RealtimeChannel;
  onSoftRefresh: () => void;
};

const RESUME_DEBOUNCE_MS = 400;

export function subscribeRealtimeWithResume(options: Options): () => void {
  if (!options.enabled) return () => {};

  let channel: RealtimeChannel | null = null;
  let disposed = false;
  let rebindTimer: ReturnType<typeof setTimeout> | null = null;
  let resumeTimer: ReturnType<typeof setTimeout> | null = null;

  const clearRebind = () => {
    if (rebindTimer == null) return;
    clearTimeout(rebindTimer);
    rebindTimer = null;
  };

  const clearResume = () => {
    if (resumeTimer == null) return;
    clearTimeout(resumeTimer);
    resumeTimer = null;
  };

  const detach = () => {
    if (!channel) return;
    const current = channel;
    channel = null;
    void Backend.removeChannel(current);
  };

  const scheduleRebind = () => {
    clearRebind();
    rebindTimer = setTimeout(() => {
      if (!disposed) attach();
    }, 1500);
  };

  const attach = () => {
    if (disposed) return;
    detach();
    const next = options.createChannel();
    channel = next;
    next.subscribe((status) => {
      if (disposed) return;
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        scheduleRebind();
      }
    });
  };

  const isLive = () =>
    channel != null && (channel.state === 'joined' || channel.state === 'joining');

  attach();

  const onAppState = (status: AppStateStatus) => {
    if (status !== 'active' || disposed) return;
    clearResume();
    resumeTimer = setTimeout(() => {
      resumeTimer = null;
      if (disposed || isLive()) return;
      options.onSoftRefresh();
      attach();
    }, RESUME_DEBOUNCE_MS);
  };

  const appSub = AppState.addEventListener('change', onAppState);

  return () => {
    disposed = true;
    clearRebind();
    clearResume();
    appSub.remove();
    detach();
  };
}
