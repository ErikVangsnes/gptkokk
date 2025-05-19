// pages/api/chat.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message, ingredients } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ reply: "Manglende API-nøkkel" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Du er en hjelpsom kokk som gir konkrete, kreative forslag basert på brukerens ingredienser. Vær kort, tydelig og praktisk."
          },
          {
            role: "user",
            content: `Jeg har: ${ingredients?.join(", ")}.\n\n${message}`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ reply: "Uventet svar fra OpenAI." });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Feil ved kontakt med GPT. Prøv igjen senere." });
  }
}
