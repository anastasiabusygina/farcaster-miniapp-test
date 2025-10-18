"use client";

import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { http } from "viem";
import { WagmiProvider, createConfig } from "wagmi";
import { base, arbitrum, avalanche, polygon } from "wagmi/chains";
import {
  BetSwirlSDKProvider,
  TokenProvider,
  BalanceProvider,
  FreebetsProvider,
  LeaderboardProvider,
  type PlayNowEvent
} from "@betswirl/ui-react";
import "@coinbase/onchainkit/styles.css";

const CHAINS = [base, polygon, arbitrum, avalanche] as const;
const SUPPORTED_CHAIN_IDS = CHAINS.map((chain) => chain.id);
const affiliateAddress = process.env.NEXT_PUBLIC_AFFILIATE_ADDRESS as `0x${string}` | undefined

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

export function RootProvider(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MiniKitProvider
          chain={base}
          config={{
            appearance: {
              mode: "auto",
            },
            wallet: {
              display: "modal",
              preference: "all",
            },
          }}
        >
          <BetSwirlSDKProvider
            initialChainId={base.id}
            supportedChains={SUPPORTED_CHAIN_IDS}
            affiliate={affiliateAddress}
          >
            <TokenProvider>
              <BalanceProvider>
                <FreebetsProvider>
                  <LeaderboardProvider onPlayNow={(event: PlayNowEvent) => {
                    console.log('Leaderboard requires:', event.games)
                    console.log('On chain:', event.chainId)
                    console.log('With tokens:', event.tokens)
                    // TODO: Implement game switching based on your app architecture
                  }}>
                    {props.children}
                  </LeaderboardProvider>
                </FreebetsProvider>
              </BalanceProvider>
            </TokenProvider>
          </BetSwirlSDKProvider>
        </MiniKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}