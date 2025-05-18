document.addEventListener("DOMContentLoaded", () => {
  const promptInput = document.getElementById("prompt");
  const enviarBtn = document.getElementById("enviar-prompt");
  const respostaEl = document.getElementById("resposta");
  const form = document.getElementById("prompt-form");

  async function enviarPrompt(prompt) {
    if (!prompt.trim()) {
      respostaEl.textContent = "Por favor, digite algo.";
      return;
    }

    respostaEl.textContent = "Carregando resposta da IA...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            model: "llama3-8b-8192", // Modelo válido da Groq
            messages: [
                { role: "system", content: "Você é um assistente direto, inteligente e útil." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text(); // Pega texto do erro
            throw new Error(`Erro ${response.status}: ${errorBody}`);
        }

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            respostaEl.textContent = data.choices[0].message.content.trim();
        } else {
            respostaEl.textContent = "Nenhuma resposta recebida da IA.";
        }

        } catch (error) {
        console.error("Erro ao gerar resposta da IA:", error);

        // Mostra mensagem clara
        respostaEl.textContent = `Erro ao gerar resposta da IA:\n${error.message || JSON.stringify(error)}`;
        }


  }

  enviarBtn.addEventListener("click", () => {
    enviarPrompt(promptInput.value);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    enviarPrompt(promptInput.value);
  });
});
