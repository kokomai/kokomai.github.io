import { useState, useCallback, useEffect } from 'react';
import { GameState, GameScreen } from '@/lib/types';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: GameScreen.TITLE,
    isPlaying: false,
    progress: 0,
    hasJumped: false
  });

  const setCurrentScreen = useCallback((screen: GameScreen) => {
    setGameState(prev => ({ ...prev, currentScreen: screen }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentScreen: GameScreen.GAME,
      isPlaying: true,
      progress: 0
    }));
  }, []);

  const jump = useCallback(() => {
    if (gameState.hasJumped) return;

    setGameState(prev => ({ ...prev, hasJumped: true }));

    // Reset after jump animation completes
    setTimeout(() => {
      setGameState(prev => ({ ...prev, hasJumped: false }));
    }, 600);
  }, [gameState.hasJumped]);

  const incrementProgress = useCallback(() => {
    setGameState(prev => {
      const newProgress = prev.progress + 1;
      
      // If progress reaches 100%, show the info screen
      if (newProgress >= 100) {
        return {
          ...prev,
          progress: 100,
          isPlaying: false,
          currentScreen: GameScreen.INFO
        };
      }
      
      return {
        ...prev,
        progress: newProgress
      };
    });
  }, []);

  const restart = useCallback(() => {
    setGameState({
      currentScreen: GameScreen.TITLE,
      isPlaying: false,
      progress: 0,
      hasJumped: false
    });
  }, []);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameState.isPlaying) {
        jump();
      } else if (e.code === 'Enter' && !gameState.isPlaying && gameState.currentScreen === GameScreen.TITLE) {
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.isPlaying, gameState.currentScreen, jump, startGame]);

  return {
    gameState,
    setCurrentScreen,
    startGame,
    jump,
    incrementProgress,
    restart
  };
};
