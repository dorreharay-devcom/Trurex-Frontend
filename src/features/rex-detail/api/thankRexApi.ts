import { Backend, unwrap } from '~/shared/api/client';

export async function thankRex(rexId: string): Promise<void> {
  unwrap(
    await Backend.rpc('thank_rex', {
      p_rex_id: rexId,
    }),
  );
}
