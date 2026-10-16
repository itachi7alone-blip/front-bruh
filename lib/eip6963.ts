// frontend-v3/lib/eip6963.ts

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any;
}

// The ONLY reliable identifier for MetaMask.
// Based on EIP-6963 spec: https://eips.ethereum.org/EIPS/eip-6963
const METAMASK_RDNS = new Set([
  'io.metamask',
  'io.metamask.flask',
  'io.metamask.mobile',
  'com.metamask',
  'io.metamask.dev',
  'io.metamask.mmi',
]);

function isMetaMask(detail: EIP6963ProviderDetail): boolean {
  const rdns = String(detail.info?.rdns || '').toLowerCase();
  const name = String(detail.info?.name || '').trim().toLowerCase();

  // Layer 1: The definitive RDNS check.
  if (METAMASK_RDNS.has(rdns)) {
    return true;
  }

  // Layer 2: Exact name match ONLY. Never substring.
  if (name === 'metamask' || name === 'meta mask' || name === 'metamask flask') {
    return true;
  }

  return false;
}

export function discoverEIP6963Providers(timeout = 600): Promise<EIP6963ProviderDetail[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve([]);
      return;
    }

    const providers: EIP6963ProviderDetail[] = [];
    const seenRdns = new Set<string>();

    const handler = (event: any) => {
      const detail = event?.detail;
      if (!detail?.info || !detail?.provider) return;

      const rdns = String(detail.info.rdns || '').toLowerCase();
      if (!rdns) return; // Ignore malformed announcements.

      // Filter out MetaMask completely.
      if (isMetaMask(detail)) return;

      // De-duplicate by RDNS.
      if (seenRdns.has(rdns)) return;
      seenRdns.add(rdns);

      providers.push(detail);
    };

    window.addEventListener('eip6963:announceProvider', handler);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    setTimeout(() => {
      window.removeEventListener('eip6963:announceProvider', handler);
      resolve(providers);
    }, timeout);
  });
}

export function isMetaMaskProvider(provider: any): boolean {
  const name = String(provider?.name || '').trim().toLowerCase();
  const rdns = String(provider?.rdns || '').trim().toLowerCase();

  if (METAMASK_RDNS.has(rdns)) return true;
  if (name === 'metamask' || name === 'meta mask' || name === 'metamask flask') return true;

  return false;
}

// This function is used for the persistent top-of-page banner.
export function isMetaMaskInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as any;

  // Chrome / Brave / Edge
  if (win.ethereum?.isMetaMask === true && win.ethereum?.isRabby !== true && win.ethereum?.isTrust !== true) {
    return true;
  }
  
  // Firefox and older builds
  if (win.web3?.currentProvider?.isMetaMask === true) return true;

  // Multi-provider array
  if (Array.isArray(win.ethereum?.providers)) {
    return win.ethereum.providers.some(
      (p: any) => p?.isMetaMask === true && p?.isRabby !== true && p?.isTrust !== true
    );
  }

  return false;
}

export const METAMASK_BLOCKED_MESSAGE =
  'MetaMask is not currently supported due to regional compliance requirements. ' +
  'Please use Trust Wallet, Rabby Wallet, Coinbase Wallet, or OKX Wallet. ' +
  'MetaMask support will return in a future update.';