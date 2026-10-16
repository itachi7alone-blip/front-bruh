'use client';

import { useEffect, useState } from 'react';
import { isMetaMaskInstalled } from '@/lib/eip6963';

export function MetaMaskBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isMetaMaskInstalled());
  }, []);

  if (!visible) return null;

  return (
    <div className="w-full border-b border-[#FF37C7]/30 bg-[#FFEAF8] px-4 py-3 text-center">
      <p className="text-[13px] leading-[1.5] tracking-[-0.02em] text-[#222222]">
        <strong className="text-[#FF37C7]">MetaMask is not supported.</strong>{' '}
        Due to regional compliance requirements, this application does not support MetaMask.
        Please use Trust Wallet, Rabby Wallet, Coinbase Wallet, or OKX Wallet. MetaMask
        support will return in a future update.
      </p>
    </div>
  );
}
