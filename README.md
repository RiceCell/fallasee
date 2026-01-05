# Fallasee | AI Logic Professor

Fallasee is a full-stack web application designed to act as a **logic professor in your pocket.** It analyzes user arguments for logical fallacies using the Gemini 2.5 Flash API and provides a structured breakdown.

**Link to project:** Wala pa huehue

---

## How It's Made:

**Tech used:** Vue 3 (Vite), Tailwind CSS, Node.js (Express), Gemini API, and JavaScript.

This project was built to solve the "wall of text" problem common with AI responses. Instead of just dumping a paragraph of text, I engineered a system that treats AI analysis like structured data:

* **JSON-Chopped Architecture**: I designed a strict backend prompt that forces Gemini to return a specific JSON object. This allows the frontend to "chop" the answer into separate, styled rectangles for the Fallacy Name, Explanation, Advice, and Reframe.
* **Frontend**: Using Vue 3’s `ref` and `computed` properties, the interface updates instantly once the backend finishes its analysis.
* **Backend"**: Built a Node.js/Express server to securely handle API keys via `.env` and manage communication between the browser and Google's Generative AI servers.

---

## Optimizations

### Data Sanitization & UX
A major challenge was the AI's tendency to include Markdown symbols (like `**`) even inside JSON strings. To fix this, I implemented a two-step optimization:
1. **Prompt Hardening**: Refined the system instructions to explicitly forbid markdown characters in the response.
2. **Frontend Regex Scrubbing**: Added a JavaScript sanitization layer that uses regular expressions (`.replace(/\*/g, '')`) to strip any stray asterisks before the text is rendered.

### Error Handling & Rate Limiting
Working on the free tier, I hit the `429 Too Many Requests` quota limit.

---

## Manifesting the Future:
- [x] Basic API Connection
- [x] JSON Chopping & Component UI
- [x] Fallacy "Reframe" Logic
- [ ] **History Sidebar** (Soon! Maybe!)


---

Built by **Russel** • Powered by **Gemini 2.5**
