import React from 'react';
import Card from './Card';
import { useColor } from './context/ColorContext';
import Fireworks from './Fireworks';

function KingSelection({ onSelectValue, onClose, topDiscard, drawAmount }) {
  const { currentColor, isFirstPlayAfterPlusThree } = useColor();

  // Filter out invalid options based on game state
  const getValidValues = () => {
    // Exclude '2' from the options
    const allValues = ['1', '3', '4', '5', '6', '7', '8', '9', '+2', 'stop', 'changeDirection', 'changeColor', 'taki', '+3', '+3Breaker'];
    
    // If it's the first play after +3, only allow +3Breaker
    if (isFirstPlayAfterPlusThree) {
      return [{ value: '+3Breaker', color: 'purple' }];
    }

    // If top card is +3, allow +3Breaker
    if (topDiscard?.value === '+3') {
      return [{ value: '+3Breaker', color: 'purple' }];
    }

    // If it's in the middle of a +2 sequence, only allow +2 cards
    if (drawAmount > 1 && topDiscard?.value === '+2') {
      return [{ value: '+2', color: 'red' }, { value: '+2', color: 'blue' }, { value: '+2', color: 'green' }, { value: '+2', color: 'yellow' }];
    }

    // For special cards with fixed colors
    if (topDiscard?.value === '+3') {
      return [{ value: '+3', color: 'purple' }];
    }

    // Get all valid options excluding '2'
    const validOptions = [];

    // 1. Add all cards in the current active color
    allValues.forEach(value => {
      // For +3 and +3Breaker, always use purple
      const color = (value === '+3' || value === '+3Breaker') ? 'purple' : currentColor;
      if (value !== '2') { // Exclude '2'
        validOptions.push({ value, color });
      }
    });

    // 2. If top card is a face card or number card, add it in all colors
    if (['+2', 'stop', 'changeDirection', 'taki', '1', '3', '4', '5', '6', '7', '8', '9'].includes(topDiscard?.value)) {
      ['red', 'blue', 'green', 'yellow'].forEach(color => {
        validOptions.push({ value: topDiscard.value, color });
      });
    }

    // 3. If top card is +3 or +3Breaker, add it in purple
    if (topDiscard?.value === '+3' || topDiscard?.value === '+3Breaker') {
      validOptions.push({ value: topDiscard.value, color: 'purple' });
    }

    // Remove duplicates
    return validOptions.filter((option, index, self) =>
      index === self.findIndex((o) => o.value === option.value && o.color === option.color)
    );
  };

  const validValues = getValidValues();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Select Card to Play</h2>
        
        {/* King Card Options Title */}
        <h3 className="text-xl font-semibold mb-2 text-center">King Card Options</h3>

        {/* King Card Options Display */}
        <div className="flex flex-wrap gap-8 justify-center relative" style={{ minHeight: '220px', display: 'flex', flexDirection: 'row', gap: '4px' }}>
          {validValues.map((card) => (
            <div 
              key={`${card.value}-${card.color}`}
              onClick={() => onSelectValue(card.value, card.color)}
              style={{ 
                cursor: 'pointer',
                flex: '0 0 auto',
                minWidth: '0',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Card
                color={card.color}
                value={card.value}
                isPlayable={true}
              />
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default KingSelection; 