export const ACTION_TYPES = {
  SET_GAME_STATE: "setGameState",
  SET_GAME_SCORE: "setGameScore",
};
export const setGameState = (gameState: string) => ({
  type: ACTION_TYPES.SET_GAME_STATE,
  gameState,
});

export const setGameScore = (addedScore: number) => ({
  type: ACTION_TYPES.SET_GAME_SCORE,
  gameScore: addedScore,
});
