import React from 'react';
import './scss/index.scss';
import GameBoard from './components/GameBoard';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
import GameScore from './components/GameScore';

const store = createStore(rootReducer)

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="gameContainer">
        <GameBoard  />
        <GameScore  />
      </div>
    </Provider>
  );
}

export default App;
