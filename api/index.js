// api/index.js

import { Configuration, OpenAIApi } from "openai";

// 1) Initialize OpenAI with the secret key from environment variables
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 2) The serverless function handler
export default async function handler(request, response) {
  // 2a) Allow CORS so browser requests from any domain will work
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    // 2b) Parse the incoming JSON body, expecting { "message": "..." }
    const { message } = await request.json();

    // 2c) Call OpenAI’s Chat Completion endpoint
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // or "gpt-4" if your account has access
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
      max_tokens: 150,
    });

    // 2d) Extract the AI’s reply from the response
    const aiReply = completion.data.choices[0].message.content;

    // 2e) Send back a JSON response: { "reply": "..." }
    response.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error("Error in OpenAI request:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
}
