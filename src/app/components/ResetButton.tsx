import React from 'react';

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  return (
    <button
      onClick={onReset}
      style={{
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '1em',
        cursor: 'pointer',
      }}
    >
      Reset Game
    </button>
  );
};

export default ResetButton;
