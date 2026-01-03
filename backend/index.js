import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ quiet: true });

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Analyze this for logical fallacies: "${text}". 
                        Format your response clearly with the name of the fallacy and a short explanation that is at most four sentences.`;

        const result = await model.generateContent(prompt);
        res.json({ analysis: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Professor is confused. Check your API key or connection." });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Professor is listening on port ${PORT}`));