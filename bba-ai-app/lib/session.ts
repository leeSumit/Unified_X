export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('unaited-session-id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('unaited-session-id', id);
  }
  return id;
}
