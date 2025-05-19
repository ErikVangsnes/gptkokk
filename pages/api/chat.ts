import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message, ingredients } = req.body;

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
          { role: "system", content: "Du er en hjelpsom kokk som gir oppskrifter, tips og alternativer basert på tilgjengelige ingredienser." },
          { role: "user", content: `Jeg har: ${ingredients?.join(", ")}.\n${message}` }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Ingen svar fra kokkehjelperen.";

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Feil ved kontakt med GPT. Prøv igjen senere." });
  }
}
