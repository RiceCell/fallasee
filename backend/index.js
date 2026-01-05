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

        // tell Gemini to return ONLY JSON
        const prompt = `Context: You are a logic and critical thinking professor. 
                        Analyze the text for logical fallacies: "${text}".

                        Response Format: Return ONLY a JSON object.
                        Do not use asterisks (**), hashtags, or markdown inside the JSON values.
                        {
                          "name": "Fallacy Name (Bold)",
                          "explanation": "Concise explanation (max 4 sentences)",
                          "rating": "Argument Grade: [score out of 100]",
                          "advice": "How to avoid this mistake",
                          "reframe": "1-2 sentence sound version"
                        }

                        If no fallacies are found, use "None" for name and congratulate the user in the explanation.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        const cleanJson = responseText.replace(/```json|```/g, "").trim();

        res.json(JSON.parse(cleanJson));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Professor is very confused." });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Professor is listening on port ${PORT}`));