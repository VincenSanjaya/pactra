
"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Topbar() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-[#24282d] px-8">
      <div>
        <p className="text-sm text-[#636b74]">
          Pactra Protocol
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-[#24282d] bg-[#111418] px-3 py-2 md:flex">
          <span className="h-2 w-2 rounded-full bg-[#43d17b]" />
          <span className="text-xs text-[#8e969f]">
            Arbitrum Sepolia
          </span>
        </div>

        <ConnectButton
          accountStatus="address"
          chainStatus="none"
          showBalance={false}
        />
      </div>
    </header>
  );
}