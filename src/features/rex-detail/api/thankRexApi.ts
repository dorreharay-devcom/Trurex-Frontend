import { Backend, unwrap } from '~/shared/api/client';
import type { ThankCopyOption } from '~/features/rex-detail/types/rexDetail';

export async function thankRex(rexId: string, message?: string | null): Promise<void> {
  unwrap(
    await Backend.rpc('thank_rex', {
      p_rex_id: rexId,
      p_message: message ?? null,
    }),
  );
}

export async function getThankCopyOptions(): Promise<ThankCopyOption[]> {
  const data = unwrap(await Backend.rpc('get_thank_copy_options'));
  return Array.isArray(data) ? (data as ThankCopyOption[]) : [];
}
