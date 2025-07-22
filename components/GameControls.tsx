import React from 'react';
import { SnookerState, SnookerAction, GamePhase, BallType } from '../types';
import { RED_BALL, COLORS_IN_SEQUENCE } from '../constants';

interface GameControlsProps {
  state: SnookerState;
  dispatch: React.Dispatch<SnookerAction>;
  onFinishMatchAndShowSummary: () => void;
  onNavigateToMatchSetup: () => void;
}

const ControlButton: React.FC<{
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLButtonElement>) => void;
  onTouchEnd?: (e: React.TouchEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  title?: string;
}> = ({ onClick, onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd, disabled, className, children, title }) => {
  return (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      disabled={disabled}
      className={`scoreboard-button w-full text-center ${className || ''}`}
      title={title}
    >
      {children}
    </button>
  );
};

const SquareBallButton: React.FC<{
    ball: BallType;
    onClick: () => void;
    disabled?: boolean;
}> = ({ ball, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="scoreboard-square-button"
        aria-label={`Pot ${ball.name}`}
    >
        <span className="value-text">{ball.value}</span>
        <div
            className="absolute -top-px -right-px w-0 h-0"
            style={{
                borderLeft: '20px solid transparent',
                borderBottom: '20px solid transparent',
                borderTop: `20px solid ${ball.hex}`,
                borderRight: `20px solid ${ball.hex}`,
                borderTopRightRadius: '0.375rem',
            }}
        ></div>
    </button>
);


export const GameControls: React.FC<GameControlsProps> = ({ state, dispatch, onFinishMatchAndShowSummary, onNavigateToMatchSetup }) => {
  const { gamePhase, isWaitingForColorAfterRed, remainingReds, nextColorInSequenceIndex, matchWinner, isFreeBallAvailable, isFreeBallActive } = state;
  
  const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = React.useRef(false);

  const handlePotBall = (ball: BallType) => {
    dispatch({ type: 'POT_BALL', payload: { ball } });
  };
  
  const isGameActive = gamePhase !== GamePhase.FrameOver && gamePhase !== GamePhase.MatchOver;
  const isFrameOver = gamePhase === GamePhase.FrameOver;
  const isMatchOver = gamePhase === GamePhase.MatchOver;

  const handleRedPotDisabled = !(gamePhase === GamePhase.RedsAvailable && !isWaitingForColorAfterRed && remainingReds > 0) || !isGameActive;

  const handleRedPressStart = () => {
    if (handleRedPotDisabled) return;
    longPressTriggeredRef.current = false;
    longPressTimer.current = setTimeout(() => {
        longPressTriggeredRef.current = true;
        dispatch({ type: 'OPEN_MULTI_RED_DIALOG' });
    }, 500); // 500ms threshold for long press
  };

  const handleRedPressEnd = () => {
    if (handleRedPotDisabled) return;
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    if (!longPressTriggeredRef.current) {
        handlePotBall(RED_BALL);
    }
  };

  const handleRedMouseLeave = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
  };


  if (isMatchOver) {
    return (
      <div className="card text-center animate-fade-in">
        <p className="text-2xl font-bold text-green-400 mb-2">Match Over!</p>
        <p className="text-lg text-gray-200 mb-6">{state.uiMessage.replace('MATCH OVER! ', '')}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <ControlButton onClick={() => onFinishMatchAndShowSummary()} className="green py-3 text-base">
            View Summary & Exit
          </ControlButton>
           <ControlButton onClick={() => onNavigateToMatchSetup()} className="py-3 text-base">
            Setup New Match
          </ControlButton>
        </div>
      </div>
    );
  }
  
  if (isFrameOver) {
    return (
        <div className="card text-center animate-fade-in">
           <p className="text-xl font-semibold text-green-400 mb-4">{state.uiMessage}</p>
           <ControlButton onClick={() => dispatch({ type: 'START_NEXT_FRAME', payload: {firstPlayerToBreak: state.playerToBreakNext }})} disabled={isMatchOver} className="green py-3 text-base">
             Start Next Frame
           </ControlButton>
        </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Controls</h2>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <ControlButton onClick={() => dispatch({ type: 'OPEN_FOUL_DIALOG'})} disabled={!isGameActive} className="py-3 text-base red">
            Foul
        </ControlButton>
        <ControlButton onClick={() => dispatch({ type: 'START_FREE_BALL'})} disabled={!isFreeBallAvailable || !isGameActive} className="py-3 text-base yellow">
            Free Ball
        </ControlButton>
      </div>

      <ControlButton 
        onMouseDown={handleRedPressStart}
        onMouseUp={handleRedPressEnd}
        onMouseLeave={handleRedMouseLeave}
        onTouchStart={handleRedPressStart}
        onTouchEnd={(e) => {
            e.preventDefault(); // Prevent firing mouse events on touch devices
            handleRedPressEnd();
        }}
        onClick={(e) => e.preventDefault()} // Prevent click if not handled by up/end events
        disabled={handleRedPotDisabled}
        className="mb-3 flex items-center justify-center gap-3 py-3 text-lg"
        title="Click to pot 1 red. Long-press to pot multiple."
      >
        <span className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-300"></span>
        <span>Pot Red</span>
      </ControlButton>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {COLORS_IN_SEQUENCE.map((colorBall) => {
            let colorDisabled = true;
            if (isFreeBallActive) {
                colorDisabled = false; // Any color can be potted
            } else if (gamePhase === GamePhase.RedsAvailable && isWaitingForColorAfterRed) {
                colorDisabled = false;
            } else if (gamePhase === GamePhase.ColorsSequence) {
                colorDisabled = colorBall.name !== COLORS_IN_SEQUENCE[nextColorInSequenceIndex]?.name;
            }
            return (
                <SquareBallButton
                    key={colorBall.name}
                    ball={colorBall}
                    onClick={() => handlePotBall(colorBall)}
                    disabled={colorDisabled || !isGameActive}
                />
            );
        })}
      </div>
      
      <div className="space-y-3">
        <ControlButton onClick={() => dispatch({ type: 'END_TURN_OR_MISS'})} disabled={!isGameActive} className="py-3 text-base">
          End Turn
        </ControlButton>
        <ControlButton onClick={() => dispatch({ type: 'CONCEDE_FRAME'})} disabled={!isGameActive} className="py-3 text-base">
          Concede Frame
        </ControlButton>
      </div>
    </div>
  );
};