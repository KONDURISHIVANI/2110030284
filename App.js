import logo from './logo.svg';
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [category, setCategory] = useState('');
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(0);
  const [message, setMessage] = useState('');

  const addNumber = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/numbers/${category}`);
      setWindowPrevState(response.data.windowPrevState);
      setWindowCurrState(response.data.windowCurrState);
      setNumbers(response.data.numbers);
      setAvg(response.data.avg);
      setMessage('');
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (['p', 'f', 'e', 'r'].includes(category)) {
      addNumber();
    } else {
      setMessage('Please enter a valid category (p, f, e, r)');
    }
    setCategory('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Average Calculator</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category (p, f, e, r)"
          />
          <button type="submit">Add Number</button>
        </form>
        {message && <p>{message}</p>}
        <div>
          <h2>Window Previous State</h2>
          <p>{JSON.stringify(windowPrevState)}</p>
          <h2>Window Current State</h2>
          <p>{JSON.stringify(windowCurrState)}</p>
          <h2>Numbers</h2>
          <p>{JSON.stringify(numbers)}</p>
          <h2>Average</h2>
          <p>{avg}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
