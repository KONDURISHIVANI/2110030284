const express = require('express');
const axios = require('axios');
const config = require('./config');

const app = express();
const port = 5000;
let windowState = [];

const fetchNumber = async (category) => {
  try {
    const response = await axios.get(`${config.THIRD_PARTY_API_URL}${category}`, { timeout: config.TIMEOUT });
    return response.data.number;
  } catch (error) {
    console.error('Error fetching number:', error.message);
    return null;
  }
};

const getAverage = (numbers) => {
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return (sum / numbers.length).toFixed(2);
};

app.post('/numbers/:category', async (req, res) => {
  const category = req.params.category;
  if (!['p', 'f', 'e', 'r'].includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  const number = await fetchNumber(category);
  if (!number || windowState.includes(number)) {
    return res.json({
      windowPrevState: windowState,
      windowCurrState: windowState,
      numbers: [],
      avg: getAverage(windowState)
    });
  }

  const windowPrevState = [...windowState];
  if (windowState.length >= config.WINDOW_SIZE) {
    windowState.shift();
  }
  windowState.push(number);

  return res.json({
    windowPrevState,
    windowCurrState: windowState,
    numbers: [number],
    avg: getAverage(windowState)
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
