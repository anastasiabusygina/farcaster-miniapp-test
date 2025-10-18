"use client";

import { useAddFrame, useMiniKit } from "@coinbase/onchainkit/minikit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Icon } from "./components/DemoComponents";
import { DiceGame, CoinTossGame, RouletteGame } from "@betswirl/ui-react";
import "@betswirl/ui-react/styles.css";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);

  const [game, setGame] = useState<'dice' | 'cointoss' | 'roulette'>('dice')
  const addFrame = useAddFrame();

  const gameProps = {
    theme: "dark" as const,
    customTheme: {
      "--primary": "rgb(225 159 31)",
      "--play-btn-font": "rgb(74 41 24)",
    } as React.CSSProperties,
    backgroundImage: "/game-bg.png",
  }

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme">
      <div className="w-full max-w-md mx-auto py-3">
        <div className="px-4">
          <header className="flex justify-between items-center mb-3 h-11">
            <div>{saveFrameButton}</div>
          </header>
        </div>

        {/* Navigation buttons */}
        <nav style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          padding: '12px 0',
          marginBottom: '12px',
        }}>
          {(['dice', 'cointoss', 'roulette'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGame(g)}
              style={{
                padding: '8px 16px',
                background: game === g ? 'rgb(225 159 31)' : 'rgba(255, 255, 255, 0.05)',
                color: game === g ? 'rgb(74 41 24)' : 'rgba(255, 255, 255, 0.6)',
                border: game === g ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                outline: 'none',
              }}
            >
              {g === 'cointoss' ? 'Coin Toss' : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </nav>

        <div className="px-4">
          <main className="flex justify-center">
            {/* Games */}
            {game === 'dice' && <DiceGame {...gameProps} />}
            {game === 'cointoss' && <CoinTossGame {...gameProps} />}
            {game === 'roulette' && <RouletteGame {...gameProps} />}
          </main>
        </div>
      </div>
    </div>
  );
}