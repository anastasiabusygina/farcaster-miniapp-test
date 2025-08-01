"use client";

import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { type AppConfig } from '@coinbase/onchainkit'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { http, type Hex } from "viem";
import { WagmiProvider, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { BetSwirlSDKProvider, type TokenWithImage, TokenProvider, BalanceProvider } from "@betswirl/ui-react";
import { polygon } from "viem/chains";

const DEGEN_TOKEN: TokenWithImage = {
  address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed" as Hex,
  symbol: "DEGEN",
  decimals: 18,
  image: "https://www.betswirl.com/img/tokens/DEGEN.svg",
};

const baseRpcUrl = "https://mainnet.base.org"
const polygonRpcUrl = "https://polygon-rpc.com"

const config = createConfig({
  chains: [base, polygon],
  transports: {
    [base.id]: http(baseRpcUrl),
    [polygon.id]: http(polygonRpcUrl),
  },
  ssr: false,
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
            bankrollToken={DEGEN_TOKEN} 
            supportedChains={[base.id, polygon.id]}
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
