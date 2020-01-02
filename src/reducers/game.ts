import { GAME_STATE } from "../components/Game"
import { ACTION_TYPES } from "../actions"

const game = (state = { gameState: GAME_STATE.NEW_GAME }, action: any) => {
    switch (action.type) {
        case ACTION_TYPES.SET_GAME_STATE:
            return {
                ...state,
                gameState: action.gameState,
            }
        default:
            return state
    }
}
export default game