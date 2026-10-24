// Public endpoint only. Database/admin/encryption secrets must never use NEXT_PUBLIC_.
export function apiEndpoint(path: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '');
  return base ? `${base}${path.replace(/^\/api/, '')}` : path;
}
