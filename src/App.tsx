import React from 'react';
import './App.css';
import GameBoard from './components/Canvas';

const App: React.FC = () => {
  return (
    <div className="App">
      <GameBoard />
    </div>
  );
}

export default App;
