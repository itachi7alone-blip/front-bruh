'use client';

import { useState } from 'react';
import WalletPickerModal from '@/components/WalletPickerModal';
import { MetaMaskBanner } from './MetaMaskBanner';

export default function Navbar() {
  const tabs = ['Swap', 'Pool', 'Vote', 'Charts'];
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  return (
    <>
      <header className="h-[72px] border-b border-[#F2F2F2] bg-[#FFFFFF]">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF0FC]">
              <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7 4.7C13.1 4.7 10.8 6.5 9.5 9.1L7.1 14.7C6.2 16.7 6.8 19.1 8.6 20.2L10.5 21.4C12.1 22.4 14.1 21.9 15.1 20.4L17.5 16.9C17.9 16.3 18.9 16.3 19.4 16.8L22.4 19.8C23.8 21.2 26.2 21.2 27.6 19.8L28.4 19.1C29.6 17.9 29.6 15.8 28.3 14.6L26.6 12.9C25.3 11.6 25.1 9.4 26.1 7.8L28.3 3.8L24.4 6.7C22.3 8.3 19.5 8.2 17.5 6.4L15.7 4.7Z" fill="#FF37C7"/>
                <path d="M9.2 20.9L6.5 24.1C5.7 25 4.3 25.1 3.3 24.3C2.2 23.5 2.1 22 3 21L5.6 18.2C6.7 17 8.7 17.1 9.7 18.2L9.2 20.9Z" fill="#FF37C7"/>
                <path d="M13.9 15.9C15.2 15.9 16.3 14.8 16.3 13.5C16.3 12.2 15.2 11.1 13.9 11.1C12.6 11.1 11.5 12.2 11.5 13.5C11.5 14.8 12.6 15.9 13.9 15.9Z" fill="#FF37C7"/>
              </svg>
            </div>
            <div className="text-[18px] font-[535] leading-[1.15] text-[#222222]">UniiSwap</div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`text-[14px] font-[485] leading-[1.49] tracking-[-0.02em] ${tab === 'Swap' ? 'text-[#FF37C7]' : 'text-[#666666]'}`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full border border-[#F2F2F2] bg-[#FFFFFF] px-3 py-2 text-[14px] font-[485] text-[#222222]">
              <span>Ethereum</span>
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button
              onClick={() => setWalletModalOpen(true)}
              className="rounded-full bg-[#FF37C7] px-4 py-2 text-[14px] font-[535] text-white"
            >
              Connect
            </button>
          </div>
        </div>
      </header>
      <MetaMaskBanner />
      <WalletPickerModal open={walletModalOpen} onOpenChange={setWalletModalOpen} />
    </>
  );
}
