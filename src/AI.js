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

  // Strategy: Prefer special cards that can cause more disruption
  const specialCards = playableCards.filter(card => 
    ['+2', '+3', 'stop', 'changeDirection', 'taki'].includes(card.value)
  );

  if (specialCards.length > 0) {
    // Prefer +2 and +3 cards to make other players draw
    const drawCards = specialCards.filter(card => ['+2', '+3'].includes(card.value));
    if (drawCards.length > 0) {
      return { 
        action: 'play', 
        card: drawCards[0],
        index: hand.indexOf(drawCards[0])
      };
    }

    // Then prefer stop and change direction cards
    const controlCards = specialCards.filter(card => ['stop', 'changeDirection'].includes(card.value));
    if (controlCards.length > 0) {
      return { 
        action: 'play', 
        card: controlCards[0],
        index: hand.indexOf(controlCards[0])
      };
    }

    // Finally, play any other special card
    return { 
      action: 'play', 
      card: specialCards[0],
      index: hand.indexOf(specialCards[0])
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