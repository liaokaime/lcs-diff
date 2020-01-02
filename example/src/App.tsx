import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Comparison} from "./components/comparison";

const App: React.FC = () => {
  return (
    <div className="App">
        <Comparison/>
    </div>
  );
};

export default App;
