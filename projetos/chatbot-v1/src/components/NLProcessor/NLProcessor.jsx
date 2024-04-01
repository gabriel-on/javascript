import React, { useState } from "react";

const NLProcessor = ({ text, onProcessedText }) => {
  // Função para processar o texto
  const processText = (inputText) => {
    // Implemente a lógica de processamento de texto aqui
    // Por exemplo, tokenização, remoção de stopwords, etc.
    const processedText = inputText.toUpperCase(); // Exemplo simples: converter texto para maiúsculas
    return processedText;
  };

  // Chamada da função de processamento quando o texto é alterado
  useEffect(() => {
    if (text && text.trim() !== "") {
      const processedText = processText(text);
      onProcessedText(processedText);
    }
  }, [text]);

  return null; // Este componente não renderiza nada visualmente
};

export default NLProcessor;