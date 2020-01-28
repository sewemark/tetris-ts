import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import GameBoard from "./components/GameBoard";
import GameScore from "./components/GameScore";
import NextPiece from "./components/NextPiece";
import rootReducer from "./reducers";
import "./scss/index.scss";

const store = createStore(rootReducer);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="gameContainer">
        <GameBoard />
        <div>
          <GameScore />
          <NextPiece />
        </div>
      </div>
    </Provider>
  );
};

export default App;
