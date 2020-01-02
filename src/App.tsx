import React from 'react';
import './App.css';
import GameBoard from './components/Canvas';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'

const store = createStore(rootReducer)

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <GameBoard />
      </div>
    </Provider>
  );
}

export default App;
