import React, { Component } from 'react';
import './App.css';
import AddViewTaskContainer from './AddViewTaskContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Assign Task to your kids!</h1>
        </header>
        <AddViewTaskContainer />
      </div>
    );
  }
}

export default App;