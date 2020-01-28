export const ACTION_TYPES = {
  SET_GAME_SCORE: "setGameScore",
  SET_GAME_STATE: "setGameState",
  SET_NEXT_PIECE: "setNextPiece",
};

export const setGameState = (gameState: string) => ({
  gameState,
  type: ACTION_TYPES.SET_GAME_STATE,
});

export const setGameScore = (addedScore: number) => ({
  gameScore: addedScore,
  type: ACTION_TYPES.SET_GAME_SCORE,
});

export const setNextPiece = (nextPiece: number[][]) => ({
  nextPiece,
  type: ACTION_TYPES.SET_NEXT_PIECE,
});
