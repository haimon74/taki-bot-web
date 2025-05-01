// AI logic for computer players
export function getComputerPlay(hand, topDiscard, currentColor, drawAmount, isFirstPlayAfterPlusThree) {
  // First, find all playable cards
  const playableCards = hand.filter(card => {
    if (card.value === 'king') return true;
    if (isFirstPlayAfterPlusThree && topDiscard?.value === '+3') {
      return card.value === '+3Breaker';
    }
    if (drawAmount > 1 && topDiscard?.value === '+2') {
      return card.value === '+2';
    }
    return card.color === currentColor || 
           card.value === topDiscard?.value || 
           card.value === 'changeColor' ||
           card.value === '+3' ||
           card.value === '+3Breaker';
  });

  if (playableCards.length === 0) {
    return { action: 'draw' };
  }

  // If TAKI is active, prioritize playing cards of the current color
  if (topDiscard?.value === 'taki' || currentColor) {
    const sameColorCards = playableCards.filter(card => card.color === currentColor);
    if (sameColorCards.length > 0) {
      // During TAKI, play cards in this order:
      // 1. Other special cards (stop, changeDirection, taki)
      const otherSpecialCards = sameColorCards.filter(card => 
        ['stop', 'changeDirection', 'taki'].includes(card.value)
      );
      if (otherSpecialCards.length > 0) {
        return { 
          action: 'play', 
          card: otherSpecialCards[0],
          index: hand.indexOf(otherSpecialCards[0])
        };
      }

      // 2. Regular cards
      const regularCards = sameColorCards.filter(card => 
        !['+2', '+3', 'stop', 'changeDirection', 'taki'].includes(card.value)
      );
      if (regularCards.length > 0) {
        return { 
          action: 'play', 
          card: regularCards[0],
          index: hand.indexOf(regularCards[0])
        };
      }

      // 3. +2 cards (to make opponent draw)
      const drawCards = sameColorCards.filter(card => card.value === '+2');
      if (drawCards.length > 0) {
        return { 
          action: 'play', 
          card: drawCards[0],
          index: hand.indexOf(drawCards[0])
        };
      }
    }
  }

  // Strategy for regular play (when TAKI is not active):
  // 1. First priority: Play TAKI to start a sequence
  const takiCards = playableCards.filter(card => card.value === 'taki');
  if (takiCards.length > 0) {
    return { 
      action: 'play', 
      card: takiCards[0],
      index: hand.indexOf(takiCards[0])
    };
  }

  // 2. Second priority: Play cards that make opponent draw
  const drawCards = playableCards.filter(card => ['+2', '+3'].includes(card.value));
  if (drawCards.length > 0) {
    return { 
      action: 'play', 
      card: drawCards[0],
      index: hand.indexOf(drawCards[0])
    };
  }

  // 3. Third priority: Play control cards
  const controlCards = playableCards.filter(card => ['stop', 'changeDirection'].includes(card.value));
  if (controlCards.length > 0) {
    return { 
      action: 'play', 
      card: controlCards[0],
      index: hand.indexOf(controlCards[0])
    };
  }

  // 4. Fourth priority: Play change color cards
  const changeColorCards = playableCards.filter(card => card.value === 'changeColor');
  if (changeColorCards.length > 0) {
    return { 
      action: 'play', 
      card: changeColorCards[0],
      index: hand.indexOf(changeColorCards[0])
    };
  }

  // If no special cards, play the first playable card
  return { 
    action: 'play', 
    card: playableCards[0],
    index: hand.indexOf(playableCards[0])
  };
}

export function getComputerColorChoice(hand) {
  // Count cards of each color in hand
  const colorCounts = hand.reduce((acc, card) => {
    if (card.color !== 'purple' && card.color !== 'darkgrey') {
      acc[card.color] = (acc[card.color] || 0) + 1;
    }
    return acc;
  }, {});

  // Choose the color with the most cards
  return Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'red';
}

export function getComputerKingChoice(hand, topDiscard, currentColor, drawAmount, isFirstPlayAfterPlusThree) {
  // If it's the first play after +3, must choose +3Breaker
  if (isFirstPlayAfterPlusThree) {
    return { value: '+3Breaker', color: 'purple' };
  }

  // If in the middle of a +2 sequence, must choose +2
  if (drawAmount > 1 && topDiscard?.value === '+2') {
    return { value: '+2', color: currentColor };
  }

  // If top card is +3, must choose +3Breaker
  if (topDiscard?.value === '+3') {
    return { value: '+3Breaker', color: 'purple' };
  }

  // Count cards of each value in hand
  const valueCounts = hand.reduce((acc, card) => {
    if (card.value !== 'king' && card.value !== '+3' && card.value !== '+3Breaker') {
      acc[card.value] = (acc[card.value] || 0) + 1;
    }
    return acc;
  }, {});

  // Choose the value with the most cards
  const preferredValue = Object.entries(valueCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '1';

  return { 
    value: preferredValue, 
    color: currentColor 
  };
} 