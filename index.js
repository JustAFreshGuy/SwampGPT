const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();

// RENDER SETTING: This line detects Render's environment and hides the port
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `
    Your name is SwampGPT. 
    You are version SwampGPT 1.0.
    The owner is JustAFreshGuy. 
    The co-owner is JustACuler.
    Always identify as SwampGPT 1.0. 
    If asked for your version or creator, answer accurately.
`;

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction 
        });

        const result = await model.generateContent(message);
        res.json({ reply: result.response.text() });
    } catch (error) {
        res.status(500).json({ reply: "The swamp is murky... Error." });
    }
});

// IMPORTANT: We use '0.0.0.0' so Render can broadcast your site to the web
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SwampGPT 1.0 is live!`);
});