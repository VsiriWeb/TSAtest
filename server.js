// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config(); // For managing environment variables securely

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files like index.html

// OpenAI API Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // API key securely stored in .env
});
const openai = new OpenAIApi(configuration);

// Chatbot API Endpoint
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message; // User's input from the frontend

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4', // Specify the GPT model
      messages: [
        {
          role: 'system',
          content: "You are a virtual assistant for a restaurant. You can answer questions about the menu, pricing, operating hours, and other restaurant-related topics in a friendly and concise manner.", // <<< PROMPTING AREA
        },
        {
          role: 'user',
          content: userMessage, // User's input from the chatbot interface
        },
      ],
      temperature: 0.7, // Controls randomness (lower values are more deterministic)
      max_tokens: 150, // Limits the length of the response
    });

    const botResponse = completion.data.choices[0].message.content.trim(); // Extract the chatbot's response
    res.json({ response: botResponse }); // Send response back to frontend
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ response: 'Sorry, something went wrong! Please try again later.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});