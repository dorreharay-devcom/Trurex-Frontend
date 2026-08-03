export function generateRexImageStoragePath(userId: string, originalFilename: string): string {
  const ext = originalFilename.includes('.')
    ? originalFilename
        .split('.')
        .pop()!
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') || 'jpg'
    : 'jpg';
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  return `${userId}/${id}.${ext}`;
}
