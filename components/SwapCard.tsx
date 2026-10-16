'use client';

import { useState } from 'react';
import { WalletPickerModal } from './WalletPickerModal';

export function SwapCard() {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[480px] rounded-[20px] border border-[#F2F2F2] bg-white p-1 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
      <div className="rounded-[16px] bg-[#F9F9F9] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[14px] text-[#666666] tracking-[-0.02em]">Sell</span>
          <span className="text-[14px] text-[#666666] tracking-[-0.02em]">Balance: 0</span>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="0"
            className="w-full bg-transparent text-[36px] font-[485] tracking-[-0.02em] text-[#222222] outline-none"
          />
          <button className="flex items-center gap-2 rounded-full border border-[#F2F2F2] bg-white px-3 py-2">
            <span className="text-[14px] font-[535] tracking-[-0.02em]">Select</span>
          </button>
        </div>
      </div>

      <div className="my-1 flex justify-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F2F2F2] bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="rounded-[16px] bg-[#F9F9F9] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[14px] text-[#666666] tracking-[-0.02em]">Buy</span>
          <span className="text-[14px] text-[#666666] tracking-[-0.02em]">Balance: 0</span>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="0"
            className="w-full bg-transparent text-[36px] font-[485] tracking-[-0.02em] text-[#222222] outline-none"
          />
          <button className="flex items-center gap-2 rounded-full border border-[#F2F2F2] bg-white px-3 py-2">
            <span className="text-[14px] font-[535] tracking-[-0.02em]">Select</span>
          </button>
        </div>
      </div>

      <button
        onClick={() => setPickerOpen(true)}
        className="mt-2 w-full rounded-[20px] bg-[#FF37C7] py-4 text-[16px] font-[535] tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
      >
        Connect Wallet
      </button>

      <WalletPickerModal open={pickerOpen} onOpenChange={setPickerOpen} />
    </div>
  );
}

export default SwapCard;
