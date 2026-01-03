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
        const prompt = `Context: You are a logic and critical thinking professor. 
                        Task: Analyze the provided text for logical fallacies.
                        Text to analyze: "${text}".

                        Instructions:
                        1. If no clear fallacy is present, state that the argument appears logically sound and suggest one way to strengthen the evidence further.
                        2. If fallacies are found, identify them by name, and make it bold.
                        3. For each fallacy, provide a concise explanation (max 4 sentences) of why the logic fails in this specific context.
                        4. Conclude with a single sentence of constructive advice to help the user improve the persuasiveness and validity of their claim.
                        
                        Response Format:
                        [Fallacy Name]
                        Explanation: [Explanation]
                        Advice: [Advice]
                        Add a space before every bullet.`;

        const result = await model.generateContent(prompt);
        res.json({ analysis: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Professor is confused. Check your API key or connection." });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Professor is listening on port ${PORT}`));