"use client";

import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { type AppConfig } from '@coinbase/onchainkit'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { http } from "viem";
import { WagmiProvider, createConfig } from "wagmi";
import { base, arbitrum, avalanche, polygon } from "wagmi/chains";
import { BetSwirlSDKProvider, TokenProvider, BalanceProvider } from "@betswirl/ui-react";

const CHAINS = [base, polygon, arbitrum, avalanche] as const;
const SUPPORTED_CHAIN_IDS = CHAINS.map((chain) => chain.id);

// Optional: You can set custom RPC URLs in the .env file.
// If not provided, default public RPC URLs from wagmi will be used.
const TRANSPORTS = {
  [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || undefined),
  [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL || undefined),
  [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || undefined),
  [avalanche.id]: http(process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL || undefined),
};

const config = createConfig({
  chains: CHAINS,
  transports: TRANSPORTS,
  ssr: true,
});

const onChainKitConfig: AppConfig = {
  wallet: {
    display: "modal",
  },
};

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MiniKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={onChainKitConfig}
        >
          <BetSwirlSDKProvider 
            initialChainId={base.id}
            supportedChains={SUPPORTED_CHAIN_IDS}
          >
            <TokenProvider>
              <BalanceProvider>
                {props.children}
              </BalanceProvider>
            </TokenProvider>
          </BetSwirlSDKProvider>
        </MiniKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
