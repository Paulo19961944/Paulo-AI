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
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Erro desconhecido");
      }

      if (data.choices?.[0]?.message?.content) {
        respostaEl.textContent = data.choices[0].message.content.trim();
      } else {
        respostaEl.textContent = "Nenhuma resposta da IA.";
      }
    } catch (error) {
      respostaEl.textContent = `Erro ao gerar resposta da IA: ${error.message}`;
      console.error("Erro:", error);
    }
  }

  enviarBtn.addEventListener("click", () => enviarPrompt(promptInput.value));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    enviarPrompt(promptInput.value);
  });
});
