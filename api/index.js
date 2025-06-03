// api/index.js (CommonJS version)

// 1) Load the OpenAI client using require (v4+)
const OpenAI = require("openai");

module.exports = async function handler(request, response) {
  // 2) Set CORS headers so any origin can call this endpoint
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 3) Only accept POST; if not POST, return a friendly message
  if (request.method !== "POST") {
    response
      .status(200)
      .send('This endpoint expects a POST with JSON: { "message": "…" }.');
    return;
  }

  try {
    // 4) Parse the JSON body: { "message": "Hello" }
    const { message } = await request.json();

    // 5) Instantiate the OpenAI client with your API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 6) Call the chat completion endpoint
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-4" if you have access
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user",   content: message },
      ],
      max_tokens: 150,
    });

    // 7) Extract the AI’s reply text
    const aiReply = completion.choices[0].message.content;

    // 8) Return the reply as JSON
    response.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};
