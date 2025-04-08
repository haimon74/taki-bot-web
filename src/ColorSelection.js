import React from 'react';

function ColorSelection({ onSelectColor, onClose }) {
  const colors = [
    { name: 'red', hex: '#dc2626' },
    { name: 'blue', hex: '#2563eb' },
    { name: 'green', hex: '#16a34a' },
    { name: 'yellow', hex: '#eab308' }
  ];

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{ 
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '8px',
          textAlign: 'center'
        }}>Select a Color</h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => onSelectColor(color.name)}
              style={{ 
                width: '80px',
                height: '80px',
                backgroundColor: color.hex,
                borderRadius: '5px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: 'none',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}
              title={color.name}
            />
          ))}
        </div>
        <button
          onClick={onClose}
          style={{ 
            marginTop: '8px',
            width: '100%',
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ColorSelection; 