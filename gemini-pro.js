import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import readline from "readline";

dotenv.config({ quiet: true });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function detectFallacy(userInput) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are a Logic Professor. Analyze the following statement for logical fallacies:
            "${userInput}"

            Provide the response in this format:
            1. FALLACY: Name
            2. CONFIDENCE: %
            3. EXPLANATION: One simple sentence.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("\n--- PROFESSOR ANALYSIS ---");
        console.log(await response.text());
        console.log("---------------------------\n");

        askQuestion();
    } catch (error) {
        console.error("Error:", error.message);
        askQuestion();
    }
}

function askQuestion() {
    rl.question("Enter an argument to analyze (or type 'exit' to quit): ", (answer) => {
        if (answer.toLowerCase() === 'exit') {
            rl.close();
        } else {
            detectFallacy(answer);
        }
    });
}

console.log("Welcome to Fallasee Terminal Edition!");
askQuestion();