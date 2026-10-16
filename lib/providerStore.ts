export const STORAGE_KEY = 'unii_provider_rdns';

export function setSelectedProvider(rdns: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, rdns);
}

export function saveProvider(rdns: string) {
  setSelectedProvider(rdns);
}

export function getProviderRdns(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function clearProvider() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}
