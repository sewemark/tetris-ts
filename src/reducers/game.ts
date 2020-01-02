import { GAME_STATE } from "../components/Game"

const game = (state = { gameState: GAME_STATE.NEW_GAME}, action:any) => {
    switch (action.type) {
      case 'SET_GAME_STATE':
        return {
          ...state,
          gameState: action.gameState,
        }
      default:
        return state
    }
  }
  export default game