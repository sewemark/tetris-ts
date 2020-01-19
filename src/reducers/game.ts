import { ACTION_TYPES } from "../actions";
import { GAME_STATE } from "../game/Game";

const game = (
  state = { gameState: GAME_STATE.NEW_GAME, gameScore: 0 },
  action: any,
) => {
  switch (action.type) {
    case ACTION_TYPES.SET_GAME_STATE:
      return {
        ...state,
        gameState: action.gameState,
      };
    case ACTION_TYPES.SET_GAME_SCORE:
      return {
        ...state,
        gameScore: state.gameScore + action.gameScore,
      };
    default:
      return state;
  }
};
export default game;
