const STORAGE_KEY = 'cria_visitor_token';

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${oneYear}; path=/; SameSite=Lax`;
}

export function getVisitorToken(): string {
  let token = localStorage.getItem(STORAGE_KEY) || readCookie(STORAGE_KEY);

  if (!token) {
    token = crypto.randomUUID();
  }

  localStorage.setItem(STORAGE_KEY, token);
  writeCookie(STORAGE_KEY, token);

  return token;
}
