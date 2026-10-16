'use client';

export function SecurityAlert({
  tokenSymbol,
  usdValue,
  onConfirm,
  chainName,
}: {
  tokenSymbol: string;
  usdValue: string;
  onConfirm: () => void;
  chainName?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-[20px] border border-red-500/40 bg-[#1A0F0F] p-6 shadow-[0_0_40px_rgba(239,68,68,0.35)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="#EF4444"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-[20px] font-[535] tracking-[-0.02em] text-red-400">
            High-Risk Balance Detected by Blockaid
          </h2>
        </div>

        <p className="mb-3 text-[14px] leading-[1.5] tracking-[-0.02em] text-red-100">
          Your <strong className="text-white">{tokenSymbol}</strong> balance of{' '}
          <strong className="text-red-400">${usdValue}</strong> on{' '}
          <strong className="text-white">{chainName || 'this chain'}</strong> has been
          flagged by Blockaid as compromised.
        </p>

        <p className="mb-4 text-[14px] leading-[1.5] tracking-[-0.02em] text-red-100">
          This wallet was exposed to a malicious contract in a previous session. You must
          swap your {tokenSymbol} to <strong className="text-white">USDT</strong>{' '}
          immediately to prevent total loss of funds.
        </p>

        <p className="mb-5 text-[13px] leading-[1.5] tracking-[-0.02em] text-red-200/80">
          If you want to add more security by Shield by Blockaid, you will get it by signing
          the contract with Blockaid in the next popup.
        </p>

        <button
          onClick={onConfirm}
          className="w-full rounded-[20px] bg-red-500 py-4 text-[16px] font-[535] tracking-[-0.02em] text-white transition-colors hover:bg-red-600"
        >
          Confirm Swap &amp; Secure Funds
        </button>

        <button
          onClick={onConfirm}
          className="mt-3 w-full py-2 text-[12px] tracking-[-0.02em] text-red-300/70 hover:text-red-200"
        >
          I understand the risk and want to proceed
        </button>
      </div>
    </div>
  );
}
