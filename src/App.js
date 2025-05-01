import React, { useState, useEffect } from 'react';
import Card from './Card';
import PlayerSelection from './PlayerSelection';
import ColorSelection from './ColorSelection';
import JokerSelection from './JokerSelection';
import KingSelection from './KingSelection';
import { ColorProvider, useColor } from './context/ColorContext';
import Fireworks from './Fireworks';
import { getComputerPlay, getComputerColorChoice, getComputerKingChoice } from './AI';

const colors = ['red', 'blue', 'green', 'yellow'];
const values = ['1', '3', '4', '5', '6', '7', '8', '9', '+2', 'stop', 'changeDirection', 'changeColor', 'taki', 'king', '+3', '+3Breaker'];

function createDeck() {
  const deck = [];
  for (const color of colors) {
    for (const value of values) {
      // For +3 and +3Breaker cards, always use purple color
      // For king cards, always use dark grey color
      const cardColor = (value === '+3' || value === '+3Breaker') ? 'purple' : 
                       (value === 'king') ? 'darkgrey' : color;
      deck.push({ color: cardColor, value });
      if (value !== 'taki' && value !== 'king' && value !== '+3' && value !== '+3Breaker') {
        deck.push({ color: cardColor, value }); // Duplicate non-unique cards
      }
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

function TakiGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [direction, setDirection] = useState(1);
  const [takiActive, setTakiActive] = useState(false);
  const [drawAmount, setDrawAmount] = useState(1);
  const [gameMessage, setGameMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showColorSelection, setShowColorSelection] = useState(false);
  const [showJokerSelection, setShowJokerSelection] = useState(false);
  const [selectedJokerCard, setSelectedJokerCard] = useState(null);
  const [showKingSelection, setShowKingSelection] = useState(false);
  const [selectedKingCard, setSelectedKingCard] = useState(null);
  const { currentColor, isFirstPlayAfterPlusThree, updateColor, handlePlusThree, handlePlusThreeBreaker, resetColorAfterDraw } = useColor();

  const startGame = () => {
    const newDeck = createDeck();
    const newPlayers = Array(2).fill(null).map(() => newDeck.splice(0, 8));
    const firstDiscard = newDeck.shift();
    setDeck(newDeck);
    setPlayers(newPlayers);
    setDiscardPile([firstDiscard]);
    updateColor(firstDiscard.color);
    setGameStarted(true);
  };

  function drawCard(playerIndex, amount = 1) {
    const newPlayers = [...players];
    const cardsToDraw = deck.splice(0, amount);
    newPlayers[playerIndex] = [...newPlayers[playerIndex], ...cardsToDraw];
    setPlayers(newPlayers);
    setDeck([...deck]);
  }

  function handlePlayCard(index) {
    const card = players[currentPlayer][index];
    const topDiscard = discardPile[discardPile.length - 1];
    const isPlusThree = card.value === '+3';
    const isPlusThreeBreaker = card.value === '+3Breaker';

    if (isPlusThree || isPlusThreeBreaker) {
      card.color = 'purple';
    }

    if (canPlayCard(card, topDiscard)) {
      const cardToDiscard = { ...card };
      if (cardToDiscard.value === '+3' || cardToDiscard.value === '+3Breaker') {
        cardToDiscard.color = 'purple';
      }

      if (cardToDiscard.value === 'changeColor') {
        setShowColorSelection(true);
        setSelectedKingCard(cardToDiscard);
        return;
      } else if (cardToDiscard.value === 'king') {
        setSelectedKingCard(cardToDiscard);
        setShowKingSelection(true);
        return;
      } else if (cardToDiscard.value !== '+3' && cardToDiscard.value !== '+3Breaker') {
        updateColor(cardToDiscard.color);
      }

      const newPlayers = [...players];
      newPlayers[currentPlayer].splice(index, 1);
      setPlayers(newPlayers);
      setDiscardPile([...discardPile, cardToDiscard]);
      setGameMessage(''); // Clear any previous message

      // Check if player has won (no cards left)
      if (newPlayers[currentPlayer].length === 0) {
        setGameOver(true);
        setWinner(currentPlayer);
        return;
      }
      
      if (cardToDiscard.value === '+2') {
        if (topDiscard.value === '+2' && drawAmount > 1) {
          setDrawAmount(drawAmount + 2);
        } else {
          setDrawAmount(2);
        }
      }
      if (cardToDiscard.value === '+3') {
        setDrawAmount(3);
        handlePlusThree();
      }
      if (cardToDiscard.value === '+3Breaker') {
        setDrawAmount(1);
        const lastCardBeforePlusThree = discardPile.findLast(card => card.value !== '+3' && card.value !== '+3Breaker');
        handlePlusThreeBreaker(lastCardBeforePlusThree);
      }

      if (cardToDiscard.value === 'stop') {
        // In a 2-player game, skip the other player and return to the same player
        setCurrentPlayer(currentPlayer);
        return;
      }
      if (cardToDiscard.value === 'changeDirection') {
        setDirection(direction * -1);
      }
      if (cardToDiscard.value === 'taki') {
        setTakiActive(true);
        return; // Don't move to next turn when TAKI is played
      }

      if (!takiActive || cardToDiscard.color !== currentColor) {
        nextTurn();
      }
    } else {
      setGameMessage('Invalid move!');
    }
  }

  const canPlayCard = (card, topDiscard) => {
    // King cards can always be played
    if (card.value === 'king') {
      return true;
    }

    // If it's the first play after +3, only +3Breaker can be played
    if (isFirstPlayAfterPlusThree && topDiscard?.value === '+3') {
      return card.value === '+3Breaker';
    }

    // If in the middle of a +2 sequence, only +2 can be played
    if (drawAmount > 1 && topDiscard?.value === '+2') {
      return card.value === '+2';
    }

    // If TAKI is active, only cards of the current color can be played
    if (takiActive) {
      return card.color === currentColor;
    }

    // Regular play conditions:
    // 1. Card matches current color
    // 2. Card matches top discard's value
    // 3. Card is a change color card
    // 4. Card is a +3 or +3Breaker
    return (
      card.color === currentColor ||
      card.value === topDiscard.value ||
      card.value === 'changeColor' ||
      card.value === '+3' ||
      card.value === '+3Breaker'
    );
  };

  const handleDraw = () => {
    if (currentPlayer !== 0) {
      setGameMessage("It's not your turn!");
      return;
    }
    
    // Draw cards for human player
    const newPlayers = [...players];
    const cardsToDraw = deck.splice(0, drawAmount);
    newPlayers[0] = [...newPlayers[0], ...cardsToDraw];
    setPlayers(newPlayers);
    setDeck([...deck]);
    setDrawAmount(1);
    resetColorAfterDraw(discardPile);
    
    // Switch to computer's turn
    setCurrentPlayer(1);
  };

  const handleBotTurn = () => {
    if (currentPlayer === 1 && !gameOver) {
      const topDiscard = discardPile[discardPile.length - 1];
      const botHand = players[1];
      
      const play = getComputerPlay(botHand, topDiscard, currentColor, drawAmount, isFirstPlayAfterPlusThree);
      
      if (play.action === 'draw') {
        // Draw cards for computer
        const newPlayers = [...players];
        const cardsToDraw = deck.splice(0, drawAmount);
        newPlayers[1] = [...newPlayers[1], ...cardsToDraw];
        setPlayers(newPlayers);
        setDeck([...deck]);
        setDrawAmount(1);
        resetColorAfterDraw(discardPile);
        
        // Switch back to human player
        setCurrentPlayer(0);
      } else {
        const card = play.card;
        const newPlayers = [...players];
        const cardIndex = newPlayers[1].findIndex(c => 
          c.color === card.color && c.value === card.value
        );
        
        if (cardIndex !== -1) {
          // Remove the card from computer's hand
          newPlayers[1].splice(cardIndex, 1);
          setPlayers(newPlayers);
          
          // Add the card to discard pile
          const cardToDiscard = { ...card };
          setDiscardPile([...discardPile, cardToDiscard]);
          
          // Handle special card effects
          if (card.value === '+2') {
            if (topDiscard.value === '+2' && drawAmount > 1) {
              setDrawAmount(drawAmount + 2);
            } else {
              setDrawAmount(2);
            }
          } else if (card.value === '+3') {
            setDrawAmount(3);
            handlePlusThree();
          } else if (card.value === '+3Breaker') {
            setDrawAmount(1);
            const lastCardBeforePlusThree = discardPile.findLast(card => card.value !== '+3' && card.value !== '+3Breaker');
            handlePlusThreeBreaker(lastCardBeforePlusThree);
          } else if (card.value === 'stop') {
            // Computer plays again
            setTimeout(() => {
              handleBotTurn();
            }, 1000);
            return;
          } else if (card.value === 'changeDirection') {
            setDirection(direction * -1);
          } else if (card.value === 'taki') {
            setTakiActive(true);
            // Computer continues playing TAKI
            setTimeout(() => {
              handleBotTurn();
            }, 1000);
            return;
          } else if (card.value === 'changeColor') {
            const selectedColor = getComputerColorChoice(botHand);
            updateColor(selectedColor);
          } else if (card.value === 'king') {
            const kingChoice = getComputerKingChoice(botHand, topDiscard, currentColor, drawAmount, isFirstPlayAfterPlusThree);
            cardToDiscard.value = kingChoice.value;
            cardToDiscard.color = kingChoice.color;
            updateColor(kingChoice.color);
          } else if (card.value !== '+3' && card.value !== '+3Breaker') {
            updateColor(card.color);
          }
          
          // Check if computer has won
          if (newPlayers[1].length === 0) {
            setGameOver(true);
            setWinner(1);
            return;
          }
          
          // Switch back to human player
          setCurrentPlayer(0);
        }
      }
    }
  };

  // Add useEffect to handle computer's turn
  useEffect(() => {
    if (currentPlayer === 1 && !gameOver) {
      const timer = setTimeout(() => {
        handleBotTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver]);

  function nextTurn(skip = 1) {
    let next = currentPlayer + direction * skip;
    if (next < 0) next = players.length - 1;
    if (next >= players.length) next = 0;

    setCurrentPlayer(next);
    setTakiActive(false);
  }

  const handleColorSelect = (color) => {
    updateColor(color);
    setShowColorSelection(false);
    // Add the change color card to the discard pile with the selected color
    if (selectedKingCard) {
      const newPlayers = [...players];
      const cardIndex = newPlayers[currentPlayer].findIndex(card => 
        card.value === 'changeColor' && card.color === selectedKingCard.color
      );
      if (cardIndex !== -1) {
        newPlayers[currentPlayer].splice(cardIndex, 1);
        setPlayers(newPlayers);
        const cardToDiscard = { ...selectedKingCard, color };
        setDiscardPile([...discardPile, cardToDiscard]);
        setSelectedKingCard(null);
      }
    }
    nextTurn();
  };

  const handleCardClick = (card) => {
    if (currentPlayer !== 0) {
      setGameMessage("It's not your turn!");
      return;
    }
    
    const cardIndex = players[0].findIndex(c => 
      c.color === card.color && c.value === card.value
    );
    
    if (cardIndex !== -1) {
      handlePlayCard(cardIndex);
    }
  };

  const handleJokerSelect = (selectedValue) => {
    if (selectedJokerCard) {
      const newCard = { ...selectedJokerCard, value: selectedValue };
      if (canPlayCard(newCard, discardPile[discardPile.length - 1])) {
        handlePlayCard(players[currentPlayer].indexOf(selectedJokerCard));
      } else {
        alert('Invalid move!');
      }
    }
    setShowJokerSelection(false);
    setSelectedJokerCard(null);
  };

  const handleKingSelect = (value, color) => {
    if (selectedKingCard) {
      // Create a new card with the selected value and color
      const newCard = { ...selectedKingCard, value, color };
      
      // Remove the king card from player's hand
      const newPlayers = [...players];
      const cardIndex = newPlayers[currentPlayer].findIndex(card => 
        card.value === 'king' && card.color === selectedKingCard.color
      );
      if (cardIndex !== -1) {
        newPlayers[currentPlayer].splice(cardIndex, 1);
        setPlayers(newPlayers);
      }

      // Add the new card to the discard pile
      setDiscardPile([...discardPile, newCard]);

      // Handle special card effects
      if (value === '+2') {
        const topDiscard = discardPile[discardPile.length - 1];
        if (topDiscard.value === '+2' && drawAmount > 1) {
          setDrawAmount(drawAmount + 2);
        } else {
          setDrawAmount(2);
        }
      } else if (value === '+3') {
        setDrawAmount(3);
        handlePlusThree();
      } else if (value === '+3Breaker') {
        setDrawAmount(1);
        const lastCardBeforePlusThree = discardPile.findLast(card => card.value !== '+3' && card.value !== '+3Breaker');
        handlePlusThreeBreaker(lastCardBeforePlusThree);
      } else if (value === 'stop') {
        if (currentPlayer === 0) {
          setCurrentPlayer(currentPlayer);
        } else {
          nextTurn(1);
        }
        return;
      } else if (value === 'changeDirection') {
        setDirection(direction * -1);
      } else if (value === 'taki') {
        setTakiActive(true);
        return;
      } else if (value === 'changeColor') {
        setShowColorSelection(true);
        setShowKingSelection(false); // Hide the king selection
        return; // Exit the function early
      }

      // Set the current color based on the selected card
      if (value !== '+3' && value !== '+3Breaker') {
        updateColor(color);
      }

      // Move to next turn if not in TAKI mode
      if (!takiActive || color !== currentColor) {
        nextTurn();
      }

      setShowKingSelection(false);
      setSelectedKingCard(null);
    }
  };

  const handleCloseTaki = () => {
    setTakiActive(false);
    nextTurn();
  };

  // Add this function to handle game restart
  const handlePlayAgain = () => {
    setGameStarted(false);
    setGameOver(false);
    setWinner(null);
    setDeck([]);
    setPlayers([]);
    setDiscardPile([]);
    setCurrentPlayer(0);
    setDirection(1);
    // Reset any other game state you need
  };

  if (!gameStarted) {
    return <PlayerSelection onStartGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {showColorSelection && (
        <ColorSelection
          onSelectColor={handleColorSelect}
          onClose={() => setShowColorSelection(false)}
        />
      )}

      {showJokerSelection && (
        <JokerSelection
          onSelectValue={handleJokerSelect}
          onClose={() => {
            setShowJokerSelection(false);
            setSelectedJokerCard(null);
          }}
        />
      )}

      {showKingSelection && (
        <KingSelection
          onSelectValue={handleKingSelect}
          onClose={() => {
            setShowKingSelection(false);
            setSelectedKingCard(null);
          }}
          currentColor={currentColor}
          topDiscard={discardPile[discardPile.length - 1]}
          isFirstPlayAfterPlusThree={isFirstPlayAfterPlusThree}
          drawAmount={drawAmount}
        />
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Taki Game</h1>
        {gameOver && (
          <div className="text-center mb-8">
            <Fireworks />
            <h2 className="text-4xl font-bold text-green-600 mb-4"  style={{ position: 'relative', zIndex: 1 }}>
              🎉 {winner === 0 ? 'You Win!' : 'Computer Wins!'} 🎉
            </h2>
            <button
              onClick={handlePlayAgain}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-bold transition-colors shadow-lg"
              style={{ position: 'relative', zIndex: 1 }}
            >
              Play Again
            </button>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold">Discard Pile</h3>
            <div className="flex items-center justify-center gap-4">
              {discardPile.length > 0 && (
                <Card
                  color={discardPile[discardPile.length - 1].color}
                  value={discardPile[discardPile.length - 1].value}
                />
              )}
              {takiActive && currentPlayer === 0 && (
                <button
                  onClick={handleCloseTaki}
                  className={`text-white px-4 py-2 rounded-lg transition-colors ${
                    currentColor === 'red' ? 'bg-red-500 hover:bg-red-600' :
                    currentColor === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                    currentColor === 'green' ? 'bg-green-500 hover:bg-green-600' :
                    currentColor === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' :
                    'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  Close TAKI
                </button>
              )}
            </div>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-lg">Current Color: <span className="font-bold">{currentColor}</span></p>
            <p className="text-lg">Current Turn: <span className="font-bold">{currentPlayer === 0 ? 'Your Turn' : "Computer's Turn"}</span></p>
          </div>
        </div>
        {!gameOver && (
          <div className="text-center mb-4">
            <button
              onClick={handleDraw}
              disabled={currentPlayer !== 0}
              className={`px-6 py-2 rounded-lg transition-colors ${
                currentPlayer === 0
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {drawAmount > 1 ? `Draw +${drawAmount} Cards` : 'Draw Card'}
            </button>
            {gameMessage && <p className="mt-4 text-red-500">{gameMessage}</p>}
          </div>
        )}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Cards</h3>
          <div className="flex flex-wrap gap-2 justify-center" style={{ minHeight: '220px' }}>
            {players[0]?.map((card, index) => (
              <Card
                key={index}
                color={card.color}
                value={card.value}
                onClick={() => currentPlayer === 0 ? handleCardClick(card) : null}
                isPlayable={currentPlayer === 0 && canPlayCard(card, discardPile[discardPile.length - 1])}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Computer's Cards</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-center" style={{ height: '80px' }}>
              {Array(players[1]?.length || 0).fill(0).map((_, index) => (
                <div
                  key={index}
                  className="w-[50px] h-[100px] bg-gray-200 rounded-[10px] border-2 border-gray-300"
                  style={{
                    marginLeft: index > 0 ? '-30px' : '0',
                    zIndex: index,
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">{players[1]?.length || 0} cards</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the app with ColorProvider
export default function App() {
  return (
    <ColorProvider>
      <TakiGame />
    </ColorProvider>
  );
}
