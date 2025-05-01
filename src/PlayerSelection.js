import React from 'react';

function PlayerSelection({ onStartGame }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TAKI
        </h1>
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Play against the Computer</h2>
          <p className="text-xl text-gray-600 mb-8">You will play first!</p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => onStartGame(2)}
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