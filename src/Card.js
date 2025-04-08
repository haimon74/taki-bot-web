import React from 'react';

function Card({ color, value, onClick, isPlayable = false, isStacked = false, stackIndex = 0 }) {
  const getColorClass = () => {
    switch (color) {
      case 'red':
        return 'bg-red-500';
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'yellow':
        return 'bg-yellow-400';
      case 'purple':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getBorderColor = () => {
    if (value === 'changeColor') {
      return '#333333'; // Dark grey border for change color cards
    }
    switch (color) {
      case 'red':
        return '#dc2626'; // red-600
      case 'blue':
        return '#2563eb'; // blue-600
      case 'green':
        return '#16a34a'; // green-600
      case 'yellow':
        return '#eab308'; // yellow-500
      case 'purple':
        return '#9333ea'; // purple-600
      default:
        return '#4b5563'; // gray-600
    }
  };
  
  const getTextColor = () => {
    switch (color) {
      case 'red':
        return '#ef4444'; // red-500
      case 'blue':
        return '#3b82f6'; // blue-500
      case 'green':
        return '#22c55e'; // green-500
      case 'yellow':
        return '#eab308'; // yellow-500
      case 'purple':
        return '#9333ea'; // purple-600
      default:
        return '#4b5563'; // gray-600
    }
  };

  const getSymbol = () => {
    switch (value) {
      case '+2':
        return '+2';
      case 'stop':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              viewBox="0 0 984.227 984.228"
              style={{
                width: '60px',
                height: '60px',
                transform: 'rotate(0deg)',
              }}
            >
              <g>
                <path
                  fill="currentColor"
                  d="M714.514,512.828c0,1.199,0,123.699,0,123.699c0,22.801-7.4,37-27.4,37c-21.1,0-28.699-13.699-28.699-36.5   c0,0,0-99.899,0-211.6c0-141.2,0-303.8,0-303.8c0-67.7-94.701-69.7-94.701-4.6l-0.6,331.9c0,11.8-7.9,20.4-18.799,20.4   c-10.9,0-18.9-8.601-18.9-20.4v-401.3c0-62.6-95.201-64.4-95.201,0c0,0.7,0,401.3,0,401.3c0,11.8-7.899,20.4-18.8,20.4   c-10.899,0-18.8-8.601-18.8-20.4v-359c0-63.8-95.2-63.7-95.2,0c0,0.5,0,359,0,359c0,11.8-7.899,20.4-18.899,20.4   c-10.9,0-18.8-8.601-18.8-20.4v-275.3c0-22.2-19.5-39.9-40.9-40.8c-22.2-0.9-44.8,17.4-44.8,40.8c0,0.1,0,141.6,0,276.399   c0,184.401,0,393.101,0,393.101c0,22,3.5,61.899,27.3,82.3l1.6,1.4v29.699c0,15.301,12.4,27.7,27.7,27.7h364.099   c15.301,0,27.701-12.399,27.701-27.7l0.4-34.199c0.398-0.801,0.799-1.801,1.6-2.601l0.1-0.1l154.801-141.7   c20.5-20.5,30.898-44.3,30.898-70.7V512.828C810.114,448.727,714.514,448.727,714.514,512.828z"
                />
              </g>
            </svg>
          </div>
        );
      case 'changeDirection':
        return '↔️';
      case 'changeColor':
        return '🌈';
      case 'taki':
        return 'TAKI';
      case 'king':
        return '👑';
      case '+3':
        return '+3';
      case '+3Breaker':
        return '∌';
      default:
        return value;
    }
  };

  const getCornerSymbol = () => {
    if (value === 'stop') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          viewBox="0 0 984.227 984.228"
          style={{
            width: '20px',
            height: '20px',
            transform: 'rotate(0deg)',
          }}
        >
          <g>
            <path
              fill="currentColor"
              d="M714.514,512.828c0,1.199,0,123.699,0,123.699c0,22.801-7.4,37-27.4,37c-21.1,0-28.699-13.699-28.699-36.5   c0,0,0-99.899,0-211.6c0-141.2,0-303.8,0-303.8c0-67.7-94.701-69.7-94.701-4.6l-0.6,331.9c0,11.8-7.9,20.4-18.799,20.4   c-10.9,0-18.9-8.601-18.9-20.4v-401.3c0-62.6-95.201-64.4-95.201,0c0,0.7,0,401.3,0,401.3c0,11.8-7.899,20.4-18.8,20.4   c-10.899,0-18.8-8.601-18.8-20.4v-359c0-63.8-95.2-63.7-95.2,0c0,0.5,0,359,0,359c0,11.8-7.899,20.4-18.899,20.4   c-10.9,0-18.8-8.601-18.8-20.4v-275.3c0-22.2-19.5-39.9-40.9-40.8c-22.2-0.9-44.8,17.4-44.8,40.8c0,0.1,0,141.6,0,276.399   c0,184.401,0,393.101,0,393.101c0,22,3.5,61.899,27.3,82.3l1.6,1.4v29.699c0,15.301,12.4,27.7,27.7,27.7h364.099   c15.301,0,27.701-12.399,27.701-27.7l0.4-34.199c0.398-0.801,0.799-1.801,1.6-2.601l0.1-0.1l154.801-141.7   c20.5-20.5,30.898-44.3,30.898-70.7V512.828C810.114,448.727,714.514,448.727,714.514,512.828z"
            />
          </g>
        </svg>
      );
    }
    return getSymbol();
  };

  const cardStyle = {
    transform: isStacked ? `translateX(${stackIndex * 30}px)` : 'none',
    zIndex: isStacked ? stackIndex : 'auto',
    marginLeft: isStacked ? '-30px' : '0',
    border: `10px solid ${getBorderColor()}`,
    width: '120px',
    height: '200px',
    borderRadius: '20px',
    position: isStacked ? 'absolute' : 'relative',
    cursor: isPlayable ? 'pointer' : 'not-allowed',
    backgroundColor: 'white'
  };

  return (
    <div
      onClick={onClick}
      style={cardStyle}
      className={`
        shadow-lg transform transition-transform
        ${getColorClass()}
        flex items-center justify-center
        font-bold
        overflow-hidden
        bg-white
        relative
      `}
    >
      {isPlayable && (
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '12px',
            height: '12px',
            backgroundColor: '#22c55e',
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 0 4px rgba(0,0,0,0.3)'
          }}
        />
      )}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          fontSize: value === 'stop' ? '48px' : value === 'taki' ? '48px' : '72px',
          color: getTextColor(),
        }}
      >
        {getSymbol()}
      </div>
      <div 
        style={{
          position: 'absolute',
          top: value === 'taki' ? '40px' : '10px',
          left: value === 'taki' ? '5px' : '10px',
          fontSize: value === 'stop' ? '16px' : value === 'taki' ? '16px' : '24px',
          color: getTextColor(),
          transform: value === 'taki' ? 'rotate(270deg)' : 'none',
          transformOrigin: 'left top',
        }}
      >
        {getCornerSymbol()}
      </div>
    </div>
  );
}

export default Card; 