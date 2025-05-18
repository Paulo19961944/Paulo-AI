export default async function handler(req, res) {
  const apiKey = process.env.GROQ_API_TOKEN;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt inválido." });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "Você é um assistente direto, inteligente e útil." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      return res.status(groqRes.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Erro desconhecido" });
  }
}
