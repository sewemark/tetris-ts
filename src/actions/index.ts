export const ACTION_TYPES = {
  SET_GAME_SCORE: "setGameScore",
  SET_GAME_STATE: "setGameState",
};

export const setGameState = (gameState: string) => ({
  gameState,
  type: ACTION_TYPES.SET_GAME_STATE,
});

export const setGameScore = (addedScore: number) => ({
  gameScore: addedScore,
  type: ACTION_TYPES.SET_GAME_SCORE,
});
