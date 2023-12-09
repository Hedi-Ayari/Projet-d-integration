const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const cors = require('cors'); 

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors()); 
app.use(bodyParser.json());


app.get('/api/questions', async (req, res) => {
  try {
    const questions = await fs.readFile('../game-interface/src/questions.json', 'utf-8');
    res.json(JSON.parse(questions));
  } catch (error) {
    console.error('Error reading questions:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/save-questions', async (req, res) => {
  try {
    const updatedQuestions = req.body.questions;
    const filePath = '../game-interface/src/questions.json';

    await fs.writeFile(filePath, JSON.stringify({ questions: updatedQuestions }, null, 2));

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving questions:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
