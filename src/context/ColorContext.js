import React, { createContext, useContext, useState } from 'react';

const ColorContext = createContext();

export function ColorProvider({ children }) {
  const [currentColor, setCurrentColor] = useState(null);
  const [isFirstPlayAfterPlusThree, setIsFirstPlayAfterPlusThree] = useState(false);

  const updateColor = (color) => {
    setCurrentColor(color);
  };

  const handlePlusThree = () => {
    setIsFirstPlayAfterPlusThree(true);
  };

  const handlePlusThreeBreaker = (lastCardBeforePlusThree) => {
    if (lastCardBeforePlusThree) {
      setCurrentColor(lastCardBeforePlusThree.color);
    }
    setIsFirstPlayAfterPlusThree(false);
  };

  const resetColorAfterDraw = (discardPile) => {
    if (isFirstPlayAfterPlusThree) {
      const lastCardBeforePlusThree = discardPile.findLast(card => 
        card.value !== '+3' && card.value !== '+3Breaker'
      );
      if (lastCardBeforePlusThree) {
        setCurrentColor(lastCardBeforePlusThree.color);
      }
      setIsFirstPlayAfterPlusThree(false);
    } else {
      const topDiscard = discardPile[discardPile.length - 1];
      if (topDiscard && topDiscard.value !== '+3' && topDiscard.value !== '+3Breaker') {
        setCurrentColor(topDiscard.color);
      }
    }
  };

  const value = {
    currentColor,
    isFirstPlayAfterPlusThree,
    updateColor,
    handlePlusThree,
    handlePlusThreeBreaker,
    resetColorAfterDraw
  };

  return (
    <ColorContext.Provider value={value}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColor() {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
} 