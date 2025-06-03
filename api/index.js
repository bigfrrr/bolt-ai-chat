// api/index.js

// 1) Import the default OpenAI client class
import OpenAI from "openai";

export default async function handler(request, response) {
  // 2) Set CORS headers so your Bolt.New front-end can call this endpoint from any origin
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 3) If someone does a GET (or any non-POST), return a simple text message instead of crashing
  if (request.method !== "POST") {
    return response
      .status(200)
      .send(
        "This endpoint expects a POST with JSON: { \"message\": \"…\" }."
      );
  }

  try {
    // 4) Parse the incoming JSON body: { "message": "Hello AI" }
    const { message } = await request.json();

    // 5) Create an OpenAI client instance using your API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 6) Send the chat completion request (v4+ style)
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if you have access
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
      max_tokens: 150,
    });

    // 7) Extract the AI’s reply text
    const aiReply = completion.choices[0].message.content;

    // 8) Return { reply: "..." } as JSON
    return response.status(200).json({ reply: aiReply });
  } catch (error) {
    // 9) If anything goes wrong, log it so you can inspect in Vercel’s runtime logs
    console.error("OPENAI ERROR:", error);

    // 10) Send a generic 500 Internal Server Error
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
