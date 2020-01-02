export const ACTION_TYPES = {
    SET_GAME_STATE: 'setGameState',
}
export const setGameState = (gameState: string) => ({
    type: ACTION_TYPES.SET_GAME_STATE,
    gameState: gameState
});
