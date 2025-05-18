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
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro desconhecido");
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        respostaEl.textContent = data.choices[0].message.content.trim();
      } else {
        respostaEl.textContent = "Nenhuma resposta recebida da IA.";
      }
    } catch (error) {
      respostaEl.textContent = `Erro ao gerar resposta da IA:\n${error.message}`;
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
