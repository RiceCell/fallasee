import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"; // Added SchemaType

dotenv.config({ quiet: true });

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// "Shape" of the data here
const schema = {
    description: "Fallacy analysis schema",
    type: SchemaType.OBJECT,
    properties: {
        name: {
            type: SchemaType.STRING,
            description: "The name of the fallacy, or 'None' if logical.",
        },
        explanation: {
            type: SchemaType.STRING,
            description: "Brief explanation of the logic.",
        },
        rating: {
            type: SchemaType.STRING,
            description: "Score out of 100.",
        },
        advice: {
            type: SchemaType.STRING,
            description: "Give tough-love advice using student slang like 'broskie', 'lowkey', 'slay!', 'for real', or 'no cap'. Be blunt."
        },
        reframe: {
            type: SchemaType.STRING,
            description: "A better version of the argument.",
        },
    },
    required: ["name", "explanation", "rating", "advice", "reframe"],
};

app.post('/api/analyze', async (req, res) => {
    try {
        const { text } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const prompt = `Analyze this text for logical fallacies: "${text}". 
                        If no fallacies are found, set name to 'None'.`;

        const result = await model.generateContent(prompt);

        res.json(JSON.parse(result.response.text()));

    } catch (error) {
        console.error(error);
        const status = error.status === 503 ? 503 : 500;
        res.status(status).json({ error: "Professor is having a moment." });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Professor is listening on port ${PORT}`));