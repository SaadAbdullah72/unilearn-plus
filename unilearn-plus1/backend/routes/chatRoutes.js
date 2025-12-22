const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System Prompt: AI ko batana ke wo kaun hai
const SYSTEM_INSTRUCTION = `
You are 'UniLearn AI', a Senior Technical Architect for an elite coding academy.
Your style:
1. Concise & Technical: Don't write long paragraphs. Use bullet points.
2. Professional: Tone should be serious and helpful.
3. Code-First: If asked for code, provide clean, modern examples.
4. Formatting: Use **bold** for key terms and markdown for code.
Keep responses under 100 words unless asked for detailed code.
`;

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Safety
    if (!process.env.GEMINI_API_KEY) return res.json({ reply: "System Offline." });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    // Combine System Instruction with User Message
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser Question: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ reply: "Server Busy. Retrying..." });
  }
});

module.exports = router;