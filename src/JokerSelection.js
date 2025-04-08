import React from 'react';

function JokerSelection({ onSelectValue, onClose }) {
  const cardValues = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'stop', 'change direction', 'plus 2', 'taki',
    'change color', '+3', '+3 breaker'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Select Card Value</h3>
        <div className="grid grid-cols-4 gap-2">
          {cardValues.map((value) => (
            <button
              key={value}
              onClick={() => onSelectValue(value)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {value}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default JokerSelection; 