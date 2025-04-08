import React, { useState } from 'react';

function PlayerSelection({ onStartGame }) {
  const [numPlayers, setNumPlayers] = useState(2);

  const handleStart = () => {
    onStartGame(numPlayers);
  };

  const getButtonColor = (num) => {
    switch (num) {
      case 2:
        return 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
      case 3:
        return 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
      case 4:
        return 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
      case 5:
        return 'bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700';
      case 6:
        return 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700';
      default:
        return 'bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TAKI
        </h1>
        <div className="mb-12">
          <label className="block text-gray-700 text-2xl font-bold mb-8 text-center">
            Select Number of Players (2-6):
          </label>
          <div className="grid grid-cols-10 gap-0 w-full content-center">
            <div className="col-span-3"></div>
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setNumPlayers(num)}
                className={`w-20 h-20 rounded-full text-white text-5xl font-bold transition-all duration-300 shadow-xl ${
                  numPlayers === num
                    ? getButtonColor(num)
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400'
                }`}
                style={{
                  transform: numPlayers === num ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: numPlayers === num 
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' 
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  border: numPlayers === num ? '4px solid skyblue' : 'none'
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
        <button
          onClick={handleStart}
          className="w-64 bg-gradient-to-r from-green-500 to-green-600 
          hover:from-green-600 hover:to-green-700 text-white py-8 px-8 rounded-lg text-4xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Start Game
        </button>
        </div>
        
      </div>
    </div>
  );
}

export default PlayerSelection; 