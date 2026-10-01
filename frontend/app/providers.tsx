"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import {
  WagmiProvider,
} from "wagmi";

import {
  arbitrumSepolia,
} from "wagmi/chains";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  useState,
} from "react";

const config = getDefaultConfig({
  appName: "Pactra",
  projectId: "PACTRA_DEMO_PROJECT",
  chains: [arbitrumSepolia],

  // Untuk app kita sekarang, lebih simpel biarkan
  // wallet state dipulihkan di client browser.
  ssr: false,
});

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () => new QueryClient()
  );

  return (
    <WagmiProvider
      config={config}
      reconnectOnMount={true}
    >
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}