export default function TokenSelectorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 p-4">
      <div className="w-full max-w-md rounded-[20px] border border-[#F2F2F2] bg-[#FFFFFF] p-4 shadow-swap">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[18px] font-[535] leading-[1.15] tracking-[-0.02em] text-[#222222]">Select a token</div>
          <button onClick={onClose} className="text-[#666666]">✕</button>
        </div>
        <div className="space-y-2">
          {['ETH', 'USDT', 'USDC', 'DAI', 'WBTC'].map((token) => (
            <button
              key={token}
              className="flex w-full items-center justify-between rounded-[20px] border border-[#F2F2F2] bg-[#F9F9F9] px-3 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF37C7] text-[12px] font-[535] text-white">
                  {token.slice(0, 1)}
                </div>
                <div>
                  <div className="text-[14px] font-[535] text-[#222222]">{token}</div>
                  <div className="text-[13px] text-[#666666]">{token === 'ETH' ? 'Ethereum' : 'Stablecoin'}</div>
                </div>
              </div>
              <div className="text-[13px] text-[#666666]">{token === 'ETH' ? '1.23' : '0.00'}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
